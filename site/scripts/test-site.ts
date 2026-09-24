/**
 * Vérification du site construit (dist/) dans un vrai navigateur :
 * 1. accessibilité : axe-core (WCAG 2.0 à 2.2, niveaux A et AA) sur toutes les pages en thème clair,
 *    et sur un échantillon en thème sombre ;
 * 2. mobile : aucune page ne défile horizontalement à 360 px de large ;
 * 3. parcours fonctionnels : progression, quiz, checklists, simulateurs, lettres, recherche,
 *    thème, export / import, stockage indisponible.
 *
 * Usage : npm run build && npm run test:site
 * Chromium : celui de Playwright, ou CHROMIUM_PATH=/chemin/vers/chrome.
 */
import AxeBuilder from '@axe-core/playwright';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync, mkdtempSync } from 'node:fs';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';

const DIST = path.resolve('dist');
const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
};

if (!existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/ absent : lancez « npm run build » avant « npm run test:site ».');
  process.exit(1);
}

// ------------------------------------------------------------------ Serveur statique
const serveur = createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let fichier = path.join(DIST, decodeURIComponent(url.pathname));
  if (!fichier.startsWith(DIST)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(fichier) && statSync(fichier).isDirectory()) fichier = path.join(fichier, 'index.html');
  if (!existsSync(fichier)) {
    res.writeHead(404, { 'content-type': TYPES['.html'] as string }).end(readFileSync(path.join(DIST, '404.html')));
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(fichier)] ?? 'application/octet-stream' });
  res.end(readFileSync(fichier));
});
await new Promise<void>((ok) => serveur.listen(0, '127.0.0.1', ok));
const BASE = `http://127.0.0.1:${(serveur.address() as AddressInfo).port}`;

// ------------------------------------------------------------------ Outils
const echecs: string[] = [];
let reussis = 0;
function verifier(condition: unknown, message: string): void {
  if (condition) reussis++;
  else echecs.push(message);
}

function toutesLesPages(dossier = DIST): string[] {
  return readdirSync(dossier).flatMap((nom) => {
    const chemin = path.join(dossier, nom);
    if (statSync(chemin).isDirectory()) return nom === 'pagefind' || nom === '_astro' ? [] : toutesLesPages(chemin);
    if (!nom.endsWith('.html') || nom === '404.html') return [];
    const html = readFileSync(chemin, 'utf8');
    if (html.includes('http-equiv="refresh"')) return [];
    return [
      '/' +
        path
          .relative(DIST, chemin)
          .replace(/index\.html$/, '')
          .split(path.sep)
          .join('/'),
    ];
  });
}

const executablePath =
  process.env.CHROMIUM_PATH ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const navigateur: Browser = await chromium.launch(executablePath ? { executablePath } : {});

async function nouvellePage(
  options: Parameters<Browser['newContext']>[0] = {},
): Promise<{ ctx: BrowserContext; page: Page; erreurs: string[] }> {
  const ctx = await navigateur.newContext({ locale: 'fr-FR', ...options });
  const page = await ctx.newPage();
  const erreurs: string[] = [];
  page.on('pageerror', (e) => erreurs.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') erreurs.push(m.text());
  });
  return { ctx, page, erreurs };
}

// ------------------------------------------------------------------ 1 et 2. Accessibilité et mobile
const pages = toutesLesPages();
const echantillonSombre = [
  '/',
  '/module/2-1/',
  '/simulateurs/tri/',
  '/annexe/b/',
  '/glossaire/',
  '/a-surveiller/',
  '/annexe/f/',
  '/progression/',
];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function auditer(chemins: string[], theme: 'light' | 'dark'): Promise<void> {
  const { ctx, page, erreurs } = await nouvellePage({ colorScheme: theme, viewport: { width: 1280, height: 900 } });
  for (const chemin of chemins) {
    await page.goto(BASE + chemin, { waitUntil: 'load' });
    const r = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    for (const v of r.violations) {
      echecs.push(
        `axe (${theme}) ${chemin} : ${v.id} [${v.impact}] ${v.help} — ${v.nodes
          .slice(0, 3)
          .map((n) => n.target.join(' '))
          .join(' ; ')}`,
      );
    }
    if (!r.violations.length) reussis++;
  }
  verifier(erreurs.length === 0, `erreurs JavaScript (${theme}) : ${erreurs.join(' | ')}`);
  await ctx.close();
}

async function mobile(chemins: string[]): Promise<void> {
  const { ctx, page } = await nouvellePage({ viewport: { width: 360, height: 740 }, hasTouch: true, isMobile: true });
  for (const chemin of chemins) {
    await page.goto(BASE + chemin, { waitUntil: 'load' });
    const debord = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    verifier(debord <= 0, `mobile 360 px ${chemin} : défilement horizontal de ${debord} px`);
  }
  await ctx.close();
}

console.log(`Audit axe de ${pages.length} pages (thème clair) et ${echantillonSombre.length} pages (thème sombre)…`);
await auditer(pages, 'light');
await auditer(echantillonSombre, 'dark');
console.log('Contrôle du défilement horizontal à 360 px…');
await mobile(pages);

// ------------------------------------------------------------------ 3. Parcours fonctionnels
console.log('Parcours fonctionnels…');
{
  const { ctx, page, erreurs } = await nouvellePage({ viewport: { width: 1280, height: 900 } });

  // Marquer comme lu → progression globale.
  await page.goto(`${BASE}/module/1-1/`);
  await page.click('[data-marquer-lu]');
  verifier(
    (await page.getAttribute('[data-marquer-lu]', 'aria-pressed')) === 'true',
    'marquer comme lu : aria-pressed',
  );
  verifier(
    (await page.textContent('[data-libelle-progression]'))?.includes('1 %'),
    'progression globale après lecture',
  );

  // Quiz : toutes les bonnes réponses, avec mélange des propositions.
  await page.check('#quiz-1-1 [data-quiz-melanger]');
  const questions = page.locator('#quiz-1-1 .quiz__question');
  const n = await questions.count();
  for (let i = 0; i < n; i++) {
    const q = questions.nth(i);
    const bonne = await q.getAttribute('data-reponse');
    await q.locator(`input[value="${bonne}"]`).check();
    await q.locator('[data-quiz-valider]').click();
    verifier(
      (await q.locator('[data-quiz-retour]').textContent())?.startsWith('Bonne réponse.'),
      `quiz 1.1 question ${i + 1} : retour`,
    );
  }
  verifier(
    (await page.textContent('#quiz-1-1 [data-quiz-score]'))?.includes(`${n} sur ${n} (100 %)`),
    'quiz : score final',
  );
  verifier(
    (await page.textContent('#quiz-1-1 [data-quiz-commentaire]'))?.includes('Quiz réussi'),
    'quiz : réussite à 70 %',
  );

  // Recommencer avec mélange : la bonne réponse suit sa proposition.
  await page.click('#quiz-1-1 [data-quiz-bilan] [data-quiz-recommencer]');
  const q0 = questions.nth(0);
  const bonne0 = await q0.getAttribute('data-reponse');
  const mauvaise = ['A', 'B', 'C', 'D'].find((l) => l !== bonne0);
  await q0.locator(`input[value="${mauvaise}"]`).check();
  await q0.locator('[data-quiz-valider]').click();
  verifier(
    (await q0.locator('[data-quiz-retour]').textContent())?.startsWith('Ce n’est pas la bonne réponse.'),
    'quiz : mauvaise réponse signalée',
  );
  const lettres = await q0.locator('[data-lettre-affichee]').allTextContents();
  verifier(lettres.join('') === 'ABCD', `quiz : lettres renumérotées après mélange (${lettres.join('')})`);

  // Mode une question à la fois (recommencer en cours de quiz depuis la barre d'outils).
  await page.click('#quiz-1-1 [data-quiz-outils] [data-quiz-recommencer]');
  await page.check('#quiz-1-1 input[value="une"]');
  verifier((await page.locator('#quiz-1-1 .quiz__question:visible').count()) === 1, 'quiz : une question à la fois');

  // Statut après rechargement.
  await page.reload();
  verifier(
    (await page.textContent('.bandeau [data-statut-module]'))?.includes('quiz réussi'),
    'statut du module après rechargement',
  );
  verifier((await page.textContent('#quiz-1-1 [data-quiz-meilleur]'))?.includes('100 %'), 'meilleur score mémorisé');

  // Infobulle du glossaire au clavier.
  await page.locator('.terme__declencheur').first().focus();
  verifier(await page.locator('.terme__bulle').first().isVisible(), 'infobulle visible au focus');
  await page.keyboard.press('Escape');
  verifier(!(await page.locator('.terme__bulle').first().isVisible()), 'infobulle fermée par Échap');

  // Raccourci « / ».
  await page.locator('body').click({ position: { x: 5, y: 400 } });
  await page.keyboard.press('/');
  verifier(
    (await page.evaluate(() => document.activeElement?.id)) === 'recherche-rapide',
    'raccourci « / » vers la recherche',
  );

  // Checklist persistée.
  await page.goto(`${BASE}/checklist/mettre-en-location-son-premier-logement/`);
  await page.check('[data-checklist] input[data-index="0"]');
  await page.check('[data-checklist] input[data-index="2"]');
  await page.reload();
  verifier(await page.isChecked('[data-checklist] input[data-index="2"]'), 'checklist conservée après rechargement');
  verifier((await page.textContent('[data-checklist-etat]'))?.startsWith('2 sur 13'), 'checklist : compteur');

  // Simulateur : recalcul, adresse partageable, erreur explicite.
  await page.goto(`${BASE}/simulateurs/rentabilite/`);
  verifier(
    (await page.textContent('[data-sim-resultat]'))?.includes('−309,68'),
    'simulateur : exemple du module 1.12 pré-affiché',
  );
  await page.fill('#rentabilite-loyer', '600');
  await page.waitForFunction(() => location.search.includes('loyer=600'));
  verifier(
    (await page.textContent('.sim-synthese'))?.includes('6,10'),
    'simulateur : recalcul (rentabilité brute 6,10 %)',
  );
  await page.goto(`${BASE}/simulateurs/rentabilite/?loyer=600&vacance=0`);
  verifier((await page.inputValue('#rentabilite-loyer')) === '600', 'simulateur : paramètres relus depuis l’adresse');
  await page.fill('#rentabilite-prix', 'abc');
  await page.waitForSelector('#rentabilite-prix[aria-invalid="true"]');
  verifier(
    (await page.textContent('#rentabilite-prix-erreur'))?.includes('Saisissez un nombre'),
    'simulateur : message d’erreur',
  );

  // Lettre : aperçu en direct.
  await page.goto(`${BASE}/annexe/f/`);
  const lieu = page.locator('[data-lettre="f1"] label', { hasText: /^Lieu/ }).first();
  const idLieu = await lieu.getAttribute('for');
  await page.fill(`#${idLieu}`, 'Villeurbanne');
  verifier(
    (await page.textContent('[data-lettre="f1"] [data-lettre-apercu]'))?.includes('Villeurbanne, le [date]'),
    'lettre : aperçu en direct',
  );

  // Recherche Pagefind.
  await page.goto(`${BASE}/recherche/?q=d%C3%A9p%C3%B4t%20de%20garantie`);
  await page.waitForSelector('[data-resultats] li', { timeout: 10_000 }).catch(() => undefined);
  verifier((await page.locator('[data-resultats] li').count()) > 3, 'recherche : résultats pour « dépôt de garantie »');

  // Frise de l'annexe B.
  await page.goto(`${BASE}/annexe/b/`);
  verifier((await page.locator('.frise__aujourdhui').count()) === 1, 'frise : repère « Aujourd’hui »');

  // Thème sombre mémorisé.
  await page.click('[data-theme-bascule]');
  const theme = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.reload();
  verifier((await page.evaluate(() => document.documentElement.dataset.theme)) === theme, 'thème mémorisé');

  // Export, import, réinitialisation.
  await page.goto(`${BASE}/progression/`);
  const [telechargement] = await Promise.all([page.waitForEvent('download'), page.click('[data-exporter]')]);
  const exporte = JSON.parse(readFileSync((await telechargement.path()) as string, 'utf8')) as {
    lus: Record<string, string>;
  };
  verifier(exporte.lus['1.1'], 'export : module 1.1 lu');
  page.on('dialog', (d) => void d.accept());
  await page.click('[data-reinitialiser]');
  verifier((await page.textContent('[data-libelle-progression]'))?.includes('0 %'), 'réinitialisation');
  const dossier = mkdtempSync(path.join(os.tmpdir(), 'progression-'));
  const fichier = path.join(dossier, 'progression.json');
  writeFileSync(fichier, JSON.stringify({ version: 1, lus: { '2.1': '2026-09-24' }, quiz: {}, checklists: {} }));
  await page.setInputFiles('[data-importer]', fichier);
  await page.waitForFunction(() =>
    document.querySelector('[data-progression-statut]')?.textContent?.includes('importée'),
  );
  verifier((await page.textContent('[data-statut-module="2.1"]'))?.includes('Lu'), 'import : module 2.1 lu');
  writeFileSync(fichier, '{"version":1,"lus":');
  await page.setInputFiles('[data-importer]', fichier);
  await page.waitForFunction(() => document.querySelector('[data-progression-statut]')?.textContent?.includes('JSON'));
  reussis++;

  verifier(erreurs.length === 0, `erreurs JavaScript pendant les parcours : ${erreurs.join(' | ')}`);
  await ctx.close();
}

// Stockage indisponible (navigation privée stricte) : le site reste utilisable.
{
  const { ctx, page, erreurs } = await nouvellePage();
  await ctx.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Stockage bloqué', 'SecurityError');
      },
    });
  });
  await page.goto(`${BASE}/module/1-2/`);
  await page.click('[data-marquer-lu]');
  verifier(
    (await page.getAttribute('[data-marquer-lu]', 'aria-pressed')) === 'true',
    'stockage bloqué : lecture marquée en mémoire',
  );
  verifier(
    (await page.textContent('[data-etat-lecture]'))?.includes('stockage du navigateur indisponible'),
    'stockage bloqué : message',
  );
  verifier(erreurs.length === 0, `stockage bloqué : erreurs JavaScript ${erreurs.join(' | ')}`);
  await ctx.close();
}

await navigateur.close();
serveur.close();

console.log(`\n${reussis} vérifications réussies, ${echecs.length} échec(s).`);
if (echecs.length) {
  console.error(`- ${echecs.join('\n- ')}`);
  process.exitCode = 1;
}

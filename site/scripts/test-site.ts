/**
 * Vérification du site construit (dist/) dans un vrai navigateur :
 * 1. accessibilité : axe-core (WCAG 2.0 à 2.2, niveaux A et AA) sur toutes les pages en thème clair,
 *    et sur un échantillon en thème sombre ;
 *    structure de chaque page (un seul h1, niveaux de titres sans saut, régions, titres uniques) et
 *    référencement (titre, description, canonique, Open Graph, JSON-LD, polices préchargées) ;
 * 2. mobile : aucune page ne défile horizontalement à 320 px (critère WCAG 1.4.10), émulation
 *    iPhone et Pixel sur un échantillon ;
 * 3. clavier : parcours complet à la touche Tab (focus visible, jamais masqué, pas de piège),
 *    lien d'évitement ;
 * 4. parcours fonctionnels : progression, quiz, checklists, simulateurs, lettres, recherche,
 *    thème, export / import, stockage indisponible.
 *
 * Usage : npm run build && npm run test:site
 * Chromium : celui de Playwright, ou CHROMIUM_PATH=/chemin/vers/chrome.
 */
import AxeBuilder from '@axe-core/playwright';
import { existsSync, readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { chromium, devices, firefox, webkit, type Browser, type BrowserContext, type Page } from 'playwright';
import { COURS_PUBLIC as COURS } from '../src/lib/edition';
import { demarrerServeur, toutesLesPages, verifierDist } from './serveur-statique';

verifierDist();
const { base: BASE, serveur } = await demarrerServeur();

// ------------------------------------------------------------------ Outils
const echecs: string[] = [];
let reussis = 0;
function verifier(condition: unknown, message: string): void {
  if (condition) reussis++;
  else echecs.push(message);
}

// NAVIGATEUR=chromium (défaut), firefox ou webkit (moteur de Safari) ; Firefox et WebKit :
// « npx playwright install firefox webkit ».
const nomNavigateur = (process.env.NAVIGATEUR ?? 'chromium') as 'chromium' | 'firefox' | 'webkit';
const moteur = { chromium, firefox, webkit }[nomNavigateur];
if (!moteur) throw new Error(`NAVIGATEUR inconnu : ${nomNavigateur}`);
const executablePath =
  nomNavigateur === 'chromium'
    ? (process.env.CHROMIUM_PATH ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined))
    : undefined;
const navigateur: Browser = await moteur.launch(executablePath ? { executablePath } : {});
console.log(`Navigateur : ${nomNavigateur} ${navigateur.version()}`);

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
// Édition « outils » par défaut ; EDITION=complete ajoute les pages et parcours du cours.
const echantillonOutils = [
  '/',
  '/simulateurs/',
  '/simulateurs/tri/',
  '/simulateurs/rentabilite/',
  '/lettres/',
  '/lettres/revision-du-loyer/',
  '/tarifs/',
  '/a-propos/',
];
const echantillonSombre = COURS
  ? [
      '/outils/',
      '/module/2-1/',
      '/annexe/b/',
      '/glossaire/',
      '/a-surveiller/',
      '/annexe/f/',
      '/progression/',
      ...echantillonOutils,
    ]
  : echantillonOutils;
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// Ce qu'un lecteur d'écran expose pour naviguer : titres, régions, titre de la page.
const titresDePage = new Map<string, string>();
async function structure(page: Page, chemin: string): Promise<void> {
  const s = await page.evaluate(() => {
    const titres = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')]
      .filter((h) => !h.closest('[hidden]'))
      .map((h) => Number(h.tagName[1]));
    const sauts = titres.flatMap((n, i) =>
      i > 0 && n > (titres[i - 1] as number) + 1 ? [`h${titres[i - 1]}→h${n}`] : [],
    );
    const navs = [...document.querySelectorAll('nav')];
    return {
      langue: document.documentElement.lang,
      titre: document.title,
      h1: titres.filter((n) => n === 1).length,
      premier: titres[0],
      sauts,
      banniere: document.querySelectorAll('body > header, [role="banner"]').length,
      principal: document.querySelectorAll('main').length,
      pied: document.querySelectorAll('body > footer, [role="contentinfo"]').length,
      h1DansMain: Boolean(document.querySelector('main h1')),
      navsSansNom:
        navs.length > 1
          ? navs.filter((n) => !n.getAttribute('aria-label') && !n.getAttribute('aria-labelledby')).length
          : 0,
    };
  });
  verifier(s.langue === 'fr', `${chemin} : langue ${s.langue}`);
  verifier(s.h1 === 1 && s.premier === 1, `${chemin} : ${s.h1} titre(s) h1, premier titre h${s.premier}`);
  verifier(s.sauts.length === 0, `${chemin} : niveaux de titres sautés ${s.sauts.slice(0, 3).join(', ')}`);
  verifier(s.banniere === 1 && s.principal === 1 && s.pied === 1, `${chemin} : régions ${JSON.stringify(s)}`);
  verifier(s.navsSansNom === 0, `${chemin} : ${s.navsSansNom} navigation(s) sans nom`);
  verifier(s.h1DansMain, `${chemin} : le titre h1 n'est pas dans <main>`);
  await referencement(page, chemin, s.titre);
  const doublon = titresDePage.get(s.titre);
  verifier(!doublon, `${chemin} : même titre de page que ${doublon} (« ${s.titre} »)`);
  titresDePage.set(s.titre, chemin);
}

// Cahier des charges SEO : balises du <head>, données structurées, préchargement des polices.
async function referencement(page: Page, chemin: string, titre: string): Promise<void> {
  const h = await page.evaluate(() => {
    // Pas de fonction nommée ici : tsx ajouterait un appel à __name, inconnu dans la page.
    const [description, ogUrl, ogImage, ogTitre, ogDescription, twitter] = [
      'meta[name="description"]',
      'meta[property="og:url"]',
      'meta[property="og:image"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[name="twitter:card"]',
    ].map((sel) => document.querySelector(sel)?.getAttribute('content') ?? null);
    const jsonLd = [...document.querySelectorAll('head script[type="application/ld+json"]')].map((e) => {
      try {
        return JSON.parse(e.textContent ?? '') as Record<string, unknown>;
      } catch {
        return { erreur: true };
      }
    });
    return {
      description: description ?? '',
      canonique: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
      ogUrl,
      ogImage,
      ogTitre,
      ogDescription,
      twitter,
      polices: document.querySelectorAll('link[rel="preload"][as="font"]').length,
      jsonLd,
      filAriane: [...document.querySelectorAll('.fil-ariane li')].map((li) => li.textContent?.trim()),
    };
  });
  const attendue = new URL(chemin, 'https://formation-locatif.com').href;
  verifier(titre.endsWith(' | Formation Locatif'), `SEO ${chemin} : titre « ${titre} »`);
  verifier(
    h.description.length >= 50 && h.description.length <= 160,
    `SEO ${chemin} : description de ${h.description.length} caractères`,
  );
  verifier(h.canonique === attendue && h.ogUrl === attendue, `SEO ${chemin} : canonique ${h.canonique}`);
  verifier(
    h.ogImage?.endsWith('/images/og-image.webp') && h.ogTitre && h.ogDescription && h.twitter === 'summary_large_image',
    `SEO ${chemin} : Open Graph ou Twitter incomplet`,
  );
  verifier(h.polices >= 3, `SEO ${chemin} : ${h.polices} police(s) préchargée(s)`);
  verifier(!h.jsonLd.some((j) => j.erreur), `SEO ${chemin} : JSON-LD illisible`);
  const ariane = h.jsonLd.find((j) => j['@type'] === 'BreadcrumbList') as
    { itemListElement: { name: string; item?: string }[] } | undefined;
  if (chemin === '/tarifs/') {
    const cours = h.jsonLd.find((j) => j['@type'] === 'Course') as { offers?: { price?: string }[] } | undefined;
    verifier(
      cours?.offers?.length === 4 && cours.offers.every((o) => o.price),
      'SEO /tarifs/ : données structurées Course avec les quatre offres',
    );
  }
  if (chemin === '/') {
    verifier(h.jsonLd.length > 0, `SEO ${chemin} : données structurées`);
  } else {
    verifier(
      ariane && JSON.stringify(ariane.itemListElement.map((e) => e.name)) === JSON.stringify(h.filAriane),
      `SEO ${chemin} : BreadcrumbList absent ou différent du fil d'Ariane affiché`,
    );
    verifier(
      ariane?.itemListElement.slice(0, -1).every((e) => e.item?.startsWith('https://formation-locatif.com/')),
      `SEO ${chemin} : BreadcrumbList sans adresses absolues`,
    );
  }
}

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
    if (theme === 'light') await structure(page, chemin);
  }
  verifier(erreurs.length === 0, `erreurs JavaScript (${theme}) : ${erreurs.join(' | ')}`);
  await ctx.close();
}

async function mobile(chemins: string[], nom: string, options: Parameters<Browser['newContext']>[0]): Promise<void> {
  const { isMobile, ...reste } = options ?? {};
  // Firefox n'émule pas isMobile.
  const { ctx, page, erreurs } = await nouvellePage(nomNavigateur === 'firefox' ? reste : { ...reste, isMobile });
  for (const chemin of chemins) {
    await page.goto(BASE + chemin, { waitUntil: 'load' });
    const m = await page.evaluate(() => ({
      debord: document.documentElement.scrollWidth - window.innerWidth,
      police: parseFloat(getComputedStyle(document.body).fontSize),
    }));
    verifier(m.debord <= 0, `${nom} ${chemin} : défilement horizontal de ${m.debord} px`);
    verifier(m.police >= 16, `${nom} ${chemin} : texte courant en ${m.police} px`);
  }
  verifier(erreurs.length === 0, `${nom} : erreurs JavaScript ${erreurs.join(' | ')}`);
  await ctx.close();
}

// ------------------------------------------------------------------ 3. Clavier
// Parcourt la page à la touche Tab jusqu'à revenir au début : chaque arrêt doit avoir un contour de
// focus visible et ne pas être entièrement masqué (en-tête collant, etc.).
async function clavier(chemin: string): Promise<void> {
  const { ctx, page, erreurs } = await nouvellePage({ viewport: { width: 1280, height: 800 } });
  await page.goto(BASE + chemin, { waitUntil: 'load' });
  // Page qui place d'elle-même le focus (recherche) : il doit être dans le contenu principal.
  const autofocus = await page.evaluate(() =>
    document.activeElement && document.activeElement !== document.body
      ? Boolean(document.querySelector('main')?.contains(document.activeElement))
      : null,
  );
  if (autofocus !== null) verifier(autofocus, `clavier ${chemin} : focus initial hors du contenu principal`);
  const vus = new Set<string>();
  let arrets = 0;
  for (let i = 0; i < 2000; i++) {
    await page.keyboard.press('Tab');
    const f = await page.evaluate((rang) => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      if (!el.dataset.rangFocus) el.dataset.rangFocus = String(rang);
      // Champ visuellement masqué (fichier, etc.) : c'est son libellé qui doit montrer le focus.
      const brut = el.getBoundingClientRect();
      const libelle =
        el instanceof HTMLInputElement && brut.width <= 1 && brut.height <= 1 ? el.labels?.[0] : undefined;
      const cible = libelle ?? el;
      const r = cible.getBoundingClientRect();
      const s = getComputedStyle(cible);
      const points = [
        [r.left + r.width / 2, r.top + r.height / 2],
        [r.left + 2, r.top + 2],
        [r.right - 2, r.top + 2],
        [r.left + 2, r.bottom - 2],
        [r.right - 2, r.bottom - 2],
      ] as const;
      const atteint = points.some(([x, y]) => {
        const d = document.elementFromPoint(x, y);
        return (
          d !== null && (d === el || el.contains(d) || (el instanceof HTMLInputElement && el.labels?.[0]?.contains(d)))
        );
      });
      return {
        cle: el.dataset.rangFocus,
        nom: `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${el.classList[0] ? `.${el.classList[0]}` : ''} « ${(el.textContent ?? '').trim().slice(0, 30)} »`,
        contour: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2,
        visible: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight,
        atteint,
      };
    }, i);
    if (!f) {
      if (arrets > 0) break;
      continue;
    }
    if (vus.has(f.cle)) break;
    vus.add(f.cle);
    arrets++;
    if (arrets === 1 && autofocus === null) {
      verifier(f.nom.includes('lien-evitement'), `clavier ${chemin} : premier arrêt ${f.nom}`);
    }
    verifier(f.contour, `clavier ${chemin} : focus sans contour visible sur ${f.nom}`);
    verifier(f.visible && f.atteint, `clavier ${chemin} : focus masqué ou hors écran sur ${f.nom}`);
  }
  verifier(arrets > 3 && arrets < 2000, `clavier ${chemin} : ${arrets} arrêts (piège ou page vide ?)`);
  // Lien d'évitement : Entrée amène au contenu principal.
  if (autofocus === null) {
    await page.goto(BASE + chemin, { waitUntil: 'load' });
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    verifier(
      await page.evaluate(() => document.querySelector('main')?.contains(document.activeElement)),
      `clavier ${chemin} : le lien d'évitement ne mène pas au contenu`,
    );
  }
  verifier(erreurs.length === 0, `clavier ${chemin} : erreurs JavaScript ${erreurs.join(' | ')}`);
  await ctx.close();
}

console.log(`Audit axe de ${pages.length} pages (thème clair) et ${echantillonSombre.length} pages (thème sombre)…`);
await auditer(pages, 'light');
await auditer(echantillonSombre, 'dark');
console.log('Contrôle du défilement horizontal à 320 px et sur appareils émulés…');
await mobile(pages, '320 px', { viewport: { width: 320, height: 640 }, hasTouch: true, isMobile: true });
for (const appareil of ['iPhone 13', 'Pixel 7'] as const) {
  await mobile(echantillonSombre, appareil, devices[appareil]);
}
const echantillonClavier = [
  '/',
  '/simulateurs/tri/',
  '/lettres/quittance-de-loyer/',
  '/tarifs/',
  ...(COURS
    ? [
        '/module/2-1/',
        '/examen/niveau-1/',
        '/checklist/mettre-en-location-son-premier-logement/',
        '/glossaire/',
        '/recherche/',
        '/progression/',
      ]
    : []),
];
console.log(`Parcours au clavier de ${echantillonClavier.length} pages…`);
for (const chemin of echantillonClavier) await clavier(chemin);

// ------------------------------------------------------------------ 4. Parcours fonctionnels
console.log('Parcours fonctionnels…');
{
  const { ctx, page, erreurs } = await nouvellePage({ viewport: { width: 1280, height: 900 } });

  if (COURS) {
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
  }

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

  // Outil DPE : un logement G n'est plus louable en métropole.
  await page.goto(`${BASE}/simulateurs/dpe-location/?classe=G`);
  verifier(
    (await page.textContent('.sim-synthese'))?.includes('Non'),
    'outil DPE : logement G non louable (paramètre lu depuis l’adresse)',
  );

  // Lettre : aperçu en direct.
  await page.goto(`${BASE}/lettres/revision-du-loyer/`);
  const lieu = page.locator('[data-lettre="f1"] label', { hasText: /^Lieu/ }).first();
  const idLieu = await lieu.getAttribute('for');
  await page.fill(`#${idLieu}`, 'Villeurbanne');
  verifier(
    (await page.textContent('[data-lettre="f1"] [data-lettre-apercu]'))?.includes('Villeurbanne, le [date]'),
    'lettre : aperçu en direct',
  );

  if (COURS) {
    // Recherche Pagefind.
    await page.goto(`${BASE}/recherche/?q=d%C3%A9p%C3%B4t%20de%20garantie`);
    await page.waitForSelector('[data-resultats] li', { timeout: 10_000 }).catch(() => undefined);
    verifier(
      (await page.locator('[data-resultats] li').count()) > 3,
      'recherche : résultats pour « dépôt de garantie »',
    );
  }

  // Impression : la date de mise à jour et l'avertissement restent imprimés.
  await page.goto(`${BASE}/simulateurs/rentabilite/`);
  await page.emulateMedia({ media: 'print' });
  verifier(
    (await page.locator('.mention-maj').isVisible()) &&
      (await page.textContent('.mention-maj'))?.includes('Contenu à jour au'),
    'impression : date de mise à jour imprimée',
  );
  verifier(await page.locator('.avertissement').first().isVisible(), 'impression : avertissement imprimé');
  verifier(!(await page.locator('.entete').isVisible()), 'impression : en-tête masqué');
  await page.emulateMedia({ media: 'screen' });

  if (COURS) {
    // Frise de l'annexe B.
    await page.goto(`${BASE}/annexe/b/`);
    verifier((await page.locator('.frise__aujourdhui').count()) === 1, 'frise : repère « Aujourd’hui »');
  }

  // Thème sombre mémorisé.
  await page.goto(`${BASE}/`);
  await page.click('[data-theme-bascule]');
  const theme = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.reload();
  verifier((await page.evaluate(() => document.documentElement.dataset.theme)) === theme, 'thème mémorisé');

  if (COURS) {
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
    await page.waitForFunction(() =>
      document.querySelector('[data-progression-statut]')?.textContent?.includes('JSON'),
    );
    reussis++;
  }

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
  if (!COURS) {
    await page.goto(`${BASE}/simulateurs/rentabilite/`);
    await page.fill('#rentabilite-loyer', '600');
    await page.click('[data-theme-bascule]');
    verifier(
      (await page.textContent('.sim-synthese'))?.includes('6,10'),
      'stockage bloqué : simulateur et thème utilisables',
    );
  } else {
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
  }
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

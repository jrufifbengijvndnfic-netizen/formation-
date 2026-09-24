/**
 * Lighthouse sur toutes les pages de dist/ (profil mobile par défaut, ou --desktop).
 * Écrit rapports/lighthouse-<profil>.json et affiche les pages sous 95 en performance ou accessibilité.
 * Usage : npm run build && npm run lighthouse [-- --desktop]
 * Lighthouse est téléchargé à la demande (npx) ; Chrome : CHROME_PATH ou celui du système.
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { demarrerServeur, toutesLesPages, verifierDist } from './serveur-statique';

verifierDist();
const bureau = process.argv.includes('--desktop');
const profil = bureau ? 'bureau' : 'mobile';
const chrome =
  process.env.CHROME_PATH ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const { base, serveur } = await demarrerServeur();
const pages = toutesLesPages();
// Appel asynchrone : un appel bloquant empêcherait le serveur statique (même processus) de répondre.
const executer = promisify(execFile);
const tmp = mkdtempSync(path.join(os.tmpdir(), 'lh-'));
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'] as const;
type Scores = Record<(typeof CATEGORIES)[number], number>;
const resultats: { page: string; scores: Scores; lcp: string; cls: string; tbt: string }[] = [];

for (const [i, page] of pages.entries()) {
  const sortie = path.join(tmp, 'rapport.json');
  try {
    await executer(
      'npx',
      [
        '--yes',
        'lighthouse@13',
        base + page,
        '--quiet',
        '--chrome-flags=--headless=new --no-sandbox',
        `--only-categories=${CATEGORIES.join(',')}`,
        '--output=json',
        `--output-path=${sortie}`,
        ...(bureau ? ['--preset=desktop'] : []),
      ],
      {
        env: { ...process.env, ...(chrome ? { CHROME_PATH: chrome } : {}) },
        timeout: 180_000,
        maxBuffer: 64 * 1024 * 1024,
      },
    );
    const r = JSON.parse(readFileSync(sortie, 'utf8'));
    const scores = Object.fromEntries(CATEGORIES.map((c) => [c, Math.round(r.categories[c].score * 100)])) as Scores;
    resultats.push({
      page,
      scores,
      lcp: r.audits['largest-contentful-paint'].displayValue,
      cls: r.audits['cumulative-layout-shift'].displayValue,
      tbt: r.audits['total-blocking-time'].displayValue,
    });
    console.log(`${String(i + 1).padStart(2)}/${pages.length} ${page} ${CATEGORIES.map((c) => scores[c]).join(' / ')}`);
  } catch (e) {
    console.error(`${page} : échec de Lighthouse (${(e as Error).message.split('\n')[0]})`);
  }
}
serveur.close();
rmSync(tmp, { recursive: true, force: true });

mkdirSync('rapports', { recursive: true });
writeFileSync(`rapports/lighthouse-${profil}.json`, JSON.stringify(resultats, null, 2));
const min = (c: (typeof CATEGORIES)[number]) => Math.min(...resultats.map((r) => r.scores[c]));
const moy = (c: (typeof CATEGORIES)[number]) =>
  Math.round(resultats.reduce((s, r) => s + r.scores[c], 0) / Math.max(1, resultats.length));
console.log(`\nLighthouse ${profil} — ${resultats.length}/${pages.length} pages`);
for (const c of CATEGORIES) console.log(`  ${c.padEnd(15)} minimum ${min(c)}, moyenne ${moy(c)}`);
const sous95 = resultats.filter((r) => r.scores.performance < 95 || r.scores.accessibility < 95);
if (sous95.length || resultats.length < pages.length) {
  console.error(
    `Pages sous 95 : ${sous95.map((r) => `${r.page} (${r.scores.performance}/${r.scores.accessibility})`).join(', ') || 'aucune'}`,
  );
  process.exitCode = 1;
}

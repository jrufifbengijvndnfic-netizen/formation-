/**
 * Génère public/images/og-image.webp (1200 × 630), l'image de partage Open Graph et Twitter :
 * titre et accroche de la formation, logo, couleurs et polices du site.
 * À relancer si le titre ou l'accroche changent : npm run image-partage
 * Chromium : celui de Playwright, ou CHROMIUM_PATH=/chemin/vers/chrome.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { chargerFormation } from '../src/lib/formation';
import { texteBrut } from '../src/lib/render';
import { IMAGE_PARTAGE, MARQUE, SITE_PAR_DEFAUT } from '../src/lib/seo';

const formation = chargerFormation();
const titre = formation.titre.split(' — ').at(-1) ?? formation.titre;
const accroche = texteBrut(formation.accroche);
const police = (fichier: string) =>
  `data:font/woff2;base64,${readFileSync(path.resolve('node_modules', fichier)).toString('base64')}`;
const echapper = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const { largeur, hauteur } = IMAGE_PARTAGE;

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
@font-face { font-family: Poppins; font-weight: 700; src: url(${police('@fontsource/poppins/files/poppins-latin-700-normal.woff2')}); }
@font-face { font-family: Poppins; font-weight: 500; src: url(${police('@fontsource/poppins/files/poppins-latin-500-normal.woff2')}); }
@font-face { font-family: 'Texte'; font-weight: 200 900; src: url(${police('@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2')}); }
* { margin: 0; box-sizing: border-box; }
body { width: ${largeur}px; height: ${hauteur}px; background: #1c2330; color: #fff; font-family: Poppins;
  display: flex; flex-direction: column; justify-content: space-between; padding: 72px 84px; }
.bandes { position: absolute; left: 0; right: 0; bottom: 0; height: 14px; display: flex; }
.bandes span { flex: 1; } .n1 { background: #2e6b4f; } .n2 { background: #2b4c7e; } .n3 { background: #7a2e3a; }
.marque { display: flex; align-items: center; gap: 22px; font-size: 30px; font-weight: 500; letter-spacing: .01em; }
svg { width: 64px; height: 64px; color: #fff; }
h1 { font-size: 76px; line-height: 1.08; font-weight: 700; max-width: 980px; }
p { font-family: 'Texte'; font-size: 32px; line-height: 1.4; color: #d7dce3; max-width: 1000px; margin-top: 26px; }
.adresse { font-size: 26px; color: #aab3c0; font-weight: 500; }
</style></head><body>
<div class="marque"><svg viewBox="0 0 32 32"><path d="M4 12.5 13.5 11l1.5 17M13.5 11 13 4M13.5 11 28 14M15 20.5l13 1.2" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="3" y="3" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 5h11v7.2L14.2 9.6Z" fill="#3f8f6a"/><path d="M5 14l7.4-1.1L13.6 27H5Z" fill="#4a73b0"/><path d="M16.2 22.5 27 23.4V27H16.6Z" fill="#b04a5a"/></svg>${echapper(MARQUE)}</div>
<div><h1>${echapper(titre)}</h1><p>${echapper(accroche)}</p></div>
<div class="adresse">${echapper(new URL(SITE_PAR_DEFAUT).host)}</div>
<div class="bandes"><span class="n1"></span><span class="n2"></span><span class="n3"></span></div>
</body></html>`;

const executablePath =
  process.env.CHROMIUM_PATH ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const navigateur = await chromium.launch(executablePath ? { executablePath } : {});
const page = await navigateur.newPage({ viewport: { width: largeur, height: hauteur } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot({ type: 'png' });
// Conversion en WebP par le navigateur lui-même (aucune dépendance supplémentaire).
const webp = await page.evaluate(async (donnees) => {
  const image = new Image();
  image.src = `data:image/png;base64,${donnees}`;
  await image.decode();
  const toile = document.createElement('canvas');
  toile.width = image.width;
  toile.height = image.height;
  toile.getContext('2d')?.drawImage(image, 0, 0);
  return toile.toDataURL('image/webp', 0.9).split(',')[1] ?? '';
}, png.toString('base64'));
await navigateur.close();
const sortie = path.resolve('public', IMAGE_PARTAGE.chemin);
writeFileSync(sortie, Buffer.from(webp, 'base64'));
console.log(
  `${path.relative(process.cwd(), sortie)} : ${largeur} × ${hauteur}, ${Math.round(webp.length * 0.75)} octets`,
);

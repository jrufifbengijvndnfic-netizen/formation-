/**
 * Génère public/favicon.ico à partir de public/favicon.svg (16, 32 et 48 pixels, images PNG dans le
 * conteneur ICO). Les navigateurs et les robots demandent /favicon.ico d'office, même quand la page
 * déclare une icône SVG : sans ce fichier, chaque visite produit un 404.
 * À relancer si le logo change : npm run favicon
 * Chromium : celui de Playwright, ou CHROMIUM_PATH=/chemin/vers/chrome.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const TAILLES = [16, 32, 48];
const svg = readFileSync(path.resolve('public', 'favicon.svg'), 'utf8');

const executablePath =
  process.env.CHROMIUM_PATH ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const navigateur = await chromium.launch(executablePath ? { executablePath } : {});
const images: Buffer[] = [];
for (const taille of TAILLES) {
  const page = await navigateur.newPage({ viewport: { width: taille, height: taille } });
  await page.setContent(
    `<!doctype html><style>*{margin:0}html,body{background:transparent}svg{display:block;width:${taille}px;height:${taille}px}</style>${svg}`,
  );
  images.push(await page.screenshot({ type: 'png', omitBackground: true }));
  await page.close();
}
await navigateur.close();

// Conteneur ICO : en-tête (6 octets), une entrée de 16 octets par image, puis les PNG.
const entete = Buffer.alloc(6);
entete.writeUInt16LE(0, 0);
entete.writeUInt16LE(1, 2);
entete.writeUInt16LE(images.length, 4);
let decalage = 6 + 16 * images.length;
const entrees = images.map((png, i) => {
  const taille = TAILLES[i] as number;
  const e = Buffer.alloc(16);
  e.writeUInt8(taille, 0);
  e.writeUInt8(taille, 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(decalage, 12);
  decalage += png.length;
  return e;
});
const ico = Buffer.concat([entete, ...entrees, ...images]);
const sortie = path.resolve('public', 'favicon.ico');
writeFileSync(sortie, ico);
console.log(`${path.relative(process.cwd(), sortie)} : ${TAILLES.join(', ')} px, ${ico.length} octets`);

/**
 * Génère les carrousels Instagram (1080 × 1350, format portrait 4:5) dans ../communication/instagram/.
 * Contenu : scripts/instagram-carrousels.ts. Couleurs, polices et logo du site.
 * npm run instagram            → tous les carrousels
 * npm run instagram -- 002     → un seul, par numéro
 * Chromium : celui de Playwright, ou CHROMIUM_PATH=/chemin/vers/chrome.
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { A_JOUR_AU, CARROUSELS, type Carrousel, type Diapo } from './instagram-carrousels';

const LARGEUR = 1080;
const HAUTEUR = 1350;
const SORTIE = path.resolve('..', 'communication', 'instagram');
const COULEURS = { 1: '#2e6b4f', 2: '#2b4c7e', 3: '#7a2e3a' } as const;
const DPE: Record<string, string> = { G: '#b3261e', F: '#9e4410', E: '#c98a00', D: '#c9b200' };

const police = (fichier: string) =>
  `data:font/woff2;base64,${readFileSync(path.resolve('node_modules', fichier)).toString('base64')}`;
const e = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
/** Les références d'articles (« 22-2 », « L. 136-8 ») ne se coupent pas au trait d'union. */
const insecable = (t: string) => e(t).replace(/(?:L\. )?\d+(?:-\d+)+/g, (m) => `<span class="insecable">${m}</span>`);

const LOGO = `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 12.5 13.5 11l1.5 17M13.5 11 13 4M13.5 11 28 14M15 20.5l13 1.2" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="3" y="3" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 5h11v7.2L14.2 9.6Z" fill="#2e6b4f"/><path d="M5 14l7.4-1.1L13.6 27H5Z" fill="#2b4c7e"/><path d="M16.2 22.5 27 23.4V27H16.6Z" fill="#7a2e3a"/></svg>`;

const PARCELLAIRE = `<svg class="parcelles" viewBox="0 0 360 240" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1"><path d="M0 38 L64 30 L118 52 L112 118 L40 126 L0 110"/><path d="M118 52 L196 40 L214 104 L112 118"/><path d="M196 40 L270 18 L300 86 L214 104"/><path d="M270 18 L360 30 M300 86 L360 92"/><path d="M40 126 L58 204 L140 196 L112 118"/><path d="M140 196 L226 184 L214 104"/><path d="M226 184 L318 172 L300 86"/><path d="M318 172 L360 176 M58 204 L50 240 M226 184 L236 240 M140 196 L148 240 M0 196 L58 204"/><path d="M64 30 L70 0 M196 40 L188 0"/></g><g fill="none" stroke="currentColor" stroke-dasharray="3 4" opacity=".6"><path d="M0 150 L112 140 L330 128"/></g></svg>`;

const STYLE = `
@font-face { font-family: Titre; font-weight: 500; src: url(${police('@fontsource/poppins/files/poppins-latin-500-normal.woff2')}); }
@font-face { font-family: Titre; font-weight: 600; src: url(${police('@fontsource/poppins/files/poppins-latin-600-normal.woff2')}); }
@font-face { font-family: Titre; font-weight: 700; src: url(${police('@fontsource/poppins/files/poppins-latin-700-normal.woff2')}); }
@font-face { font-family: Texte; font-weight: 200 900; src: url(${police('@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2')}); }
@font-face { font-family: Mono; font-weight: 100 800; src: url(${police('@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2')}); }
* { margin: 0; padding: 0; box-sizing: border-box; }
:root { --encre: #1c2330; --doux: #4a5260; --fond: #f5f7f6; --papier: #fff; --filet: #d3d8de; --rouge: #b3261e; }
body { width: ${LARGEUR}px; height: ${HAUTEUR}px; overflow: hidden; background: var(--fond); color: var(--encre);
  font-family: Titre; font-variant-numeric: tabular-nums; position: relative; }
.diapo { position: absolute; inset: 0; display: flex; flex-direction: column; padding: 92px 88px 76px; }
.diapo::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 16px; background: var(--c); }
.parcelles { position: absolute; right: -60px; top: 40px; width: 620px; color: var(--c); opacity: .13; }
.entete { display: flex; justify-content: space-between; font-family: Mono; font-size: 24px; font-weight: 500;
  color: var(--doux); letter-spacing: .02em; position: relative; }
.entete b { color: var(--c); font-weight: 700; }
.corps { flex: 1; display: flex; flex-direction: column; justify-content: center; position: relative; }
.pied { display: flex; justify-content: space-between; align-items: center; font-size: 24px; font-weight: 500;
  color: var(--doux); position: relative; border-top: 2px solid var(--filet); padding-top: 28px; }
.marque { display: flex; align-items: center; gap: 16px; color: var(--encre); font-weight: 600; }
.marque svg { width: 44px; height: 44px; }
.surtitre { font-family: Mono; font-size: 28px; font-weight: 600; color: var(--c); text-transform: uppercase;
  letter-spacing: .06em; margin-bottom: 28px; }
h1 { font-size: 104px; line-height: 1.04; font-weight: 700; letter-spacing: -.02em; text-wrap: balance; }
h2 { font-size: 72px; line-height: 1.1; font-weight: 700; letter-spacing: -.015em; text-wrap: balance; }
p, li { font-family: Texte; font-size: 40px; line-height: 1.42; color: #2c3440; }
h2 + p, h2 + ul { margin-top: 40px; }
ul { list-style: none; display: flex; flex-direction: column; gap: 22px; }
li { padding-left: 52px; position: relative; }
li::before { content: ''; position: absolute; left: 4px; top: .55em; width: 22px; height: 22px; background: var(--c); border-radius: 4px; }
.note { margin-top: 44px; padding: 26px 32px; background: var(--papier); border-left: 8px solid var(--c);
  border-radius: 0 12px 12px 0; font-size: 34px; }
.tampon { align-self: flex-start; font-family: Mono; font-size: 28px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .1em; color: var(--t); border: 4px solid var(--t); border-radius: 8px; padding: 10px 22px;
  transform: rotate(-3deg); margin-bottom: 44px; }
/* Couverture */
.couverture { background: color-mix(in srgb, var(--c) 11%, var(--fond)); }
.couverture h1 { margin-top: 8px; }
.couverture p { font-size: 44px; margin-top: 44px; max-width: 860px; }
.glisser { display: flex; align-items: center; gap: 14px; color: var(--c); font-weight: 600; }
.glisser::after { content: '→'; font-size: 34px; }
/* Date DPE */
.date { display: flex; align-items: center; gap: 40px; margin-bottom: 56px; }
.lettre { width: 200px; height: 200px; border-radius: 24px; display: grid; place-items: center; color: #fff;
  font-size: 150px; font-weight: 700; line-height: 1; flex: none; }
.date .quand { font-family: Mono; font-size: 52px; font-weight: 700; line-height: 1.15; }
/* Gros chiffre */
.chiffre { font-size: 230px; font-weight: 700; line-height: .95; letter-spacing: -.04em; color: var(--c); margin-bottom: 36px; }
/* Calcul */
.calcul { background: var(--papier); border: 2px solid var(--filet); border-radius: 18px; padding: 16px 44px; margin-top: 48px; }
.calcul div { display: flex; justify-content: space-between; gap: 32px; padding: 22px 0; border-bottom: 2px solid #edf0f2;
  font-family: Texte; font-size: 36px; }
.calcul div span:last-child { font-family: Mono; font-weight: 600; white-space: nowrap; }
.calcul .total { border-bottom: 0; border-top: 4px solid var(--encre); font-family: Titre; font-weight: 700; font-size: 44px; }
.calcul .total span:last-child { font-family: Titre; font-weight: 700; color: var(--c); }
/* Barres */
.barres { display: flex; flex-direction: column; gap: 40px; margin: 60px 0 56px; }
.barre .libelle { display: flex; justify-content: space-between; font-size: 38px; font-weight: 600; margin-bottom: 14px; }
.barre .piste { height: 76px; background: #e3e7ea; border-radius: 12px; overflow: hidden; }
.barre .plein { height: 100%; background: var(--c); border-radius: 12px; }
.barre:first-child .plein { background: #8a93a0; }
/* Catégories */
.categories { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 48px; }
.categories div { background: var(--papier); border: 2px solid var(--filet); border-top: 8px solid var(--c);
  border-radius: 14px; padding: 26px 28px; }
.categories b { display: block; font-size: 36px; font-weight: 700; margin-bottom: 10px; }
.categories span { font-family: Texte; font-size: 29px; line-height: 1.35; color: #2c3440; }
/* Sources */
.sources li { font-family: Mono; font-size: 32px; line-height: 1.4; font-weight: 500; }
.sources li::before { border-radius: 50%; }
.ajour { margin-top: 48px; font-family: Mono; font-size: 30px; font-weight: 600; color: var(--c); }
/* Appel */
.appel { background: var(--encre); color: #fff; }
.appel .entete, .appel .pied { color: #aab3c0; }
.appel .pied { border-top-color: #3a4454; }
.appel .marque, .appel .entete b { color: #fff; }
.insecable { white-space: nowrap; }
.appel h2 { color: #fff; }
.appel p { color: #d7dce3; }
.lien { margin-top: 56px; align-self: flex-start; background: #fff; color: var(--encre); font-size: 34px; font-weight: 600;
  padding: 24px 40px; border-radius: 999px; }
.actions { margin-top: 64px; display: flex; flex-direction: column; gap: 18px; font-size: 32px; font-weight: 500; color: #d7dce3; }
.actions span::before { content: '— '; color: #9fb4d6; }
`;

function corps(d: Diapo): string {
  switch (d.genre) {
    case 'couverture':
      return `<h1>${e(d.titre)}</h1><p>${e(d.sousTitre)}</p>`;
    case 'texte':
      return `${d.tampon ? `<span class="tampon" style="--t:${d.tampon === 'Attention' ? 'var(--rouge)' : 'var(--c)'}">${d.tampon}</span>` : ''}
        ${d.surtitre ? `<div class="surtitre">${e(d.surtitre)}</div>` : ''}<h2>${e(d.titre)}</h2>
        ${d.texte ? `<p>${e(d.texte)}</p>` : ''}
        ${d.liste ? `<ul>${d.liste.map((l) => `<li>${e(l)}</li>`).join('')}</ul>` : ''}
        ${d.note ? `<p class="note">${e(d.note)}</p>` : ''}`;
    case 'date':
      return `<div class="date"><span class="lettre" style="background:${DPE[d.lettre] ?? 'var(--c)'}">${d.lettre}</span>
        <span class="quand">${e(d.date)}</span></div><h2>${e(d.titre)}</h2><p>${e(d.texte)}</p>
        ${d.note ? `<p class="note">${e(d.note)}</p>` : ''}`;
    case 'chiffre':
      return `${d.tampon ? `<span class="tampon" style="--t:var(--rouge)">${d.tampon}</span>` : ''}
        <div class="surtitre">${e(d.surtitre)}</div><div class="chiffre">${e(d.chiffre)}</div>
        <h2>${e(d.titre)}</h2>${d.texte ? `<p>${e(d.texte)}</p>` : ''}`;
    case 'calcul':
      return `<div class="surtitre">${e(d.surtitre)}</div><h2>${e(d.titre)}</h2><div class="calcul">
        ${d.lignes.map(([a, b]) => `<div><span>${e(a)}</span><span>${e(b)}</span></div>`).join('')}
        <div class="total"><span>${e(d.total[0])}</span><span>${e(d.total[1])}</span></div></div>`;
    case 'comparaison': {
      const max = Math.max(...d.barres.map((b) => b.valeur));
      return `<div class="surtitre">Le résultat</div><h2>${e(d.titre)}</h2><div class="barres">
        ${d.barres
          .map(
            (b) => `<div class="barre"><div class="libelle"><span>${e(b.libelle)}</span><span>${e(b.texte)}</span></div>
            <div class="piste"><div class="plein" style="width:${(b.valeur / max) * 100}%"></div></div></div>`,
          )
          .join('')}</div><p class="note">${e(d.texte)}</p>`;
    }
    case 'categories':
      return `<div class="surtitre">${e(d.surtitre)}</div><h2>${e(d.titre)}</h2><div class="categories">
        ${d.categories.map((c) => `<div><b>${e(c.nom)}</b><span>${e(c.exemples)}</span></div>`).join('')}</div>`;
    case 'sources':
      return `<div class="surtitre">Sources</div><h2>Les textes</h2><ul class="sources" style="margin-top:44px">
        ${d.textes.map((t) => `<li>${insecable(t)}</li>`).join('')}</ul>
        <div class="ajour">À jour au ${A_JOUR_AU}</div><p class="note">${e(d.note)}</p>`;
    case 'appel':
      return `<div class="surtitre" style="color:#9fb4d6">Pour aller plus loin</div><h2>${e(d.titre)}</h2><p style="margin-top:36px">${e(d.texte)}</p>
        <span class="lien">Lien en bio</span>
        <div class="actions"><span>${e(d.lien)}</span><span>Enregistrez ce carrousel pour le retrouver</span>
        <span>Une question ? Posez-la en commentaire</span></div>`;
  }
}

function page(c: Carrousel, d: Diapo, rang: number): string {
  const total = String(c.diapos.length).padStart(2, '0');
  const numero = String(rang + 1).padStart(2, '0');
  const classe = d.genre === 'couverture' ? 'couverture' : d.genre === 'appel' ? 'appel' : '';
  const droite =
    d.genre === 'couverture' ? `<span class="glisser">Faites défiler</span>` : `<span>${e(c.module)}</span>`;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>${STYLE}</style></head>
<body style="--c:${COULEURS[c.niveau]}">
<div class="diapo ${classe}">${d.genre === 'couverture' ? PARCELLAIRE : ''}
<div class="entete"><span>Dossier n° <b>${c.numero}</b> · ${e(c.rubrique)}</span><span>${numero} / ${total}</span></div>
<div class="corps">${corps(d)}</div>
<div class="pied"><span class="marque">${LOGO}Formation Locatif</span>${droite}</div>
</div></body></html>`;
}

const filtre = process.argv[2];
const choisis = CARROUSELS.filter((c) => !filtre || c.numero === filtre);
if (choisis.length === 0) throw new Error(`Aucun carrousel n° ${filtre}`);

const executablePath =
  process.env.CHROMIUM_PATH ?? (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const navigateur = await chromium.launch(executablePath ? { executablePath } : {});
const onglet = await navigateur.newPage({ viewport: { width: LARGEUR, height: HAUTEUR } });
for (const c of choisis) {
  const dossier = path.join(SORTIE, c.slug);
  rmSync(dossier, { recursive: true, force: true });
  mkdirSync(dossier, { recursive: true });
  for (const [rang, d] of c.diapos.entries()) {
    await onglet.setContent(page(c, d, rang), { waitUntil: 'load' });
    await onglet.evaluate(() => document.fonts.ready);
    // Garde-fou : aucun texte ne doit sortir de la diapositive.
    const deborde = await onglet.evaluate(() => {
      const zone = document.querySelector('.corps');
      return zone ? zone.scrollHeight > zone.clientHeight + 1 : false;
    });
    if (deborde) console.warn(`⚠ ${c.slug} diapo ${rang + 1} : le texte déborde`);
    writeFileSync(
      path.join(dossier, `${String(rang + 1).padStart(2, '0')}.png`),
      await onglet.screenshot({ type: 'png' }),
    );
  }
  console.log(`${path.relative(path.resolve('..'), dossier)} : ${c.diapos.length} diapositives`);
}
await navigateur.close();

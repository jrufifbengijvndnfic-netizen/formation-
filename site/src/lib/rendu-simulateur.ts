/** Rendu HTML (chaîne) d'un résultat de simulateur, identique au build et dans le navigateur. */
import { echapper } from './format';
import type { BlocResultat, Resultat, TableauResultat } from './simulateurs';

const e = echapper;

function tableau(t: TableauResultat): string {
  const num = (i: number) => (t.numeriques?.[i] ? ' class="num"' : '');
  return `<div class="tableau${t.lignes.length > 12 ? ' tableau--long' : ''}" role="region" tabindex="0" aria-label="${e(t.legende)}"><table>
<thead><tr>${t.entetes.map((x, i) => `<th scope="col"${num(i)}>${e(x)}</th>`).join('')}</tr></thead>
<tbody>${t.lignes.map((l) => `<tr>${l.map((x, i) => `<td${num(i)}>${e(x)}</td>`).join('')}</tr>`).join('\n')}</tbody>
</table></div>`;
}

const LIBELLES_ALERTE = { info: 'À noter', attention: 'Attention', surveiller: 'À surveiller' } as const;

function bloc(b: BlocResultat): string {
  const morceaux: string[] = [`<h3>${e(b.titre)}</h3>`];
  if (b.alerte) {
    morceaux.push(
      `<div class="sim-alerte sim-alerte--${b.alerte.genre}" role="note"><p class="sim-alerte__etiquette">${LIBELLES_ALERTE[b.alerte.genre]}</p><p>${e(b.alerte.texte)}</p></div>`,
    );
  }
  if (b.tableau) morceaux.push(tableau(b.tableau));
  if (b.lignes?.length) {
    morceaux.push(
      `<dl class="sim-lignes">${b.lignes
        .map(
          (l) =>
            `<div class="sim-ligne${l.fort ? ' sim-ligne--fort' : ''}"><dt>${e(l.libelle)}${
              l.detail ? `<span class="sim-ligne__detail">${e(l.detail)}</span>` : ''
            }</dt><dd>${e(l.valeur)}</dd></div>`,
        )
        .join('')}</dl>`,
    );
  }
  if (b.texte) morceaux.push(`<p class="sim-texte">${e(b.texte)}</p>`);
  return `<section class="sim-bloc">${morceaux.join('\n')}</section>`;
}

export function rendreResultat(r: Resultat): string {
  const synthese = `<ul class="sim-synthese" role="list">${r.synthese
    .map(
      (x) =>
        `<li class="sim-chiffre"><span class="sim-chiffre__libelle">${e(x.libelle)}</span><span class="sim-chiffre__valeur">${e(x.valeur)}</span>${
          x.detail ? `<span class="sim-chiffre__detail">${e(x.detail)}</span>` : ''
        }</li>`,
    )
    .join('')}</ul>`;
  return `${synthese}\n${r.blocs.map(bloc).join('\n')}`;
}

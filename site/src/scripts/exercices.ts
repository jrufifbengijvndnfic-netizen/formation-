/**
 * Exercices notés : correction de toute la série, score, meilleur score enregistré, recommencer.
 * Sur une page d'examen, le corrigé d'un cas reste masqué jusqu'à la correction des questions du cas,
 * et le score de l'examen (moyenne pondérée des cas) est enregistré quand tous les cas sont faits.
 */
import { estCorrect, type Exercice, type LettreExercice, type ReponseDonnee } from '../lib/exercices';
import { enregistrerExamen, enregistrerExercices, SEUIL_REUSSITE, type EtatQuiz } from '../lib/progression';
import { maintenant, modifier, progression } from './stockage';

const pct = (x: number) => `${Math.round(x * 100)}\u00a0%`;

/** Reconstitue l'exercice (données de correction) depuis les attributs de l'élément. */
function lireExercice(li: HTMLElement): Exercice {
  const d = li.dataset;
  return {
    id: d.exercice ?? '',
    type: d.type as Exercice['type'],
    question: '',
    options: {},
    lettres: (d.lettres ? d.lettres.split(',') : []) as LettreExercice[],
    ...(d.valeur !== undefined ? { valeur: Number(d.valeur) } : {}),
    tolerance: Number(d.tolerance ?? 0),
    ...(d.vrai !== undefined ? { vrai: d.vrai === 'true' } : {}),
    explication: '',
    source: '',
  };
}

function reponseDe(li: HTMLElement): ReponseDonnee {
  const type = li.dataset.type;
  if (type === 'nombre') return li.querySelector<HTMLInputElement>('input')?.value.trim() || null;
  const cochees = [...li.querySelectorAll<HTMLInputElement>('input:checked')].map((i) => i.value);
  if (type === 'vf') return cochees[0] ?? null;
  return cochees;
}

const etatDe = (bloc: HTMLElement): EtatQuiz | undefined => {
  const cle = bloc.dataset.exercices ?? '';
  const p = progression();
  return bloc.dataset.portee === 'module' ? p.exercices[cle] : p.examens[cle];
};

function afficherMeilleur(bloc: HTMLElement): void {
  const e = etatDe(bloc);
  const cible = bloc.querySelector<HTMLElement>('[data-ex-meilleur]');
  if (cible)
    cible.textContent = e
      ? `Votre meilleur score : ${pct(e.meilleur)}${e.meilleur >= SEUIL_REUSSITE ? ' (réussi)' : ''}.`
      : '';
}

/** Corrigé du cas (page d'examen) : l'élément <details class="corrige"> qui suit la série. */
function corrigeDuCas(bloc: HTMLElement): HTMLElement | null {
  let suivant = bloc.nextElementSibling;
  // Astro peut placer la balise <script> du composant juste après le premier bloc.
  while (suivant?.tagName === 'SCRIPT') suivant = suivant.nextElementSibling;
  return suivant instanceof HTMLElement && suivant.matches('details.corrige') ? suivant : null;
}

/** Le corrigé est masqué par la feuille de style (sans décalage) tant qu'il n'est pas débloqué. */
function montrerCorrige(bloc: HTMLElement, visible: boolean): void {
  corrigeDuCas(bloc)?.classList.toggle('est-debloque', visible);
  const note = bloc.querySelector<HTMLElement>('[data-note-corrige]');
  if (note) note.hidden = visible;
}

/** Score global d'un examen : moyenne des meilleurs scores des cas, pondérée par le nombre de questions. */
function majExamen(examen: string): void {
  const blocs = [...document.querySelectorAll<HTMLElement>(`[data-exercices^="${examen}:cas-"]`)];
  if (!blocs.length) return;
  const p = progression();
  let points = 0;
  let total = 0;
  let complet = true;
  for (const b of blocs) {
    const n = b.querySelectorAll('[data-exercice]').length;
    const e = p.examens[b.dataset.exercices ?? ''];
    if (!e) complet = false;
    points += (e?.meilleur ?? 0) * n;
    total += n;
  }
  const bilan = document.querySelector<HTMLElement>(`[data-bilan-examen="${examen}"]`);
  const score = total ? points / total : 0;
  if (bilan) {
    bilan.textContent = complet
      ? `Score de l'examen (meilleurs scores de chaque cas) : ${pct(score)} — ${score >= SEUIL_REUSSITE ? 'examen réussi.' : 'sous le seuil de 70 % : retravaillez les cas manqués.'}`
      : `Cas corrigés : ${blocs.filter((b) => p.examens[b.dataset.exercices ?? '']).length} sur ${blocs.length}. Le score de l'examen s'affiche quand tous les cas sont faits.`;
  }
  // Enregistré seulement quand le score global change (nouveau meilleur score d'un cas).
  if (complet && p.examens[examen]?.dernier !== score) {
    modifier((q) => enregistrerExamen(q, examen, score, maintenant()));
  }
}

/** Mélange l'ordre des questions ; une question « suite » reste après celle qu'elle prolonge. */
function melanger(liste: HTMLElement): void {
  const groupes: Element[][] = [];
  for (const it of [...liste.children]) {
    if (it instanceof HTMLElement && it.dataset.suite !== undefined && groupes.length) groupes.at(-1)?.push(it);
    else groupes.push([it]);
  }
  for (let i = groupes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [groupes[i], groupes[j]] = [groupes[j] as Element[], groupes[i] as Element[]];
  }
  groupes.flat().forEach((it, rang) => {
    liste.appendChild(it);
    const r = it.querySelector('.exercice__rang');
    if (r) r.textContent = r.textContent?.replace(/^Question \d+/, `Question ${rang + 1}`) ?? '';
  });
}

function initialiser(bloc: HTMLElement): void {
  const form = bloc.querySelector<HTMLFormElement>('form');
  const bilan = bloc.querySelector<HTMLElement>('[data-ex-bilan]');
  const recommencer = bloc.querySelector<HTMLButtonElement>('[data-ex-recommencer]');
  const corriger = bloc.querySelector<HTMLButtonElement>('[data-ex-corriger]');
  if (!form || !bilan || !recommencer || !corriger) return;
  const cle = bloc.dataset.exercices ?? '';
  const examen = bloc.dataset.portee === 'examen' ? cle.split(':')[0] : undefined;

  if (bloc.dataset.portee === 'examen') montrerCorrige(bloc, Boolean(etatDe(bloc)));
  afficherMeilleur(bloc);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const items = [...form.querySelectorAll<HTMLElement>('[data-exercice]')];
    let justes = 0;
    for (const li of items) {
      const r = reponseDe(li);
      const ok = estCorrect(lireExercice(li), r);
      if (ok) justes++;
      li.dataset.resultat = ok ? 'juste' : 'faux';
      const verdict = li.querySelector('[data-verdict]');
      if (verdict)
        verdict.textContent = ok ? 'Juste' : r === null || (Array.isArray(r) && !r.length) ? 'Sans réponse' : 'Faux';
      li.querySelectorAll('input').forEach((i) => (i.disabled = true));
    }
    const score = items.length ? justes / items.length : 0;
    bloc.dataset.corrige = '';
    corriger.hidden = true;
    recommencer.hidden = false;
    bilan.textContent = `Score : ${justes} / ${items.length} (${pct(score)}). ${
      score >= SEUIL_REUSSITE
        ? 'Réussi : le seuil de 70 % est atteint.'
        : 'Sous le seuil de 70 % : relisez les explications, revoyez la leçon, puis recommencez.'
    }`;
    modifier((p) =>
      bloc.dataset.portee === 'module'
        ? enregistrerExercices(p, cle, score, maintenant())
        : enregistrerExamen(p, cle, score, maintenant()),
    );
    afficherMeilleur(bloc);
    montrerCorrige(bloc, true);
    if (examen) majExamen(examen);
    bilan.focus();
  });

  recommencer.addEventListener('click', () => {
    form.reset();
    form.querySelectorAll('input').forEach((i) => (i.disabled = false));
    form.querySelectorAll<HTMLElement>('[data-exercice]').forEach((li) => delete li.dataset.resultat);
    delete bloc.dataset.corrige;
    bilan.textContent = '';
    recommencer.hidden = true;
    corriger.hidden = false;
    const liste = form.querySelector<HTMLElement>('.exercices__liste');
    if (liste) melanger(liste);
    form.querySelector<HTMLInputElement>('input')?.focus();
  });
}

document.querySelectorAll<HTMLElement>('[data-exercices]').forEach(initialiser);
new Set(
  [...document.querySelectorAll<HTMLElement>('[data-exercices][data-portee="examen"]')].map(
    (b) => (b.dataset.exercices ?? '').split(':')[0] ?? '',
  ),
).forEach((examen) => majExamen(examen));

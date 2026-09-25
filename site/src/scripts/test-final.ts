/**
 * Test final : tirage de 50 questions dans la banque (au moins une par module), affichage avec les
 * propositions mélangées, correction globale, bilan par module, meilleur score enregistré.
 */
import { estCorrect, LETTRES_EXERCICE, nombreFrancais, tirer, type ReponseDonnee } from '../lib/exercices';
import { enregistrerExamen, SEUIL_REUSSITE } from '../lib/progression';
import type { BanqueTest, QuestionTest } from '../lib/test-final';
import { maintenant, modifier, progression } from './stockage';

const racine = document.querySelector<HTMLElement>('[data-test-final]');
const pct = (x: number) => `${Math.round(x * 100)}\u00a0%`;
const LIBELLES: Record<QuestionTest['type'], string> = {
  qcm: 'Une seule bonne réponse',
  multi: 'Plusieurs bonnes réponses : cochez-les toutes',
  nombre: 'Calcul : saisissez le résultat',
  vf: 'Vrai ou faux',
};

function el<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string> = {}, texte?: string) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (texte !== undefined) e.textContent = texte;
  return e;
}

function melanger<T>(t: T[]): T[] {
  const c = [...t];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j] as T, c[i] as T];
  }
  return c;
}

/** Une question : propositions mélangées, lettres affichées selon leur position. */
function rendreQuestion(q: QuestionTest, rang: number): { li: HTMLLIElement; attendu: string } {
  const li = el('li', { class: 'exercice', 'data-question': q.id });
  const fs = el('fieldset');
  const legende = el('legend');
  legende.append(el('span', { class: 'exercice__rang' }, `Question ${rang} · ${LIBELLES[q.type]}`), q.question);
  fs.append(legende);
  const nom = `test-${q.id}`;
  let attendu: string;
  if (q.type === 'qcm' || q.type === 'multi') {
    const box = el('div', { class: 'exercice__options' });
    const ordre = melanger(LETTRES_EXERCICE.filter((l) => q.options[l]));
    const affichee: Record<string, string> = {};
    ordre.forEach((l, i) => {
      const lettre = LETTRES_EXERCICE[i] as string;
      affichee[l] = lettre;
      const label = el('label', { class: 'exercice__option' });
      label.append(
        el('input', { type: q.type === 'qcm' ? 'radio' : 'checkbox', name: nom, value: l }),
        el('span', { class: 'quiz__lettre' }, lettre),
        el('span', {}, q.options[l] ?? ''),
      );
      box.append(label);
    });
    fs.append(box);
    attendu = q.lettres
      .map((l) => ({ l: affichee[l] ?? l, t: q.options[l] ?? '' }))
      .sort((a, b) => a.l.localeCompare(b.l))
      .map((x) => `${x.l} — ${x.t}`)
      .join(' ; ');
  } else if (q.type === 'vf') {
    const box = el('div', { class: 'exercice__options exercice__options--vf' });
    for (const [v, t] of [
      ['V', 'Vrai'],
      ['F', 'Faux'],
    ] as const) {
      const label = el('label', { class: 'exercice__option' });
      label.append(el('input', { type: 'radio', name: nom, value: v }), el('span', {}, t));
      box.append(label);
    }
    fs.append(box);
    attendu = q.vrai ? 'Vrai' : 'Faux';
  } else {
    const box = el('div', { class: 'exercice__saisie' });
    const champ = el('span', { class: 'exercice__champ' });
    champ.append(
      el('input', { id: nom, name: nom, type: 'text', inputmode: 'decimal', autocomplete: 'off', spellcheck: 'false' }),
    );
    if (q.unite) champ.append(el('span', { class: 'exercice__unite' }, q.unite));
    box.append(el('label', { for: nom }, 'Votre réponse'), champ);
    fs.append(box);
    attendu = `${nombreFrancais(q.valeur ?? 0)}${q.unite ? `\u00a0${q.unite}` : ''}`;
  }
  const correction = el('div', { class: 'exercice__correction' });
  const reponse = el('p');
  reponse.append(el('strong', {}, 'Réponse attendue\u00a0:'), ` ${attendu}`);
  correction.append(el('p', { class: 'exercice__verdict', 'data-verdict': '' }), reponse, el('p', {}, q.explication));
  fs.append(correction);
  li.append(fs);
  return { li, attendu };
}

function reponseDe(li: HTMLElement, q: QuestionTest): ReponseDonnee {
  if (q.type === 'nombre') return li.querySelector<HTMLInputElement>('input')?.value.trim() || null;
  const cochees = [...li.querySelectorAll<HTMLInputElement>('input:checked')].map((i) => i.value);
  return q.type === 'vf' ? (cochees[0] ?? null) : cochees;
}

if (racine) {
  const zone = racine.querySelector<HTMLElement>('[data-test-zone]');
  const liste = racine.querySelector<HTMLOListElement>('[data-test-liste]');
  const form = zone?.querySelector('form');
  const commencer = racine.querySelector<HTMLButtonElement>('[data-test-commencer]');
  const corriger = racine.querySelector<HTMLButtonElement>('[data-test-corriger]');
  const nouveau = racine.querySelector<HTMLButtonElement>('[data-test-nouveau]');
  const etat = racine.querySelector<HTMLElement>('[data-test-etat]');
  const bilan = racine.querySelector<HTMLElement>('[data-test-bilan]');
  const meilleur = racine.querySelector<HTMLElement>('[data-test-meilleur]');
  let banque: BanqueTest | null = null;
  let tirage: QuestionTest[] = [];

  const afficherMeilleur = () => {
    const e = progression().examens['test-final'];
    if (meilleur)
      meilleur.textContent = e
        ? `Votre meilleur score : ${pct(e.meilleur)}${e.meilleur >= SEUIL_REUSSITE ? ' (réussi)' : ''}, ${e.tentatives} essai${e.tentatives > 1 ? 's' : ''}.`
        : '';
  };
  afficherMeilleur();

  const lancer = async () => {
    if (!zone || !liste || !corriger || !nouveau || !bilan) return;
    try {
      if (!banque) {
        if (etat) etat.textContent = 'Préparation du tirage…';
        const r = await fetch(racine.dataset.banque ?? '');
        banque = (await r.json()) as BanqueTest;
      }
    } catch {
      if (etat) etat.textContent = 'Impossible de charger les questions : vérifiez votre connexion et réessayez.';
      return;
    }
    tirage = tirer(banque.questions, banque.total);
    liste.replaceChildren(...tirage.map((q, i) => rendreQuestion(q, i + 1).li));
    delete zone.dataset.corrige;
    zone.hidden = false;
    bilan.hidden = true;
    corriger.hidden = false;
    nouveau.hidden = true;
    if (commencer) commencer.hidden = true;
    if (etat)
      etat.textContent = `${tirage.length} questions tirées dans ${new Set(tirage.map((q) => q.source)).size} modules. Bon courage !`;
    liste.querySelector<HTMLInputElement>('input')?.focus();
  };

  commencer?.addEventListener('click', () => void lancer());
  nouveau?.addEventListener('click', () => void lancer());

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!banque || !zone || !liste || !bilan || !corriger || !nouveau) return;
    const sansReponse = tirage.filter((q, i) => {
      const r = reponseDe(liste.children[i] as HTMLElement, q);
      return r === null || (Array.isArray(r) && !r.length);
    }).length;
    const parModule = new Map<string, { justes: number; total: number }>();
    let justes = 0;
    tirage.forEach((q, i) => {
      const li = liste.children[i] as HTMLElement;
      const r = reponseDe(li, q);
      const ok = estCorrect(q, r);
      if (ok) justes++;
      const m = parModule.get(q.source) ?? { justes: 0, total: 0 };
      parModule.set(q.source, { justes: m.justes + (ok ? 1 : 0), total: m.total + 1 });
      li.dataset.resultat = ok ? 'juste' : 'faux';
      const v = li.querySelector('[data-verdict]');
      if (v) v.textContent = ok ? 'Juste' : r === null || (Array.isArray(r) && !r.length) ? 'Sans réponse' : 'Faux';
      li.querySelectorAll('input').forEach((x) => (x.disabled = true));
    });
    zone.dataset.corrige = '';
    corriger.hidden = true;
    nouveau.hidden = false;
    const score = justes / tirage.length;
    modifier((p) => enregistrerExamen(p, 'test-final', score, maintenant()));
    afficherMeilleur();
    const scoreEl = bilan.querySelector('[data-test-score]');
    if (scoreEl) {
      scoreEl.textContent = `Score : ${justes} / ${tirage.length} (${pct(score)})${sansReponse ? `, dont ${sansReponse} sans réponse` : ''}. ${
        score >= banque.seuil
          ? 'Examen final réussi : bravo.'
          : `Sous le seuil de ${pct(banque.seuil)} : revoyez les modules signalés, puis refaites un tirage.`
      }`;
    }
    const corps = bilan.querySelector('[data-test-modules]');
    corps?.replaceChildren(
      ...[...parModule.entries()]
        .sort(([a], [b]) => a.localeCompare(b, 'fr', { numeric: true }))
        .map(([numero, r]) => {
          const info = banque?.modules[numero];
          const tr = el('tr');
          const td1 = el('td');
          td1.append(el('a', { href: info?.href ?? '#' }, info?.titre ?? `Module ${numero}`));
          const aRevoir = r.justes < r.total;
          tr.append(
            td1,
            el('td', { class: 'num' }, `${r.justes} / ${r.total}`),
            el('td', {}, aRevoir ? 'À revoir' : 'Acquis'),
          );
          return tr;
        }),
    );
    bilan.hidden = false;
    bilan.focus();
  });
}

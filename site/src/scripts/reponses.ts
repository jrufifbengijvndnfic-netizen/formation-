/**
 * Réponses de l'outil « Poser une question », partagées par le panneau « Une question ? » (toutes les
 * pages du cours), la page Recherche et la page /assistant/. Les fiches (/assistant/fiches.json) sont
 * chargées une fois, au premier besoin ; chaque question est traitée dans le navigateur, sans envoi.
 * Le HTML des fiches vient du build (contenu de la formation) ; la question, de textContent.
 * Fiche d'un module réservé dont le niveau n'est pas ouvert (accès par code, src/lib/acces.ts) : le
 * passage n'est pas affiché, seulement où il se trouve.
 */
import { niveauDuModule } from '../lib/acces';
import { IndexFiches, repondre, type BaseFiches, type Resultat } from '../lib/assistant-recherche';
import { CHEMIN_VENTE } from '../lib/navigation';
import type { Niveau } from '../lib/types';
import { chercherPages, extrait } from './pagefind';

const base = (import.meta.env.BASE_URL ?? '/').replace(/\/?$/, '/');
export const ADRESSE_RECHERCHE = `${base}recherche/`;
export const ADRESSE_QUESTIONS = `${base}assistant/`;
export const CLE_HISTORIQUE = 'formation-immobilier-locatif-2026:assistant';

let index: Promise<IndexFiches> | null = null;

/** Fiches chargées une seule fois (nouvel essai possible après un échec réseau). */
export function chargerIndex(): Promise<IndexFiches> {
  index ??= fetch(`${base}assistant/fiches.json`)
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json() as Promise<BaseFiches>;
    })
    .then((b) => new IndexFiches(b))
    .catch((e: unknown) => {
      index = null;
      throw e;
    });
  return index;
}

// ---------------------------------------------------------------------------
// Historique de la visite (questions seulement ; les réponses sont recalculées)
// ---------------------------------------------------------------------------

export function lireHistorique(): string[] {
  try {
    const brut = JSON.parse(window.sessionStorage.getItem(CLE_HISTORIQUE) ?? '[]') as unknown;
    return Array.isArray(brut) ? brut.filter((q): q is string => typeof q === 'string').slice(-20) : [];
  } catch {
    return [];
  }
}

export function ecrireHistorique(questions: string[]): void {
  try {
    window.sessionStorage.setItem(CLE_HISTORIQUE, JSON.stringify(questions.slice(-20)));
  } catch {
    /* conversation non mémorisée : sans conséquence */
  }
}

// ---------------------------------------------------------------------------
// Construction des éléments
// ---------------------------------------------------------------------------

export function element<K extends keyof HTMLElementTagNameMap>(
  balise: K,
  classe?: string,
  texte?: string,
): HTMLElementTagNameMap[K] {
  const e = document.createElement(balise);
  if (classe) e.className = classe;
  if (texte !== undefined) e.textContent = texte;
  return e;
}

const titre = (niveau: number, classe: string | undefined, texte: string): HTMLElement =>
  element(`h${Math.min(6, niveau)}` as 'h2', classe, texte);

function lienVers(r: Resultat, texte: string, classe?: string): HTMLAnchorElement {
  const a = element('a', classe, texte);
  a.href = r.fiche.u;
  return a;
}

function contenu(html: string): HTMLDivElement {
  const div = element('div', 'assistant__contenu prose');
  div.innerHTML = html;
  return div;
}

/** Niveau à ouvrir pour lire la fiche, s'il n'est pas ouvert dans ce navigateur (data-acces sur <html>). */
function niveauFerme(r: Resultat): Niveau | undefined {
  const n = r.fiche.m ? niveauDuModule(r.fiche.m) : undefined;
  if (n === undefined) return undefined;
  return (document.documentElement.dataset.acces ?? '').split(' ').includes(String(n)) ? undefined : n;
}

/** À la place du passage d'un niveau fermé : où il se trouve, et comment l'ouvrir. */
function apercuReserve(r: Resultat, n: Niveau): HTMLDivElement {
  const div = element('div', 'assistant__reserve');
  div.append(
    element(
      'p',
      undefined,
      `La réponse se trouve dans le module ${r.fiche.m}, réservé au niveau ${n} : saisissez votre code d’accès sur la page du module pour la lire.`,
    ),
  );
  const offres = element('a', undefined, 'Voir les offres');
  offres.href = `${base}${CHEMIN_VENTE}#offre`;
  const p = element('p');
  p.append('Pas encore de code ? ', offres, '.');
  div.append(p);
  return div;
}

/** Passage de la fiche, ou son aperçu si son niveau n'est pas ouvert. */
const passage = (r: Resultat): HTMLDivElement => {
  const n = niveauFerme(r);
  return n ? apercuReserve(r, n) : contenu(r.fiche.h);
};

function liste(resultats: Resultat[]): HTMLUListElement {
  const ul = element('ul');
  for (const r of resultats) {
    const li = element('li');
    li.append(lienVers(r, r.fiche.t), element('span', 'assistant__provenance', r.fiche.c));
    ul.append(li);
  }
  return ul;
}

function blocALire(niveau: number, intitule: string, resultats: Resultat[]): HTMLElement {
  const bloc = element('div', 'assistant__plus');
  bloc.append(titre(niveau, undefined, intitule), liste(resultats));
  return bloc;
}

function blocAutres(resultats: Resultat[]): HTMLElement {
  const details = element('details', 'assistant__plus assistant__autres');
  details.append(element('summary', undefined, `Voir d’autres réponses (${resultats.length})`), liste(resultats));
  return details;
}

function blocQuestions(niveau: number, resultats: Resultat[]): HTMLElement {
  const bloc = element('div', 'assistant__plus');
  bloc.append(titre(niveau, undefined, 'Questions proches'));
  for (const r of resultats) {
    const details = element('details', 'assistant__question-proche');
    details.append(element('summary', undefined, r.fiche.t));
    const p = element('p', 'assistant__provenance');
    p.append(lienVers(r, r.fiche.c));
    details.append(passage(r), p);
    bloc.append(details);
  }
  return bloc;
}

export interface OptionsReponse {
  /** Niveau du titre de la réponse (h2 sur une page, h3 dans le panneau). */
  niveau: number;
  moduleCourant?: string | undefined;
  /** Adresse de contact : proposée quand la formation ne répond pas. */
  email?: string | undefined;
  /** Faux sur la page Recherche : les résultats plein texte y sont déjà affichés. */
  lienRecherche?: boolean;
}

/** Réponse à une question : passage principal, pistes, questions proches, autres réponses. */
export function construireReponse(
  idx: IndexFiches,
  question: string,
  options: OptionsReponse,
): { element: HTMLElement; resume: string; trouvee: boolean } {
  const bloc = element('div', 'assistant__reponse');
  const r = repondre(idx, question, options.moduleCourant);
  const sous = options.niveau + 1;
  if (r.principale) {
    const p = r.principale;
    const source = element('p', 'assistant__source');
    source.append('D’après ', lienVers(p, p.fiche.c));
    const ferme = niveauFerme(p);
    bloc.append(source, titre(options.niveau, 'assistant__titre', p.fiche.t), passage(p));
    const suite = element('p', 'assistant__lire');
    suite.append(
      lienVers(p, ferme ? 'Aller au module' : 'Lire le passage dans la formation', 'bouton bouton--discret'),
    );
    bloc.append(suite);
    if (r.aLire.length) bloc.append(blocALire(sous, 'À lire aussi', r.aLire));
    if (r.questionsProches.length) bloc.append(blocQuestions(sous, r.questionsProches));
    if (r.autres.length) bloc.append(blocAutres(r.autres));
    const resume = ferme
      ? `Réponse dans le module ${p.fiche.m}, réservé au niveau ${ferme}.`
      : `Réponse trouvée : ${p.fiche.t}, ${p.fiche.c}.`;
    return { element: bloc, resume, trouvee: true };
  }
  bloc.classList.add('assistant__reponse--introuvable');
  bloc.append(
    titre(options.niveau, 'assistant__titre', 'Je n’ai pas trouvé de passage qui réponde clairement'),
    element(
      'p',
      undefined,
      'Essayez avec d’autres mots, plus proches de ceux de la formation (par exemple « dépôt de garantie », « congé », « révision du loyer »), ou en une question plus courte.',
    ),
  );
  if (r.aLire.length) bloc.append(blocALire(sous, 'Pistes possibles', r.aLire));
  if (r.questionsProches.length) bloc.append(blocQuestions(sous, r.questionsProches));
  const autres = element('p');
  if (options.lienRecherche !== false) {
    const recherche = element('a', undefined, 'recherche plein texte');
    recherche.href = `${ADRESSE_RECHERCHE}?q=${encodeURIComponent(question)}`;
    autres.append('Vous pouvez aussi lancer une ', recherche, '.');
  }
  if (options.email) {
    const mail = element('a', undefined, 'posez-la par e-mail');
    mail.href = `mailto:${options.email}?subject=${encodeURIComponent('Question sur la formation')}&body=${encodeURIComponent(question)}`;
    autres.append(' Si la formation ne répond pas à votre question, ', mail, ' : réponse sous 72 heures ouvrées.');
  }
  if (autres.childNodes.length) bloc.append(autres);
  return { element: bloc, resume: 'Aucun passage ne répond clairement ; des pistes sont proposées.', trouvee: false };
}

/** Pages du site qui contiennent les mots de la question (recherche plein texte), ajoutées à `bloc`. */
export async function ajouterPages(bloc: HTMLElement, question: string, niveau: number, limite = 3): Promise<void> {
  const trouve = await chercherPages(question, limite).catch(() => null);
  if (!trouve || trouve.total === 0) return;
  const cadre = element('div', 'assistant__plus assistant__pages');
  cadre.append(titre(niveau, undefined, 'Dans les pages'));
  const ul = element('ul');
  for (const d of trouve.pages) {
    const li = element('li');
    const a = element('a', undefined, d.meta.title ?? d.url);
    a.href = d.url;
    const p = element('span', 'assistant__provenance');
    p.append(extrait(d.excerpt));
    li.append(a, p);
    ul.append(li);
  }
  const tout = element('p', 'assistant__provenance');
  const lien = element('a', undefined, `Tous les résultats de la recherche (${trouve.total})`);
  lien.href = `${ADRESSE_RECHERCHE}?q=${encodeURIComponent(question)}`;
  tout.append(lien);
  cadre.append(ul, tout);
  bloc.append(cadre);
}

// ---------------------------------------------------------------------------
// Passage dans la page courante
// ---------------------------------------------------------------------------

/**
 * Si `href` désigne un passage de la page affichée, y fait défiler et le surligne un instant
 * (les fragments de texte « #:~:text= » ne s'appliquent qu'au chargement d'une page). Vrai si fait.
 */
export function allerAuPassage(href: string): boolean {
  const url = new URL(href, window.location.href);
  if (url.pathname !== window.location.pathname || !url.hash) return false;
  const [ancre = '', directive = ''] = url.hash.slice(1).split(':~:');
  const zone = (ancre && document.getElementById(decodeURIComponent(ancre))) || document.querySelector('main');
  if (!zone) return false;
  const texte = directive.startsWith('text=') ? decodeURIComponent(directive.slice(5)) : '';
  const espaces = (t: string) => t.replace(/\s+/g, ' ');
  const cible =
    (texte &&
      [...zone.querySelectorAll<HTMLElement>('p, li, td, th, h2, h3, blockquote')].find((e) =>
        espaces(e.textContent ?? '').includes(texte),
      )) ||
    zone;
  const doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  cible.scrollIntoView({ block: 'center', behavior: doux ? 'smooth' : 'auto' });
  cible.classList.remove('passage-surligne');
  void cible.offsetWidth;
  cible.classList.add('passage-surligne');
  window.setTimeout(() => cible.classList.remove('passage-surligne'), 3000);
  return true;
}

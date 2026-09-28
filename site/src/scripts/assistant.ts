/**
 * Outil « Poser une question » : conversation dans la page. Les fiches (/assistant/fiches.json) sont
 * chargées une fois ; chaque question est traitée dans le navigateur (src/lib/assistant-recherche.ts),
 * sans serveur ni envoi de données. Les questions de la visite sont gardées dans sessionStorage pour
 * retrouver la conversation au retour d'un module.
 */
import { IndexFiches, repondre, type BaseFiches, type Resultat } from '../lib/assistant-recherche';

const racine = document.querySelector<HTMLElement>('[data-assistant]');
const fil = racine?.querySelector<HTMLOListElement>('[data-fil]');
const formulaire = racine?.querySelector<HTMLFormElement>('[data-formulaire]');
const champ = racine?.querySelector<HTMLTextAreaElement>('[data-question]');
const envoyer = racine?.querySelector<HTMLButtonElement>('[data-envoyer]');
const etat = racine?.querySelector<HTMLElement>('[data-etat]');
const annonce = racine?.querySelector<HTMLElement>('[data-annonce]');
const effacer = racine?.querySelector<HTMLButtonElement>('[data-effacer]');
const contexte = racine?.querySelector<HTMLElement>('[data-contexte]');

const CLE_HISTORIQUE = 'formation-immobilier-locatif-2026:assistant';
const parametres = new URLSearchParams(window.location.search);
let moduleCourant = /^\d\.\d{1,2}$/.test(parametres.get('module') ?? '') ? (parametres.get('module') as string) : '';
let index: IndexFiches | null = null;
let historique: string[] = lireHistorique();

function lireHistorique(): string[] {
  try {
    const brut = JSON.parse(window.sessionStorage.getItem(CLE_HISTORIQUE) ?? '[]') as unknown;
    return Array.isArray(brut) ? brut.filter((q): q is string => typeof q === 'string').slice(-20) : [];
  } catch {
    return [];
  }
}

function ecrireHistorique(): void {
  try {
    window.sessionStorage.setItem(CLE_HISTORIQUE, JSON.stringify(historique.slice(-20)));
  } catch {
    /* conversation non mémorisée : sans conséquence */
  }
  if (effacer) effacer.hidden = historique.length === 0;
}

// ---------------------------------------------------------------------------
// Construction des messages (le HTML des fiches vient du build ; la question, de textContent)
// ---------------------------------------------------------------------------

function element<K extends keyof HTMLElementTagNameMap>(
  balise: K,
  classe?: string,
  texte?: string,
): HTMLElementTagNameMap[K] {
  const e = document.createElement(balise);
  if (classe) e.className = classe;
  if (texte !== undefined) e.textContent = texte;
  return e;
}

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

/** Autres passages : titre, provenance et lien. */
function blocALire(titre: string, resultats: Resultat[]): HTMLElement {
  const bloc = element('div', 'assistant__plus');
  bloc.append(element('h3', undefined, titre));
  const liste = element('ul');
  for (const r of resultats) {
    const li = element('li');
    li.append(lienVers(r, r.fiche.t), element('span', 'assistant__provenance', r.fiche.c));
    liste.append(li);
  }
  bloc.append(liste);
  return bloc;
}

/** Autres résultats, repliés : titre, provenance et lien. */
function blocAutres(resultats: Resultat[]): HTMLElement {
  const details = element('details', 'assistant__plus assistant__autres');
  details.append(element('summary', undefined, `Voir d’autres réponses (${resultats.length})`));
  const liste = element('ul');
  for (const r of resultats) {
    const li = element('li');
    li.append(lienVers(r, r.fiche.t), element('span', 'assistant__provenance', r.fiche.c));
    liste.append(li);
  }
  details.append(liste);
  return details;
}

/** Questions de quiz et d'exercices proches, réponse dépliable. */
function blocQuestions(resultats: Resultat[]): HTMLElement {
  const bloc = element('div', 'assistant__plus');
  bloc.append(element('h3', undefined, 'Questions proches'));
  for (const r of resultats) {
    const details = element('details', 'assistant__question-proche');
    details.append(element('summary', undefined, r.fiche.t));
    const p = element('p', 'assistant__provenance');
    p.append(lienVers(r, r.fiche.c));
    details.append(contenu(r.fiche.h), p);
    bloc.append(details);
  }
  return bloc;
}

function messageQuestion(question: string): HTMLLIElement {
  const li = element('li', 'assistant__message assistant__message--eleve');
  li.append(element('span', 'visuellement-cache', 'Votre question : '), element('p', undefined, question));
  return li;
}

function messageReponse(question: string): { li: HTMLLIElement; resume: string } {
  const li = element('li', 'assistant__message assistant__message--formation');
  const r = repondre(index as IndexFiches, question, moduleCourant || undefined);
  if (r.principale) {
    const p = r.principale;
    const source = element('p', 'assistant__source');
    source.append('D’après ', lienVers(p, p.fiche.c));
    li.append(source, element('h2', 'assistant__titre', p.fiche.t), contenu(p.fiche.h));
    const suite = element('p', 'assistant__lire');
    suite.append(lienVers(p, 'Lire le passage dans la formation', 'bouton bouton--discret'));
    li.append(suite);
    if (r.aLire.length) li.append(blocALire('À lire aussi', r.aLire));
    if (r.questionsProches.length) li.append(blocQuestions(r.questionsProches));
    if (r.autres.length) li.append(blocAutres(r.autres));
    return { li, resume: `Réponse trouvée : ${p.fiche.t}, ${p.fiche.c}.` };
  }
  li.classList.add('assistant__message--introuvable');
  li.append(
    element('h2', 'assistant__titre', 'Je n’ai pas trouvé de passage qui réponde clairement'),
    element(
      'p',
      undefined,
      'Essayez avec d’autres mots, plus proches de ceux de la formation (par exemple « dépôt de garantie », « congé », « révision du loyer »), ou en une question plus courte.',
    ),
  );
  if (r.aLire.length) li.append(blocALire('Pistes possibles', r.aLire));
  if (r.questionsProches.length) li.append(blocQuestions(r.questionsProches));
  const autres = element('p');
  const recherche = element('a', undefined, 'recherche plein texte');
  recherche.href = `${racine?.dataset.recherche ?? ''}?q=${encodeURIComponent(question)}`;
  autres.append('Vous pouvez aussi lancer une ', recherche, '.');
  const email = racine?.dataset.email;
  if (email) {
    const mail = element('a', undefined, 'posez-la par e-mail');
    mail.href = `mailto:${email}?subject=${encodeURIComponent('Question sur la formation')}&body=${encodeURIComponent(question)}`;
    autres.append(' Si la formation ne répond pas à votre question, ', mail, ' : réponse sous 72 heures ouvrées.');
  }
  li.append(autres);
  return { li, resume: 'Aucun passage ne répond clairement ; des pistes sont proposées.' };
}

function poser(question: string, memoriser = true): void {
  const propre = question.replace(/\s+/g, ' ').trim();
  if (!propre || !index || !fil) return;
  fil.append(messageQuestion(propre));
  const { li, resume } = messageReponse(propre);
  fil.append(li);
  if (annonce) annonce.textContent = resume;
  if (memoriser) {
    historique.push(propre);
    ecrireHistorique();
    li.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }
}

// ---------------------------------------------------------------------------
// Contexte « module » (lien « Une question sur ce module ? »)
// ---------------------------------------------------------------------------

function afficherContexte(): void {
  if (!contexte) return;
  contexte.hidden = !moduleCourant;
  const texte = contexte.querySelector('[data-contexte-texte]');
  if (texte) texte.textContent = `Réponses tirées en priorité du module ${moduleCourant}.`;
}

contexte?.querySelector('[data-contexte-retirer]')?.addEventListener('click', () => {
  moduleCourant = '';
  afficherContexte();
  champ?.focus();
});

// ---------------------------------------------------------------------------
// Démarrage
// ---------------------------------------------------------------------------

formulaire?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!champ) return;
  poser(champ.value);
  champ.value = '';
  champ.focus();
});

champ?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault();
    formulaire?.requestSubmit();
  }
});

racine?.addEventListener('click', (e) => {
  const bouton = e.target instanceof Element ? e.target.closest<HTMLButtonElement>('[data-exemple]') : null;
  if (bouton?.dataset.exemple && index) poser(bouton.dataset.exemple);
});

effacer?.addEventListener('click', () => {
  historique = [];
  ecrireHistorique();
  fil?.querySelectorAll('li.assistant__message').forEach((li, k) => {
    if (k > 0) li.remove();
  });
  if (annonce) annonce.textContent = 'Conversation effacée.';
  champ?.focus();
});

async function demarrer(): Promise<void> {
  afficherContexte();
  try {
    const reponse = await fetch(racine?.dataset.fiches ?? '');
    if (!reponse.ok) throw new Error(String(reponse.status));
    index = new IndexFiches((await reponse.json()) as BaseFiches);
  } catch {
    if (etat) etat.textContent = 'La formation n’a pas pu être chargée. Rechargez la page.';
    return;
  }
  if (champ) champ.disabled = false;
  if (envoyer) envoyer.disabled = false;
  if (etat) etat.textContent = `${index.taille.toLocaleString('fr-FR')} passages de la formation disponibles.`;
  for (const q of historique) poser(q, false);
  ecrireHistorique();
  const demandee = parametres.get('q');
  if (demandee) poser(demandee);
  else if (moduleCourant) champ?.focus();
}

void demarrer();

/**
 * Page /assistant/ : version pleine page de l'outil « Poser une question », avec toutes les questions
 * fréquentes par thème. Sur les autres pages du cours, le même outil est dans le panneau
 * « Une question ? » (src/scripts/panneau.ts). Réponses : src/scripts/reponses.ts.
 */
import { ajouterPages, chargerIndex, construireReponse, ecrireHistorique, element, lireHistorique } from './reponses';
import type { IndexFiches } from '../lib/assistant-recherche';

const racine = document.querySelector<HTMLElement>('[data-assistant]');
const fil = racine?.querySelector<HTMLOListElement>('[data-fil]');
const formulaire = racine?.querySelector<HTMLFormElement>('[data-formulaire]');
const champ = racine?.querySelector<HTMLTextAreaElement>('[data-question]');
const envoyer = racine?.querySelector<HTMLButtonElement>('[data-envoyer]');
const etat = racine?.querySelector<HTMLElement>('[data-etat]');
const annonce = racine?.querySelector<HTMLElement>('[data-annonce]');
const effacer = racine?.querySelector<HTMLButtonElement>('[data-effacer]');
const contexte = racine?.querySelector<HTMLElement>('[data-contexte]');

const parametres = new URLSearchParams(window.location.search);
let moduleCourant = /^\d\.\d{1,2}$/.test(parametres.get('module') ?? '') ? (parametres.get('module') as string) : '';
let index: IndexFiches | null = null;
let historique = lireHistorique();

function majEffacer(): void {
  if (effacer) effacer.hidden = historique.length === 0;
}

function poser(question: string, memoriser = true): void {
  const propre = question.replace(/\s+/g, ' ').trim();
  if (!propre || !index || !fil) return;
  const q = element('li', 'assistant__message assistant__message--eleve');
  q.append(element('span', 'visuellement-cache', 'Votre question : '), element('p', undefined, propre));
  const li = element('li', 'assistant__message assistant__message--formation');
  const { element: reponse, resume } = construireReponse(index, propre, {
    niveau: 2,
    moduleCourant: moduleCourant || undefined,
    email: racine?.dataset.email,
  });
  li.append(reponse);
  fil.append(q, li);
  void ajouterPages(reponse, propre, 3);
  if (annonce) annonce.textContent = resume;
  if (memoriser) {
    historique.push(propre);
    ecrireHistorique(historique);
    majEffacer();
    li.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }
}

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
  ecrireHistorique(historique);
  majEffacer();
  fil?.querySelectorAll('li.assistant__message').forEach((li, k) => {
    if (k > 0) li.remove();
  });
  if (annonce) annonce.textContent = 'Conversation effacée.';
  champ?.focus();
});

async function demarrer(): Promise<void> {
  afficherContexte();
  try {
    index = await chargerIndex();
  } catch {
    if (etat) etat.textContent = 'La formation n’a pas pu être chargée. Rechargez la page.';
    return;
  }
  if (champ) champ.disabled = false;
  if (envoyer) envoyer.disabled = false;
  if (etat) etat.textContent = `${index.taille.toLocaleString('fr-FR')} passages de la formation disponibles.`;
  for (const q of historique) poser(q, false);
  majEffacer();
  const demandee = parametres.get('q');
  if (demandee) poser(demandee);
  else if (moduleCourant) champ?.focus();
}

void demarrer();

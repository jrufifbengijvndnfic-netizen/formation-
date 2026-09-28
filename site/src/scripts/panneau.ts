/**
 * Panneau « Une question ? » (src/components/PanneauQuestion.astro).
 * - Le bouton l'ouvre à côté de la leçon (en bas de l'écran sur mobile) ; Échap ou ✕ le ferme.
 * - Une question posée dans le panneau, ou dans la barre de recherche de l'en-tête, affiche la
 *   réponse de la formation puis les pages trouvées par la recherche plein texte.
 * - « Lire le passage » vers la page affichée fait défiler jusqu'au paragraphe et le surligne.
 * - La conversation suit l'élève de page en page (sessionStorage) ; sur grand écran, le panneau
 *   resté ouvert se rouvre sur la page suivante.
 */
import {
  ajouterPages,
  allerAuPassage,
  chargerIndex,
  construireReponse,
  ecrireHistorique,
  element,
  lireHistorique,
} from './reponses';

const panneau = document.querySelector<HTMLElement>('[data-panneau]');
const bouton = document.querySelector<HTMLButtonElement>('[data-panneau-bouton]');
const messages = panneau?.querySelector<HTMLOListElement>('[data-panneau-messages]');
const formulaire = panneau?.querySelector<HTMLFormElement>('[data-panneau-formulaire]');
const champ = panneau?.querySelector<HTMLTextAreaElement>('[data-panneau-champ]');
const annonce = panneau?.querySelector<HTMLElement>('[data-panneau-annonce]');
const effacer = panneau?.querySelector<HTMLButtonElement>('[data-panneau-effacer]');
const contexte = panneau?.querySelector<HTMLElement>('[data-panneau-contexte]');

const CLE_OUVERT = 'formation-immobilier-locatif-2026:panneau-ouvert';
const grandEcran = () => window.matchMedia('(min-width: 64rem)').matches;
let moduleCourant = panneau?.dataset.module ?? '';
let historique = lireHistorique();
let conversationAffichee = false;

function memoriserOuverture(ouvert: boolean): void {
  try {
    if (ouvert) window.sessionStorage.setItem(CLE_OUVERT, '1');
    else window.sessionStorage.removeItem(CLE_OUVERT);
  } catch {
    /* sans conséquence */
  }
}

function majEffacer(): void {
  if (effacer) effacer.hidden = historique.length === 0;
}

// ---------------------------------------------------------------------------
// Questions et réponses
// ---------------------------------------------------------------------------

async function poser(question: string, options: { memoriser?: boolean; defiler?: boolean } = {}): Promise<void> {
  const propre = question.replace(/\s+/g, ' ').trim();
  if (!propre || !messages) return;
  const { memoriser = true, defiler = true } = options;
  const q = element('li', 'assistant__message assistant__message--eleve');
  q.append(element('span', 'visuellement-cache', 'Votre question : '), element('p', undefined, propre));
  const r = element('li', 'assistant__message assistant__message--formation');
  r.append(element('p', 'assistant__provenance', 'Recherche dans la formation…'));
  messages.append(q, r);
  if (memoriser) {
    historique.push(propre);
    ecrireHistorique(historique);
    majEffacer();
  }
  try {
    const index = await chargerIndex();
    const { element: reponse, resume } = construireReponse(index, propre, {
      niveau: 3,
      moduleCourant: moduleCourant || undefined,
      email: panneau?.dataset.email,
    });
    r.replaceChildren(reponse);
    if (annonce && memoriser) annonce.textContent = resume;
    // Double effet : les pages du site qui contiennent ces mots, sous la réponse.
    void ajouterPages(reponse, propre, 4);
  } catch {
    r.replaceChildren(
      element('p', undefined, 'La formation n’a pas pu être chargée. Vérifiez la connexion et réessayez.'),
    );
  }
  if (defiler) r.scrollIntoView({ block: 'start', behavior: 'auto' });
}

/** Questions déjà posées pendant la visite (sur cette page ou une autre), réaffichées une fois. */
function afficherConversation(): void {
  if (conversationAffichee) return;
  conversationAffichee = true;
  for (const q of historique.slice(-6)) void poser(q, { memoriser: false, defiler: false });
  majEffacer();
}

// ---------------------------------------------------------------------------
// Ouverture et fermeture
// ---------------------------------------------------------------------------

function ouvrir(options: { focus?: boolean } = {}): void {
  if (!panneau || !bouton) return;
  panneau.hidden = false;
  bouton.setAttribute('aria-expanded', 'true');
  document.documentElement.classList.add('panneau-ouvert');
  memoriserOuverture(true);
  afficherConversation();
  void chargerIndex().catch(() => undefined);
  if (options.focus !== false) champ?.focus();
}

function fermer(): void {
  if (!panneau || !bouton) return;
  panneau.hidden = true;
  bouton.setAttribute('aria-expanded', 'false');
  document.documentElement.classList.remove('panneau-ouvert');
  memoriserOuverture(false);
  bouton.focus();
}

bouton?.addEventListener('click', () => (panneau?.hidden ? ouvrir() : fermer()));
panneau?.querySelector('[data-panneau-fermer]')?.addEventListener('click', fermer);
panneau?.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fermer();
});

formulaire?.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!champ?.value.trim()) return;
  void poser(champ.value);
  champ.value = '';
  champ.focus();
});
champ?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault();
    formulaire?.requestSubmit();
  }
});

effacer?.addEventListener('click', () => {
  historique = [];
  ecrireHistorique(historique);
  messages?.replaceChildren();
  majEffacer();
  if (annonce) annonce.textContent = 'Conversation effacée.';
  champ?.focus();
});

panneau?.addEventListener('click', (e) => {
  const cible = e.target instanceof Element ? e.target : null;
  const exemple = cible?.closest<HTMLButtonElement>('[data-exemple]');
  if (exemple?.dataset.exemple) {
    void poser(exemple.dataset.exemple);
    return;
  }
  // Passage de la page affichée : défilement et surlignage, sans recharger.
  const lien = cible?.closest<HTMLAnchorElement>('a[href]');
  if (lien && allerAuPassage(lien.href)) {
    e.preventDefault();
    if (!grandEcran()) fermer();
  } else if (lien && grandEcran()) {
    memoriserOuverture(true);
  } else if (lien) {
    memoriserOuverture(false);
  }
});

// ---------------------------------------------------------------------------
// Barre de recherche de l'en-tête et liens « Poser une question »
// ---------------------------------------------------------------------------

document.querySelector<HTMLFormElement>('.recherche-entete')?.addEventListener('submit', (e) => {
  const saisie = (e.currentTarget as HTMLFormElement).querySelector<HTMLInputElement>('input[name="q"]');
  const question = saisie?.value.trim() ?? '';
  if (!question) return;
  e.preventDefault();
  ouvrir({ focus: false });
  void poser(question);
  if (saisie) saisie.value = '';
  champ?.focus({ preventScroll: true });
});
// Les fiches se chargent dès qu'on commence à écrire dans la barre : la réponse est alors immédiate.
document
  .querySelector('#recherche-rapide')
  ?.addEventListener('focus', () => void chargerIndex().catch(() => undefined), {
    once: true,
  });

document.addEventListener('click', (e) => {
  const lien = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[data-ouvrir-question]') : null;
  if (!lien || !panneau) return;
  e.preventDefault();
  const numero = new URL(lien.href).searchParams.get('module');
  if (numero) {
    moduleCourant = numero;
    if (contexte) contexte.textContent = `Réponses du module ${numero} en priorité.`;
  }
  ouvrir();
});

// Panneau laissé ouvert sur la page précédente (grand écran) : il se rouvre, sans prendre le focus.
try {
  if (window.sessionStorage.getItem(CLE_OUVERT) && grandEcran()) ouvrir({ focus: false });
} catch {
  /* stockage indisponible */
}

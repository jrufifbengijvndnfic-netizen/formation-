/**
 * Accès par code (src/lib/acces.ts) : saisie du code sur une page réservée ou sur /acces/, mémoire
 * des codes dans le navigateur, ouverture de la page sans rechargement.
 *
 * Le script en ligne du <head> (Base.astro) a déjà posé, avant l'affichage, data-acces sur <html>
 * (niveaux ouverts) et la classe acces-ouvert quand la page réservée (data-reserve) est ouverte.
 * Ce script refait le même calcul après chaque changement et émet « acces:modifie » sur document.
 */
import { CLE_ACCES, empreinteCode, niveauDeLEmpreinte, niveauxOuverts, normaliserCode } from '../lib/acces';
import type { Niveau } from '../lib/types';

type Memoire = 'durable' | 'session' | 'visite';

/** Codes gardés pour la visite seulement, quand le navigateur refuse tout stockage. */
let enMemoire: string[] = [];

function stockage(nom: 'localStorage' | 'sessionStorage'): Storage | null {
  try {
    const s = window[nom];
    s.setItem('__formation_test__', '1');
    s.removeItem('__formation_test__');
    return s;
  } catch {
    return null;
  }
}

function lire(s: Storage | null): string[] {
  if (!s) return [];
  try {
    const liste = JSON.parse(s.getItem(CLE_ACCES) ?? '[]') as unknown;
    return Array.isArray(liste) ? liste.filter((e): e is string => typeof e === 'string') : [];
  } catch {
    return [];
  }
}

function empreintesEnregistrees(): string[] {
  return [...new Set([...lire(stockage('localStorage')), ...lire(stockage('sessionStorage')), ...enMemoire])];
}

/** Ajoute une empreinte ; renvoie la mémoire obtenue (durable, pour la session, ou pour la visite). */
function enregistrer(empreinte: string): Memoire {
  for (const [nom, memoire] of [
    ['localStorage', 'durable'],
    ['sessionStorage', 'session'],
  ] as const) {
    const s = stockage(nom);
    if (!s) continue;
    try {
      s.setItem(CLE_ACCES, JSON.stringify([...new Set([...lire(s), empreinte])]));
      return memoire;
    } catch {
      /* stockage plein ou refusé : essai suivant */
    }
  }
  enMemoire = [...new Set([...enMemoire, empreinte])];
  return 'visite';
}

function oublier(): void {
  for (const nom of ['localStorage', 'sessionStorage'] as const) {
    try {
      stockage(nom)?.removeItem(CLE_ACCES);
    } catch {
      /* rien à effacer */
    }
  }
  enMemoire = [];
}

const racine = document.documentElement;

/** Niveau exigé par la page (data-reserve sur <html>), s'il y en a un. */
function reserve(): Niveau | undefined {
  const n = Number(racine.dataset.reserve);
  return n === 1 || n === 2 || n === 3 ? n : undefined;
}

/** Reporte les niveaux ouverts sur <html> (même calcul que le script du <head>). */
function appliquer(): Niveau[] {
  const niveaux = niveauxOuverts(empreintesEnregistrees());
  racine.dataset.acces = niveaux.join(' ');
  const exige = reserve();
  racine.classList.toggle('acces-ouvert', exige !== undefined && niveaux.includes(exige));
  document.dispatchEvent(new CustomEvent('acces:modifie', { detail: niveaux }));
  return niveaux;
}

type Essai = { ok: true; niveau: Niveau; memoire: Memoire } | { ok: false; raison: 'vide' | 'inconnu' | 'navigateur' };

async function essayer(saisie: string): Promise<Essai> {
  if (!normaliserCode(saisie)) return { ok: false, raison: 'vide' };
  if (!window.crypto?.subtle) return { ok: false, raison: 'navigateur' };
  const empreinte = await empreinteCode(saisie);
  const niveau = niveauDeLEmpreinte(empreinte);
  if (!niveau) return { ok: false, raison: 'inconnu' };
  const memoire = enregistrer(empreinte);
  appliquer();
  return { ok: true, niveau, memoire };
}

const NOTE_MEMOIRE: Record<Memoire, string> = {
  durable: '',
  session: ' Votre navigateur bloque l’enregistrement durable : le code sera à saisir de nouveau après sa fermeture.',
  visite: ' Votre navigateur bloque tout enregistrement : le code sera à saisir de nouveau sur chaque page.',
};

function messageErreur(raison: 'vide' | 'inconnu' | 'navigateur'): string {
  if (raison === 'vide') return 'Saisissez votre code d’accès.';
  if (raison === 'navigateur')
    return 'Votre navigateur ne permet pas de vérifier le code ici. Ouvrez le site à son adresse https://, puis réessayez.';
  return 'Ce code n’est pas reconnu. Vérifiez-le et réessayez.';
}

function lierFormulaire(form: HTMLFormElement): void {
  const champ = form.querySelector<HTMLInputElement>('[data-code-champ]');
  const message = form.querySelector<HTMLElement>('[data-code-message]');
  const bouton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!champ || !message) return;
  const dire = (texte: string, etat: 'erreur' | 'succes' | '') => {
    message.textContent = texte;
    message.dataset.etat = etat;
    if (etat === 'erreur') champ.setAttribute('aria-invalid', 'true');
    else champ.removeAttribute('aria-invalid');
  };
  const soumettre = async (): Promise<void> => {
    if (bouton) bouton.disabled = true;
    const r = await essayer(champ.value).catch(() => ({ ok: false, raison: 'navigateur' }) as const);
    if (bouton) bouton.disabled = false;
    if (!r.ok) {
      dire(messageErreur(r.raison), 'erreur');
      champ.focus();
      return;
    }
    champ.value = '';
    const exige = reserve();
    if (exige !== undefined && r.niveau === exige) {
      // Page réservée désormais ouverte : le verrou disparaît, on amène au début du contenu.
      dire('', '');
      const confirme = document.querySelector<HTMLElement>('[data-acces-confirme]');
      if (confirme) {
        confirme.textContent = `Niveau ${r.niveau} ouvert sur cet appareil.${NOTE_MEMOIRE[r.memoire]}`;
        confirme.hidden = false;
        confirme.focus();
      }
      return;
    }
    const autre = exige !== undefined ? ` Cette page fait partie du niveau ${exige} : il faut son propre code.` : '';
    dire(
      `Code accepté : le niveau ${r.niveau} est ouvert sur cet appareil.${autre}${NOTE_MEMOIRE[r.memoire]}`,
      'succes',
    );
  };
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    void soumettre();
  });
}

document.querySelectorAll<HTMLFormElement>('[data-code-formulaire]').forEach(lierFormulaire);

document.querySelectorAll<HTMLButtonElement>('[data-acces-oublier]').forEach((b) =>
  b.addEventListener('click', () => {
    oublier();
    appliquer();
    const statut = document.querySelector<HTMLElement>('[data-acces-statut]');
    if (statut) statut.textContent = 'Les codes ont été retirés de cet appareil.';
  }),
);

// Codes saisis dans un autre onglet : la page suit.
window.addEventListener('storage', (e) => {
  if (e.key === CLE_ACCES || e.key === null) appliquer();
});

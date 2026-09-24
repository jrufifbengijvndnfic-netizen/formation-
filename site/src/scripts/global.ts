/** Comportements communs à toutes les pages. */
import { avancement, statutModule } from '../lib/progression';
import { ecrireTheme, lireTheme, progression } from './stockage';

const LIBELLES_STATUT: Record<string, string> = {
  'non-commence': 'Non commencé',
  lu: 'Lu',
  'quiz-reussi': 'Quiz réussi',
  termine: 'Lu et quiz réussi',
};

// --------------------------------------------------------------- Thème
function themeEffectif(): 'clair' | 'sombre' {
  const choisi = document.documentElement.dataset.theme;
  if (choisi === 'clair' || choisi === 'sombre') return choisi;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'sombre' : 'clair';
}

function initialiserTheme(): void {
  const bouton = document.querySelector<HTMLButtonElement>('[data-theme-bascule]');
  if (!bouton) return;
  const theme = lireTheme();
  if (theme === 'clair' || theme === 'sombre') document.documentElement.dataset.theme = theme;
  const maj = () => bouton.setAttribute('aria-pressed', String(themeEffectif() === 'sombre'));
  maj();
  bouton.addEventListener('click', () => {
    const suivant = themeEffectif() === 'sombre' ? 'clair' : 'sombre';
    document.documentElement.dataset.theme = suivant;
    ecrireTheme(suivant);
    maj();
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', maj);
}

// --------------------------------------------------------------- Menu mobile
function initialiserMenu(): void {
  const entete = document.querySelector<HTMLElement>('.entete');
  const bouton = entete?.querySelector<HTMLButtonElement>('.menu-bouton');
  if (!entete || !bouton) return;
  const fermer = () => {
    entete.removeAttribute('data-menu-ouvert');
    bouton.setAttribute('aria-expanded', 'false');
  };
  bouton.addEventListener('click', () => {
    const ouvert = entete.toggleAttribute('data-menu-ouvert');
    bouton.setAttribute('aria-expanded', String(ouvert));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && entete.hasAttribute('data-menu-ouvert')) {
      fermer();
      bouton.focus();
    }
  });
}

// --------------------------------------------------------------- Raccourci « / »
function initialiserRaccourci(): void {
  document.addEventListener('keydown', (e) => {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
    const cible = e.target as HTMLElement | null;
    if (cible && (cible.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(cible.tagName))) return;
    e.preventDefault();
    const pageRecherche = document.querySelector<HTMLInputElement>('#recherche-page');
    const champ = pageRecherche ?? document.querySelector<HTMLInputElement>('#recherche-rapide');
    if (champ && champ.offsetParent !== null) {
      champ.focus();
      champ.select();
    } else {
      const lien = document.querySelector<HTMLAnchorElement>('.nav-principale a[href$="recherche/"]');
      if (lien) window.location.href = lien.href;
    }
  });
}

// --------------------------------------------------------------- Progression affichée
function majJauge(el: HTMLElement, pourcentage: number): void {
  el.style.setProperty('--valeur', `${pourcentage}%`);
  if (el.getAttribute('role') === 'progressbar') el.setAttribute('aria-valuenow', String(pourcentage));
}

export function afficherProgression(): void {
  const p = progression();
  const globale = document.querySelector<HTMLElement>('[data-jauge-globale]');
  if (globale) {
    const a = avancement(p, (globale.dataset.modules ?? '').split(',').filter(Boolean));
    majJauge(globale, a.pourcentage);
    const libelle = document.querySelector('[data-libelle-progression]');
    if (libelle) libelle.textContent = `Ma progression : ${a.pourcentage} %`;
  }
  document.querySelectorAll<HTMLElement>('[data-statut-module]').forEach((el) => {
    const s = statutModule(p, el.dataset.statutModule ?? '');
    el.dataset.statut = s;
    el.textContent = LIBELLES_STATUT[s] ?? s;
  });
  document.querySelectorAll<HTMLElement>('[data-avancement]').forEach((el) => {
    const a = avancement(p, (el.dataset.avancement ?? '').split(',').filter(Boolean));
    el.querySelectorAll<HTMLElement>('.jauge').forEach((j) => majJauge(j, a.pourcentage));
    el.querySelectorAll('[data-avancement-texte]').forEach((t) => {
      t.textContent = `${a.pourcentage} % — ${a.lus} module${a.lus > 1 ? 's' : ''} lu${a.lus > 1 ? 's' : ''} sur ${a.total}, ${a.reussis} quiz réussi${a.reussis > 1 ? 's' : ''}`;
    });
    el.querySelectorAll<HTMLElement>('[data-si-termine]').forEach((b) => (b.hidden = !a.termine));
    el.querySelectorAll<HTMLElement>('[data-si-en-cours]').forEach((b) => (b.hidden = a.termine));
  });
}

// --------------------------------------------------------------- Infobulles du glossaire
function initialiserInfobulles(): void {
  const termes = document.querySelectorAll<HTMLElement>('.terme');
  if (!termes.length) return;
  /** Place la bulle au-dessus (ou au-dessous près du haut de l'écran) sans sortir de la fenêtre. */
  const placer = (t: HTMLElement) => {
    const r = t.getBoundingClientRect();
    t.toggleAttribute('data-sous', r.top < 180);
    const bulle = t.querySelector<HTMLElement>('.terme__bulle');
    if (!bulle) return;
    bulle.style.left = '0px';
    requestAnimationFrame(() => {
      const b = bulle.getBoundingClientRect();
      if (!b.width) return;
      const marge = 12;
      const depasse = b.right - (document.documentElement.clientWidth - marge);
      const decalage = depasse > 0 ? Math.min(depasse, b.left - marge) : 0;
      bulle.style.left = `${-Math.max(0, decalage)}px`;
    });
  };
  const fermerTout = (sauf?: HTMLElement) =>
    termes.forEach((t) => {
      if (t !== sauf) t.removeAttribute('data-ouvert');
    });
  // Au toucher, le premier appui affiche la définition ; le second suit le lien vers le glossaire.
  let pointeur = '';
  document.addEventListener('pointerdown', (e) => (pointeur = e.pointerType), { capture: true });
  termes.forEach((t) => {
    const declencheur = t.querySelector<HTMLAnchorElement>('.terme__declencheur');
    if (!declencheur) return;
    t.addEventListener('mouseenter', () => {
      t.removeAttribute('data-ferme');
      placer(t);
    });
    declencheur.addEventListener('focus', () => {
      t.removeAttribute('data-ferme');
      placer(t);
    });
    declencheur.addEventListener('click', (e) => {
      if (pointeur !== 'touch' || t.hasAttribute('data-ouvert')) return;
      e.preventDefault();
      placer(t);
      t.removeAttribute('data-ferme');
      t.setAttribute('data-ouvert', '');
      fermerTout(t);
    });
    declencheur.addEventListener('blur', () => t.removeAttribute('data-ouvert'));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    termes.forEach((t) => {
      if (t.hasAttribute('data-ouvert') || t.matches(':hover') || t.contains(document.activeElement)) {
        t.removeAttribute('data-ouvert');
        t.setAttribute('data-ferme', '');
      }
    });
  });
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.terme')) fermerTout();
  });
}

// --------------------------------------------------------------- Impression
function initialiserImpression(): void {
  const ouverts = new Set<HTMLDetailsElement>();
  window.addEventListener('beforeprint', () => {
    document.querySelectorAll('details').forEach((d) => {
      if (!d.open) {
        ouverts.add(d);
        d.open = true;
      }
    });
  });
  window.addEventListener('afterprint', () => {
    ouverts.forEach((d) => (d.open = false));
    ouverts.clear();
  });
  document
    .querySelectorAll<HTMLButtonElement>('[data-imprimer]')
    .forEach((b) => b.addEventListener('click', () => window.print()));
}

initialiserTheme();
initialiserMenu();
initialiserRaccourci();
initialiserInfobulles();
initialiserImpression();
afficherProgression();
document.addEventListener('progression:modifiee', afficherProgression);

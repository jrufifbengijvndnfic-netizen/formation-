/**
 * Accès à la progression depuis le navigateur. localStorage peut être indisponible
 * (navigation privée, stockage bloqué) : la progression reste alors en mémoire pour la visite.
 * Chaque modification émet l'événement « progression:modifiee » sur document.
 */
import {
  CLE_PROGRESSION,
  ecrireProgression,
  lireProgression,
  progressionVide,
  type Progression,
  type StockageSimple,
} from '../lib/progression';

export const CLE_THEME = 'formation-immobilier-locatif-2026:theme';

let stockageTeste: StockageSimple | null | undefined;

export function stockageLocal(): StockageSimple | null {
  if (stockageTeste !== undefined) return stockageTeste;
  try {
    const s = window.localStorage;
    const t = '__formation_test__';
    s.setItem(t, t);
    s.removeItem(t);
    stockageTeste = s;
  } catch {
    stockageTeste = null;
  }
  return stockageTeste;
}

let cache: Progression | null = null;

export function progression(): Progression {
  cache ??= lireProgression(stockageLocal());
  return cache;
}

function notifier(): void {
  document.dispatchEvent(new CustomEvent('progression:modifiee', { detail: cache }));
}

/** Applique une modification ; renvoie false si elle n'a pas pu être enregistrée durablement. */
export function modifier(f: (p: Progression) => Progression): boolean {
  cache = f(progression());
  const ok = ecrireProgression(stockageLocal(), cache);
  notifier();
  return ok;
}

export function remplacer(p: Progression): boolean {
  return modifier(() => p);
}

export function reinitialiser(): boolean {
  return modifier(() => progressionVide());
}

export const maintenant = (): string => new Date().toISOString();

/** Synchronisation entre onglets. */
window.addEventListener('storage', (e) => {
  if (e.key === CLE_PROGRESSION || e.key === null) {
    cache = null;
    progression();
    notifier();
  }
});

export function lireTheme(): string | null {
  try {
    return stockageLocal()?.getItem(CLE_THEME) ?? null;
  } catch {
    return null;
  }
}

export function ecrireTheme(theme: 'clair' | 'sombre'): void {
  try {
    stockageLocal()?.setItem(CLE_THEME, theme);
  } catch {
    /* thème non mémorisé : sans conséquence */
  }
}

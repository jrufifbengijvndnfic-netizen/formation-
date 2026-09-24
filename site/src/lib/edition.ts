/**
 * Édition construite :
 * - « outils » (par défaut) : le site public ne contient que les outils gratuits (simulateurs,
 *   modèles de lettres), les tarifs et les informations ; le cours est réservé aux acheteurs ;
 * - « complete » (EDITION=complete) : ajoute tout le cours (modules, quiz, examens, checklists,
 *   annexes, glossaire, recherche, progression), par exemple pour l'espace membre.
 */
export type Edition = 'outils' | 'complete';

export const EDITION: Edition = process.env.EDITION === 'complete' ? 'complete' : 'outils';

/** Vrai si les pages du cours sont construites (et peuvent donc recevoir des liens). */
export const COURS_PUBLIC = EDITION === 'complete';

/** Pages du cours, construites seulement dans l'édition complète (src/cours/, routes injectées). */
export const ROUTES_COURS: { pattern: string; entrypoint: string }[] = [
  ['/formation', 'formation.astro'],
  ['/mode-d-emploi', 'mode-d-emploi.astro'],
  ['/niveau-[n]', 'niveau-[n].astro'],
  ['/module/[id]', 'module/[id].astro'],
  ['/examen/[id]', 'examen/[id].astro'],
  ['/checklist/[id]', 'checklist/[id].astro'],
  ['/annexe/[id]', 'annexe/[id].astro'],
  ['/annexe/c', 'annexe/c.astro'],
  ['/annexes', 'annexes.astro'],
  ['/glossaire', 'glossaire.astro'],
  ['/a-surveiller', 'a-surveiller.astro'],
  ['/progression', 'progression.astro'],
  ['/recherche', 'recherche.astro'],
].map(([pattern, fichier]) => ({ pattern: pattern as string, entrypoint: `./src/cours/${fichier}` }));

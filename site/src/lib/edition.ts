/**
 * Édition construite :
 * - « complete » (par défaut) : la formation en page d'accueil (modules, quiz, examens, checklists,
 *   annexes, glossaire, recherche, progression) et les outils gratuits (simulateurs, lettres), vitrine
 *   sur /outils/, qui amènent du trafic vers la formation ;
 * - « outils » (EDITION=outils) : seulement les outils gratuits, les tarifs et les informations, pour
 *   le jour où le cours sera réservé aux acheteurs.
 */
export type Edition = 'outils' | 'complete';

export const EDITION: Edition = process.env.EDITION === 'outils' ? 'outils' : 'complete';

/** Vrai si les pages du cours sont construites (et peuvent donc recevoir des liens). */
export const COURS_PUBLIC = EDITION === 'complete';

/**
 * Extraits gratuits (aimant à prospects) : publiés dans les deux éditions. Dans l'édition « outils »,
 * ce sont les seules pages du cours construites.
 */
export const MODULES_GRATUITS = ['1.1'];
export const CHECKLISTS_GRATUITES = ['mettre-en-location-son-premier-logement'];

/** Pages à extraits gratuits : injectées dans les deux éditions (leurs chemins sont filtrés). */
export const ROUTES_EXTRAITS: { pattern: string; entrypoint: string }[] = [
  { pattern: '/module/[id]', entrypoint: './src/cours/module/[id].astro' },
  { pattern: '/checklist/[id]', entrypoint: './src/cours/checklist/[id].astro' },
];

/** Pages du cours, construites seulement dans l'édition complète (src/cours/, routes injectées). */
export const ROUTES_COURS: { pattern: string; entrypoint: string }[] = [
  ['/', 'formation.astro'],
  ['/mode-d-emploi', 'mode-d-emploi.astro'],
  ['/niveau-[n]', 'niveau-[n].astro'],
  ['/examen/[id]', 'examen/[id].astro'],
  ['/examen/test-final', 'examen/test-final.astro'],
  ['/examen/test-final/questions.json', 'examen/questions-test-final.json.ts'],
  ['/annexe/[id]', 'annexe/[id].astro'],
  ['/annexe/c', 'annexe/c.astro'],
  ['/annexes', 'annexes.astro'],
  ['/glossaire', 'glossaire.astro'],
  ['/a-surveiller', 'a-surveiller.astro'],
  ['/progression', 'progression.astro'],
  ['/recherche', 'recherche.astro'],
  ['/assistant', 'assistant.astro'],
  ['/assistant/fiches.json', 'assistant/fiches.json.ts'],
].map(([pattern, fichier]) => ({ pattern: pattern as string, entrypoint: `./src/cours/${fichier}` }));

/** Vitrine des outils gratuits : page d'accueil de l'édition « outils », /outils/ sinon. */
export const ROUTE_ACCUEIL_OUTILS = {
  pattern: COURS_PUBLIC ? '/outils' : '/',
  entrypoint: './src/outils/accueil.astro',
};

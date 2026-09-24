/** Types partagés : structure de la formation telle que lue dans le Markdown source. */

export const TYPES_ENCADRE = [
  'NOUVEAU',
  'ATTENTION',
  'EXEMPLE',
  'ASTUCE',
  'DEFINITION',
  'A_SURVEILLER',
] as const;
export type TypeEncadre = (typeof TYPES_ENCADRE)[number];

export const LIBELLES_ENCADRE: Record<TypeEncadre, string> = {
  NOUVEAU: 'Nouveau',
  ATTENTION: 'Attention',
  EXEMPLE: 'Exemple chiffré',
  ASTUCE: 'Astuce',
  DEFINITION: 'Définition',
  A_SURVEILLER: 'À surveiller',
};

export type TypePartie = 'mode-emploi' | 'niveau' | 'annexes';
export type TypeElement = 'section' | 'module' | 'examen' | 'checklist' | 'annexe';
export type Niveau = 1 | 2 | 3;

export interface QuizQuestion {
  /** Identifiant stable, par exemple « q1-1-1 ». */
  id: string;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  reponse: 'A' | 'B' | 'C' | 'D';
  explication: string;
}

export interface Lettre {
  /** « f1 » à « f10 ». */
  id: string;
  /** « F1 ». */
  numero: string;
  titre: string;
  texte: string;
}

export interface TermeGlossaire {
  terme: string;
  definition: string;
  lettre: string;
  id: string;
}

export interface Encadre {
  type: TypeEncadre;
  /** Lignes du contenu, retours à la ligne conservés. */
  lignes: string[];
  /** Identifiant de l'élément (module, annexe…) qui le contient. */
  elementId: string;
  /** Rang de l'encadré dans l'élément, à partir de 1 (sert d'ancre : #encadre-N). */
  rang: number;
}

export interface Checklist {
  /** « premier-logement » ou « g1 »… */
  id: string;
  titre: string;
  items: string[];
  elementId: string;
}

export interface Rubrique {
  titre: string;
  /** Ancre dans la page, unique au sein de l'élément. */
  id: string;
  markdown: string;
  quiz?: QuizQuestion[];
  lettre?: Lettre;
  checklist?: Checklist;
  termes?: TermeGlossaire[];
}

export interface Element {
  type: TypeElement;
  titre: string;
  /** Identifiant « slug » identique à celui de structure.json. */
  id: string;
  /** Numéro de module (« 1.1 »), de section (« 0.1 ») ou lettre d'annexe (« A »). */
  numero?: string;
  /** Titre sans le préfixe « Module X.Y — ». */
  titreCourt: string;
  niveau?: Niveau;
  /** Markdown situé avant la première rubrique (#### …). */
  intro: string;
  rubriques: Rubrique[];
  /** Markdown complet de l'élément, sans son titre. */
  markdown: string;
  encadres: Encadre[];
  formules: string[];
  /** Numéro de ligne du titre dans le Markdown source (1 = première ligne). */
  ligne: number;
}

export interface Partie {
  type: TypePartie;
  titre: string;
  id: string;
  niveau?: Niveau;
  /** Titre sans le préfixe « NIVEAU N — ». */
  titreCourt: string;
  intro: string;
  elements: Element[];
}

export interface Formation {
  titre: string;
  /** Ligne d'édition en gras sous le titre. */
  mentionEdition: string;
  /** « septembre 2026 ». */
  edition: string;
  /** Date ISO de mise à jour, « 2026-09-24 ». */
  aJourAu: string;
  /** Date de mise à jour en toutes lettres, « 24 septembre 2026 ». */
  aJourAuTexte: string;
  accroche: string;
  conclusion: string;
  parties: Partie[];
}

/**
 * Moteur de l'outil « Poser une question » : retrouve, parmi les fiches tirées de la formation
 * (passages des leçons, points clés, pièges, questions de quiz, glossaire, annexes), celles qui
 * répondent le mieux à une question écrite avec ses propres mots.
 *
 * Aucune réponse n'est rédigée : l'outil affiche des passages existants, avec leur source. Le
 * classement est un BM25 (pertinence classique des moteurs de recherche) sur des mots normalisés
 * (accents, pluriels, formes proches), avec synonymes et bonus pour les expressions retrouvées telles
 * quelles. Code partagé par le build (tests) et le navigateur : aucune dépendance.
 */

/** Fiche telle que publiée dans /assistant/fiches.json (noms courts : fichier plus léger). */
export interface Fiche {
  /** Identifiant stable. */
  i: string;
  /** Titre : question du quiz, intitulé en gras du passage, terme du glossaire… */
  t: string;
  /** Provenance affichée : « Module 2.6 — La fiscalité… », « Glossaire »… */
  c: string;
  /** Genre : l (leçon), p (points clés, pièges), q (question de quiz ou d'exercice), g (glossaire), a (annexe). */
  g: 'l' | 'p' | 'q' | 'g' | 'a';
  /** Réponse en HTML (contenu de la formation, déjà rendu). */
  h: string;
  /** Adresse du passage dans le site. */
  u: string;
  /** Numéro du module d'origine, s'il y en a un. */
  m?: string;
}

export interface BaseFiches {
  fiches: Fiche[];
  /** Expressions équivalentes (forme normalisée → mots ajoutés à la question). */
  synonymes: Record<string, string>;
}

export interface Resultat {
  fiche: Fiche;
  score: number;
  /** Part des mots de la question retrouvés dans la fiche (0 à 1). */
  couverture: number;
}

// ---------------------------------------------------------------------------
// Mots
// ---------------------------------------------------------------------------

/** Minuscules, sans accents ni ligatures, apostrophes droites. */
export function normaliser(texte: string): string {
  return texte
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

const MOTS_VIDES = new Set(
  (
    'a au aux avec ce ces cet cette c ca d dans de des du elle elles en et est etre eu il ils je j l la le les leur ' +
    'leurs lui m ma mais me meme mes moi mon n ne ni nos notre nous on ou par pas plus pour qu que quel quelle ' +
    'quelles quels qui s sa sans se ses si son sont sur t ta te tes toi ton tu un une vos votre vous y ' +
    'comment combien quand pourquoi quoi dois doit dit faut peut peux puis puisse est-ce ai as avez avons ont ' +
    'suis sommes etes fait faire tout tous toute toutes tres bien alors donc car aussi deja encore ici la-bas ' +
    'ceci cela celui celle ceux celles chez vers entre sous apres avant depuis pendant selon lorsque ' +
    'si oui non svp merci bonjour question savoir sait veux voudrais aimerais chose choses cas ' +
    'va vont sera seront serait devient deviennent devenir peuvent pourrait pourrais dois doivent devrait ' +
    'faudrait passe-t-il se-passe il-y-a ya'
  ).split(' '),
);

/** Lettres isolées gardées : classes DPE (« classé F ») et zones (« zone B »). */
const LETTRES_UTILES = new Set(['b', 'e', 'f', 'g']);

/**
 * Terminaisons retirées après le pluriel (la plus longue d'abord), si la racine garde au moins
 * 3 lettres.
 */
const TERMINAISONS = [
  'issement',
  'ivement',
  'ement',
  'ation',
  'ateur',
  'atrice',
  'ance',
  'ence',
  'able',
  'ible',
  'ion',
  'iste',
  'ivite',
  'ite',
  'euse',
  'eur',
  'ive',
  'if',
  'ee',
  'er',
  'ez',
  're',
  'e',
];

/**
 * Racine approximative d'un mot français déjà normalisé : pluriel retiré, puis une terminaison
 * (« déclarations » et « déclarer » → « declar », « loyers » et « loyer » → « loy »).
 */
export function racine(mot: string): string {
  if (/^\d/.test(mot) || mot.length <= 3) return mot;
  const singulier = /[sx]$/.test(mot) && mot.length > 4 ? mot.slice(0, -1) : mot;
  for (const fin of TERMINAISONS) {
    if (singulier.endsWith(fin) && singulier.length - fin.length >= 3) return singulier.slice(0, -fin.length);
  }
  return singulier;
}

/** Articles, possessifs et pronoms : ignorés dans les expressions (« rendre la caution » = « rendre ma caution »). */
const PETITS_MOTS = new Set(
  'le la les l un une des du de d mon ma mes ton ta tes son sa ses notre nos votre vos leur leurs ce cet cette ces je j tu il elle on nous vous ils elles me m te se s y en'.split(
    ' ',
  ),
);

/**
 * Suite de mots normalisés, entourée d'espaces, sans articles ni pronoms, pour chercher une expression
 * telle quelle. Les négations restent : « ne paie plus » n'est pas « paie ».
 */
const enPhrase = (texte: string): string =>
  ` ${normaliser(texte)
    .split(/[^a-z0-9]+/)
    .filter((m) => m && !PETITS_MOTS.has(m))
    .join(' ')} `;

/** Mots utiles d'un texte, réduits à leur racine, dans l'ordre (les nombres restent entiers). */
export function mots(texte: string): string[] {
  return normaliser(texte)
    .replace(/(\d)[\s.](?=\d{3}\b)/g, '$1') // « 15 000 » et « 15.000 » → « 15000 »
    .split(/[^a-z0-9]+/)
    .filter((m) => m && !MOTS_VIDES.has(m) && (m.length > 1 || LETTRES_UTILES.has(m)))
    .map(racine);
}

/** Texte sans balises HTML ni entités courantes. */
export function texteDuHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'");
}

// ---------------------------------------------------------------------------
// Index
// ---------------------------------------------------------------------------

/** Le titre compte trois fois plus que le corps de la réponse. */
const POIDS_TITRE = 3;
const K1 = 1.2;
const B = 0.75;

interface Document {
  fiche: Fiche;
  frequences: Map<string, number>;
  /** Suite des racines (titre puis corps) pour repérer les expressions. */
  suite: string[];
  paires: Set<string>;
  longueur: number;
}

export class IndexFiches {
  private readonly documents: Document[];
  private readonly idf = new Map<string, number>();
  private readonly longueurMoyenne: number;
  /** Poids d'un mot absent de toutes les fiches : le plus élevé (c'est le signe d'une question hors sujet). */
  private readonly idfMax: number;
  /**
   * Synonymes : une expression de plusieurs mots est cherchée telle quelle dans la question (« ne paie
   * plus », « rendre la caution ») et ses mots ajoutés comptent autant que ceux de la question ; un
   * mot seul est comparé par sa racine et ses mots ajoutés comptent à moitié.
   */
  private readonly synonymes: { phrase?: string; racine?: string; origines: string[]; vers: string[]; poids: number }[];

  constructor(base: BaseFiches) {
    this.documents = base.fiches.map((fiche) => {
      const titre = mots(fiche.t);
      const corps = mots(texteDuHtml(fiche.h));
      const frequences = new Map<string, number>();
      for (const m of titre) frequences.set(m, (frequences.get(m) ?? 0) + POIDS_TITRE);
      for (const m of corps) frequences.set(m, (frequences.get(m) ?? 0) + 1);
      const suite = [...titre, '|', ...corps];
      const paires = new Set<string>();
      for (let k = 1; k < suite.length; k++) paires.add(`${suite[k - 1]} ${suite[k]}`);
      return { fiche, frequences, suite, paires, longueur: titre.length * POIDS_TITRE + corps.length };
    });
    const n = this.documents.length;
    const presence = new Map<string, number>();
    for (const d of this.documents) for (const m of d.frequences.keys()) presence.set(m, (presence.get(m) ?? 0) + 1);
    for (const [m, df] of presence) this.idf.set(m, Math.log(1 + (n - df + 0.5) / (df + 0.5)));
    this.longueurMoyenne = this.documents.reduce((t, d) => t + d.longueur, 0) / Math.max(1, n);
    this.idfMax = Math.log(1 + (n + 0.5) / 0.5);
    this.synonymes = Object.entries(base.synonymes).map(([de, vers]) => {
      const expression = enPhrase(de);
      const plusieurs = expression.trim().includes(' ');
      const origines = mots(de);
      return {
        ...(plusieurs ? { phrase: expression } : { racine: origines[0] ?? '' }),
        origines,
        vers: mots(vers),
        poids: plusieurs ? 1 : 0.5,
      };
    });
  }

  get taille(): number {
    return this.documents.length;
  }

  /**
   * Mots de la question, et mots ajoutés par les synonymes (comptés à moitié), chacun avec les mots
   * de la question qu'il remplace : « caution » ajoute « dépôt » et « garantie » pour « caution ».
   */
  analyser(question: string): { principaux: string[]; ajoutes: Map<string, { poids: number; origines: Set<string> }> } {
    const suite = mots(question);
    const principaux = [...new Set(suite)];
    const phrase = enPhrase(question);
    const ajoutes = new Map<string, { poids: number; origines: Set<string> }>();
    for (const s of this.synonymes) {
      const trouve = s.phrase ? phrase.includes(s.phrase) : Boolean(s.racine) && suite.includes(s.racine as string);
      if (!trouve) continue;
      for (const m of s.vers) {
        if (principaux.includes(m)) continue;
        const a = ajoutes.get(m) ?? { poids: 0, origines: new Set<string>() };
        a.poids = Math.max(a.poids, s.poids);
        s.origines.forEach((o) => a.origines.add(o));
        ajoutes.set(m, a);
      }
    }
    return { principaux, ajoutes };
  }

  /**
   * Fiches classées par pertinence. `moduleCourant` favorise légèrement les fiches du module
   * depuis lequel la question est posée.
   */
  chercher(question: string, options: { limite?: number; moduleCourant?: string } = {}): Resultat[] {
    const { principaux, ajoutes } = this.analyser(question);
    if (principaux.length === 0) return [];
    const suiteQuestion = mots(question);
    const pairesQuestion = new Set<string>();
    for (let k = 1; k < suiteQuestion.length; k++) pairesQuestion.add(`${suiteQuestion[k - 1]} ${suiteQuestion[k]}`);
    // Un mot présent partout (idf faible) compte peu dans la couverture ; un mot inconnu compte le plus.
    const poidsMot = (m: string) => Math.max(0.2, this.idf.get(m) ?? this.idfMax);
    const poidsTotal = principaux.reduce((t, m) => t + poidsMot(m), 0);

    const resultats: Resultat[] = [];
    const bm25 = (d: Document, m: string): number => {
      const f = d.frequences.get(m);
      if (!f) return 0;
      const idf = this.idf.get(m) ?? 0;
      return idf * ((f * (K1 + 1)) / (f + K1 * (1 - B + (B * d.longueur) / this.longueurMoyenne)));
    };
    for (const d of this.documents) {
      let score = 0;
      // Mot de la question retrouvé (1), retrouvé seulement par un synonyme (0,7), ou absent (0).
      const trouves = new Map<string, number>();
      for (const m of principaux) {
        const s = bm25(d, m);
        if (s > 0) {
          score += s;
          trouves.set(m, 1);
        }
      }
      for (const [m, { poids, origines }] of ajoutes) {
        const s = bm25(d, m);
        if (s === 0) continue;
        score += poids * s;
        for (const o of origines) if (!trouves.has(o)) trouves.set(o, 0.7);
      }
      if (score === 0) continue;
      let couvert = 0;
      for (const [m, part] of trouves) if (principaux.includes(m)) couvert += part * poidsMot(m);
      // Expressions retrouvées telles quelles (« dépôt de garantie », « zone tendue »).
      for (const p of pairesQuestion) if (d.paires.has(p)) score *= 1.25;
      const couverture = poidsTotal ? couvert / poidsTotal : 0;
      score *= 0.4 + couverture;
      if (options.moduleCourant && d.fiche.m === options.moduleCourant) score *= 1.3;
      // Questions de quiz et d'exercices : courtes, donc favorisées par BM25 ; un passage de leçon
      // est une meilleure réponse principale à score voisin (elles restent en « questions proches »).
      if (d.fiche.g === 'q') score *= 0.85;
      resultats.push({ fiche: d.fiche, score, couverture });
    }
    return resultats.sort((a, b) => b.score - a.score).slice(0, options.limite ?? 8);
  }
}

// ---------------------------------------------------------------------------
// Réponse
// ---------------------------------------------------------------------------

export interface Reponse {
  /** Fiche retenue, ou absente si rien ne répond assez clairement. */
  principale?: Resultat;
  /** Autres passages utiles (sources différentes). */
  aLire: Resultat[];
  /** Questions de quiz proches, avec leur réponse. */
  questionsProches: Resultat[];
}

/** En dessous, la meilleure fiche ne couvre pas assez la question pour être présentée comme réponse. */
export const COUVERTURE_MINIMALE = 0.6;

export function repondre(index: IndexFiches, question: string, moduleCourant?: string): Reponse {
  const resultats = index.chercher(question, { limite: 30, ...(moduleCourant ? { moduleCourant } : {}) });
  const premier = resultats[0];
  if (!premier || premier.couverture < COUVERTURE_MINIMALE) {
    // Pas de réponse sûre : on propose quand même les pistes les plus proches, s'il y en a.
    return {
      aLire: resultats.filter((r) => r.fiche.g !== 'q' && r.couverture >= 0.34).slice(0, 3),
      questionsProches: resultats.filter((r) => r.fiche.g === 'q' && r.couverture >= 0.34).slice(0, 3),
    };
  }
  // Réponse principale : un passage de la formation plutôt qu'une question d'exercice quand leurs
  // pertinences sont voisines ; la question passe alors en tête des « questions proches ».
  const passage = resultats.find((r) => r.fiche.g !== 'q' && r.couverture >= COUVERTURE_MINIMALE);
  const principale = premier.fiche.g === 'q' && passage && passage.score >= premier.score * 0.6 ? passage : premier;
  const seuil = principale.score * 0.45;
  const vues = new Set([principale.fiche.i]);
  // Pas deux fois le même passage : même adresse (ancre et fragment compris).
  const adresses = new Set([principale.fiche.u]);
  const aLire: Resultat[] = [];
  const questionsProches: Resultat[] = [];
  for (const r of resultats) {
    if (r.score < seuil || r.couverture < COUVERTURE_MINIMALE - 0.1 || vues.has(r.fiche.i)) continue;
    vues.add(r.fiche.i);
    if (r.fiche.g === 'q') {
      if (questionsProches.length < 3) questionsProches.push(r);
    } else if (aLire.length < 3 && !adresses.has(r.fiche.u)) {
      adresses.add(r.fiche.u);
      aLire.push(r);
    }
  }
  return { principale, aLire, questionsProches };
}

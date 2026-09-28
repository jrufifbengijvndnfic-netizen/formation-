/**
 * Base de l'outil « Poser une question » (exécuté au build) : découpe la formation en fiches
 * question → passage, publiées dans /assistant/fiches.json et lues par src/scripts/assistant.ts.
 *
 * Rien n'est rédigé ici : chaque fiche reprend un passage de la formation tel quel (Markdown rendu
 * en HTML), avec l'adresse exacte où le lire.
 * - Leçons : un passage par paragraphe à intitulé en gras (« **Le dossier du candidat.** »), avec
 *   les tableaux et encadrés qui le suivent.
 * - Points clés, pièges à éviter, textes de référence de chaque module.
 * - Questions des quiz et des exercices de fin de module, avec la bonne réponse et son explication
 *   (sauf les exercices qui prolongent le précédent : leur énoncé seul ne suffit pas).
 * - Glossaire, modèles de lettres, checklists.
 * - Tableaux des annexes A (chiffres clés), B (calendrier), H (sources), I (à surveiller) et des
 *   nouveautés (section 0.5) : une fiche par ligne.
 */
import type { BaseFiches, Fiche } from './assistant-recherche';
import { texteDuHtml } from './assistant-recherche';
import {
  annexes,
  exercicesDuModule,
  formation,
  modulesExistants,
  partieModeEmploi,
  rendreElement,
  termes,
  tousLesModules,
} from './donnees';
import { COURS_PUBLIC } from './edition';
import type { Exercice } from './exercices';
import { cheminAnnexe, cheminModule, idModule, lien } from './navigation';
import { checklists, lettres, quizDuModule } from './parse-formation';
import { referencementLettre } from './referencement-lettres';
import { nouveauContexte, rendreEnLigne, rendreMarkdown, texteBrut } from './render';
import type { Element } from './types';

/**
 * Mots du langage courant → mots de la formation. Complétés automatiquement par les sigles du
 * glossaire (« GLI » ↔ « assurance loyers impayés »).
 */
export const SYNONYMES: Record<string, string> = {
  proprio: 'propriétaire bailleur',
  propriétaire: 'bailleur',
  bailleur: 'propriétaire',
  locataire: 'preneur',
  airbnb: 'meublé de tourisme courte durée',
  booking: 'meublé de tourisme courte durée',
  'location saisonnière': 'meublé de tourisme courte durée',
  'courte durée': 'meublé de tourisme',
  passoire: 'DPE décence énergétique',
  'passoire thermique': 'DPE décence énergétique',
  'étiquette énergie': 'DPE classe',
  'classe énergie': 'DPE classe',
  'diagnostic énergie': 'DPE',
  louable: 'décence décent location',
  'plus louer': 'non décent décence calendrier',
  'encore louer': 'non décent décence calendrier',
  'interdit à la location': 'non décent décence calendrier',
  'interdits à la location': 'non décent décence calendrier',
  'interdiction de louer': 'non décent décence calendrier',
  interdit: 'interdiction',
  'combien de temps': 'délai durée',
  délai: 'délai durée',
  caution: 'dépôt de garantie cautionnement garant',
  'rendre la caution': 'restitution dépôt de garantie',
  garant: 'caution cautionnement',
  'augmenter le loyer': 'révision IRL',
  augmenter: 'révision hausse',
  augmentation: 'révision hausse',
  hausse: 'révision augmentation',
  indexer: 'révision IRL',
  indexation: 'révision IRL',
  impôt: 'fiscalité imposition imposable',
  imposé: 'imposition imposable fiscalité',
  déduire: 'déductible déduction charges',
  déductible: 'déduction charges',
  impayé: 'impayés premier incident relance commandement de payer',
  'ne paie pas': 'impayé premier incident relance',
  'ne paye pas': 'impayé premier incident relance',
  'ne paie plus': 'impayé premier incident relance',
  'ne paye plus': 'impayé premier incident relance',
  'ne pas payer': 'impayé premier incident relance',
  retard: 'impayé retard',
  expulser: 'expulsion',
  virer: 'congé expulsion',
  'mettre dehors': 'congé expulsion',
  squat: 'occupation illicite',
  squatteur: 'occupation illicite',
  serrure: 'serrures',
  edl: 'état des lieux',
  'état des lieux': 'EDL',
  dépôt: 'dépôt de garantie',
  préavis: 'congé délai',
  partir: 'congé préavis',
  quitter: 'congé préavis',
  vendre: 'vente congé pour vente',
  reprendre: 'congé pour reprise',
  récupérer: 'congé pour reprise',
  meublé: 'LMNP location meublée',
  'location vide': 'location nue revenus fonciers',
  nu: 'location nue',
  louer: 'location',
  location: 'louer',
  crédit: 'emprunt prêt',
  emprunt: 'crédit prêt',
  emprunter: 'emprunt crédit capacité endettement HCSF banque',
  'capacité d’emprunt': 'endettement HCSF banque',
  'combien emprunter': 'capacité d’emprunt endettement HCSF',
  'peux emprunter': 'capacité d’emprunt endettement HCSF',
  'puis emprunter': 'capacité d’emprunt endettement HCSF',
  prêt: 'crédit emprunt',
  banque: 'crédit emprunt',
  travaux: 'rénovation',
  rénovation: 'travaux',
  rénover: 'rénovation travaux',
  isolation: 'rénovation énergétique isoler',
  copro: 'copropriété',
  syndic: 'copropriété',
  agence: 'honoraires agence',
  'frais de notaire': 'frais d’acquisition droits de mutation',
  notaire: 'frais d’acquisition',
  rentable: 'rentabilité',
  rendement: 'rentabilité',
  'cash flow': 'cash-flow',
  'loyer maximum': 'plafond encadrement zone tendue',
  'plafond de loyer': 'encadrement zone tendue',
  'entre deux locataires': 'relocation',
  papiers: 'pièces justificatives dossier',
  documents: 'pièces justificatives dossier',
  justificatifs: 'pièces justificatives',
  'demander au locataire': 'pièces dossier candidat',
  candidat: 'dossier pièces candidat',
  déclarer: 'déclaration 2044 2042',
  revendre: 'plus-value revente',
  revente: 'plus-value',
  héritage: 'succession donation',
  enfants: 'donation succession',
  'taxe ordures': 'TEOM',
  chauffage: 'régulation chauffage',
  assurance: 'PNO GLI assurance',
  quittance: 'quittance de loyer',
  charges: 'charges récupérables régularisation',
  régulariser: 'régularisation charges',
};

/** Ajoute les sigles du glossaire (« Assurance loyers impayés (GLI) »), dans les deux sens. */
export function synonymesAvecSigles(): Record<string, string> {
  const s: Record<string, string> = { ...SYNONYMES };
  for (const t of termes) {
    const m = /^(.+?)\s*\(([\p{Lu}][\p{Lu}\d'’-]+)\)$/u.exec(t.terme);
    if (!m) continue;
    const [, complet, sigle] = m as unknown as [string, string, string];
    s[sigle] = [s[sigle], complet].filter(Boolean).join(' ');
    s[complet] = [s[complet], sigle].filter(Boolean).join(' ');
  }
  return s;
}

// ---------------------------------------------------------------------------
// Rendu et adresses
// ---------------------------------------------------------------------------

/** HTML d'un passage, sans identifiants (plusieurs réponses coexistent sur la page de l'outil). */
function html(md: string, moduleCourant?: string): string {
  const ctx = nouveauContexte({ modulesExistants, liensAnnexes: COURS_PUBLIC, moduleCourant });
  return rendreMarkdown(md, ctx)
    .replace(/\s(id|aria-labelledby|aria-describedby)="[^"]*"/g, '')
    .trim();
}

/**
 * Lien vers un passage précis : ancre de la rubrique, et fragment de texte (« #:~:text= ») qui fait
 * défiler jusqu'au paragraphe et le surligne dans les navigateurs qui le gèrent. S'il n'est pas
 * retrouvé tel quel dans la page, seule l'ancre reste.
 */
function lienPassage(base: string, ancre: string, debut: string | undefined, textePage: string): string {
  if (!debut) return `${base}#${ancre}`;
  const extrait = debut
    .split(/\s+/)
    .slice(0, 6)
    .join(' ')
    .replace(/[.:,;]+$/, '');
  if (!textePage.includes(extrait)) return `${base}#${ancre}`;
  const code = (t: string) => encodeURIComponent(t).replace(/-/g, '%2D');
  return `${base}#${ancre}:~:text=${code(extrait)}`;
}

const espaces = (t: string) => t.replace(/\s+/g, ' ');

// ---------------------------------------------------------------------------
// Découpage d'un Markdown en passages
// ---------------------------------------------------------------------------

interface Passage {
  titre?: string;
  md: string;
}

/** Intitulé en gras en tête de paragraphe : « **Le dossier du candidat.** Le décret… ». */
const INTITULE = /^\*\*(.+?)\*\*/;

/** Paragraphes à intitulé en gras, chacun avec les blocs qui le suivent (tableaux, encadrés…). */
export function decouperEnPassages(md: string): Passage[] {
  const passages: Passage[] = [];
  let courant: Passage | undefined;
  for (const bloc of md.split(/\n{2,}/)) {
    const propre = bloc.trim();
    if (!propre) continue;
    const intitule = INTITULE.exec(propre);
    if (intitule || !courant) {
      courant = {
        ...(intitule ? { titre: texteBrut(intitule[1] as string).replace(/[.:]\s*$/, '') } : {}),
        md: propre,
      };
      passages.push(courant);
    } else courant.md += `\n\n${propre}`;
  }
  return passages;
}

/**
 * Passage sans son intitulé en gras, déjà affiché comme titre de la réponse (« **L'annonce.** Une
 * annonce… » → « Une annonce… »). Un paragraphe réduit à son intitulé disparaît. Les parenthèses et la
 * ponctuation qui suivent l'intitulé restent : « (article 22-2) : … ».
 */
export function sansIntitule(md: string): string {
  return md
    .replace(INTITULE, '')
    .replace(/^[ \t]*[.:]?[ \t]*/, '')
    .replace(/^\n+/, '');
}

/** Lignes d'un tableau Markdown : en-têtes et cellules. */
export function lignesDeTableaux(md: string): { entetes: string[]; cellules: string[] }[] {
  const lignes: { entetes: string[]; cellules: string[] }[] = [];
  const cellulesDe = (l: string) =>
    l
      .trim()
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => c.trim());
  for (const bloc of md.split(/\n{2,}/)) {
    const l = bloc.trim().split('\n');
    if (l.length < 3 || !l[0]?.startsWith('|') || !/^\|[\s:|-]+\|$/.test(l[1]?.trim() ?? '')) continue;
    const entetes = cellulesDe(l[0]);
    for (const ligne of l.slice(2)) lignes.push({ entetes, cellules: cellulesDe(ligne) });
  }
  return lignes;
}

// ---------------------------------------------------------------------------
// Fiches
// ---------------------------------------------------------------------------

function fichesDuModule(m: Element): Fiche[] {
  const numero = m.numero as string;
  const base = lien(cheminModule(numero));
  const categorie = `Module ${numero} — ${m.titreCourt}`;
  const rendu = rendreElement(m);
  const textePage = (id: string) =>
    espaces(texteDuHtml(rendu.rubriques.find((r) => r.rubrique?.id === id)?.html ?? ''));
  const fiches: Fiche[] = [];
  for (const r of m.rubriques) {
    if (r.titre === 'Leçon') {
      const page = textePage(r.id);
      decouperEnPassages(r.markdown).forEach((p, k) => {
        const debut = p.titre ?? texteBrut(p.md.split('\n')[0] as string);
        fiches.push({
          i: `${numero}-l${k + 1}`,
          t: p.titre ?? m.titreCourt,
          c: categorie,
          g: 'l',
          h: html(sansIntitule(p.md), numero),
          u: lienPassage(base, r.id, espaces(debut), page),
          m: numero,
        });
      });
    } else if (['Points clés', 'Pièges à éviter', 'Textes de référence'].includes(r.titre)) {
      fiches.push({
        i: `${numero}-${r.id}`,
        t: `${r.titre} : ${m.titreCourt}`,
        c: categorie,
        g: 'p',
        h: html(r.markdown, numero),
        u: `${base}#${r.id}`,
        m: numero,
      });
    } else if (r.quiz) {
      for (const x of exercicesDuModule(numero).filter((x) => !x.suite)) {
        fiches.push({
          i: x.id,
          t: texteBrut(x.question),
          c: `Exercice du module ${numero} — ${m.titreCourt}`,
          g: 'q',
          h: `<p><strong>Réponse :</strong> ${reponseExercice(x)}</p>${html(x.explication, numero)}`,
          u: `${base}#exercices-${idModule(numero)}-${x.id}`,
          m: numero,
        });
      }
      for (const q of quizDuModule(m)) {
        fiches.push({
          i: q.id,
          t: q.question,
          c: `Quiz du module ${numero} — ${m.titreCourt}`,
          g: 'q',
          h: `<p><strong>Réponse :</strong> ${rendreEnLigne(q.options[q.reponse])}</p>${html(q.explication, numero)}`,
          u: `${base}#${r.id}`,
          m: numero,
        });
      }
    }
  }
  return fiches;
}

/** Bonne réponse d'un exercice, en clair. */
function reponseExercice(x: Exercice): string {
  const option = (l: keyof Exercice['options']) => rendreEnLigne(x.options[l] ?? '');
  if (x.type === 'vf') return x.vrai ? 'vrai' : 'faux';
  if (x.type === 'nombre') {
    const valeur = (x.valeur ?? 0).toLocaleString('fr-FR', { maximumFractionDigits: 2 });
    return `${valeur}${x.unite ? `\u00a0${x.unite}` : ''}`;
  }
  return x.lettres.map(option).join(' ; ');
}

/** Une fiche par ligne des tableaux d'une annexe ou d'une section. */
function fichesDesLignes(e: Element, adresse: string, categorie: string): Fiche[] {
  return lignesDeTableaux(e.markdown).map(({ entetes, cellules }, k) => {
    // Titre : les premières colonnes (hors numéro), la dernière étant la valeur.
    const titre = cellules
      .slice(0, Math.max(1, cellules.length - 1))
      .filter((c) => !/^\d+$/.test(c))
      .map((c) => texteBrut(c))
      .join(' — ');
    const corps = cellules
      .map(
        (c, j) =>
          `<p><strong>${entetes[j] ?? ''} :</strong> ${rendreEnLigne(c, nouveauContexte({ modulesExistants, liensAnnexes: COURS_PUBLIC }))}</p>`,
      )
      .join('');
    return { i: `${e.id}-r${k + 1}`, t: titre, c: categorie, g: 'a', h: corps, u: adresse };
  });
}

function fichesDesAnnexes(): Fiche[] {
  const fiches: Fiche[] = [];
  const annexe = (lettre: string) => annexes.find((a) => a.numero === lettre) as Element;
  for (const lettre of ['A', 'B', 'H', 'I']) {
    const a = annexe(lettre);
    fiches.push(...fichesDesLignes(a, lien(cheminAnnexe(lettre)), `Annexe ${lettre} — ${a.titreCourt}`));
  }
  // Textes de référence (D) et formules (E) : passages à intitulé en gras.
  for (const lettre of ['D', 'E']) {
    const a = annexe(lettre);
    decouperEnPassages(a.markdown)
      .filter((p) => p.titre)
      .forEach((p, k) =>
        fiches.push({
          i: `${a.id}-p${k + 1}`,
          t: p.titre as string,
          c: `Annexe ${lettre} — ${a.titreCourt}`,
          g: 'a',
          h: html(p.md),
          u: lien(cheminAnnexe(lettre)),
        }),
      );
  }
  const section05 = partieModeEmploi.elements.find((s) => s.numero === '0.5') as Element;
  fiches.push(...fichesDesLignes(section05, `${lien('mode-d-emploi/')}#${section05.id}`, 'Les nouveautés 2025-2026'));

  for (const t of termes) {
    fiches.push({
      i: `g-${t.id}`,
      t: t.terme,
      c: 'Glossaire',
      g: 'g',
      h: html(t.definition),
      u: `${lien('glossaire/')}#${t.id}`,
    });
  }
  for (const l of lettres(formation)) {
    const r = referencementLettre(l);
    fiches.push({
      i: `lettre-${l.id}`,
      t: `Modèle de lettre : ${l.titre}`,
      c: `Lettres types — ${l.numero}`,
      g: 'a',
      h: `<p>${r.description}</p>`,
      u: lien(`lettres/${r.slug}/`),
    });
  }
  const g = annexe('G');
  for (const c of checklists(formation).filter((c) => c.elementId === g.id)) {
    fiches.push({
      i: `checklist-${c.id}`,
      t: `Checklist : ${c.titre}`,
      c: `Annexe G — ${g.titreCourt}`,
      g: 'a',
      h: `<ul>${c.items.map((item) => `<li>${rendreEnLigne(item)}</li>`).join('')}</ul>`,
      u: `${lien(cheminAnnexe('G'))}#${g.rubriques.find((r) => r.checklist?.id === c.id)?.id ?? ''}`,
    });
  }
  return fiches;
}

export function construireBase(): BaseFiches {
  const fiches = [...tousLesModules.flatMap(fichesDuModule), ...fichesDesAnnexes()];
  const ids = new Set<string>();
  for (const f of fiches) {
    if (ids.has(f.i)) throw new Error(`Fiche en double dans l'outil « Poser une question » : ${f.i}`);
    ids.add(f.i);
  }
  return { fiches, synonymes: synonymesAvecSigles() };
}

/**
 * Régénération de structure.json, quiz.json et glossaire.json à partir du Markdown.
 * Le format (ordre des clés, indentation de 2 espaces, pas de saut de ligne final)
 * reproduit à l'identique les fichiers livrés dans le pack.
 */
import { glossaire, modules, quizDuModule } from './parse-formation';
import type { Formation } from './types';

export const NOM_SOURCE_JSON = 'formation-immobilier-locatif-2026.md';

const entete = (f: Formation) => ({
  edition: f.edition,
  a_jour_au: f.aJourAu,
  source: NOM_SOURCE_JSON,
});

export function versStructureJson(f: Formation) {
  return {
    ...entete(f),
    niveaux: f.parties.map((p) => ({
      titre: p.titre,
      id: p.id,
      elements: p.elements.map((e) => {
        const base = { type: e.type, titre: e.titre, id: e.id, sections: e.rubriques.map((r) => r.titre) };
        return e.type === 'module' ? { ...base, numero: e.numero, titre_court: e.titreCourt } : base;
      }),
    })),
  };
}

export function versQuizJson(f: Formation) {
  const mods = modules(f).map((m) => ({
    module: m.numero,
    titre: m.titreCourt,
    niveau: m.niveau,
    questions: quizDuModule(m),
  }));
  return {
    ...entete(f),
    total_questions: mods.reduce((s, m) => s + m.questions.length, 0),
    modules: mods,
  };
}

export function versGlossaireJson(f: Formation) {
  const termes = glossaire(f);
  return { ...entete(f), total: termes.length, termes };
}

export const serialiser = (donnees: unknown): string => JSON.stringify(donnees, null, 2);

import { describe, expect, it } from 'vitest';
import { ATTENDUS, comptages, ecartsComptages } from './attendus';
import {
  checklists,
  encadres,
  ErreurFormation,
  glossaire,
  lettres,
  modules,
  parseFormation,
  quizDuModule,
  tousLesElements,
  toutesLesQuestions,
} from './parse-formation';
import { slugify } from './slug';
import { lireSource } from './source';

const formation = parseFormation(lireSource());
const parNumero = (n: string) => modules(formation).find((m) => m.numero === n)!;

describe('comptages (critère d’acceptation 1)', () => {
  it('correspond exactement aux nombres attendus', () => {
    expect(ecartsComptages(formation)).toEqual([]);
  });
  it('38 modules répartis 12 / 14 / 12', () => {
    expect(comptages(formation).modulesParNiveau).toEqual({ 1: 12, 2: 14, 3: 12 });
  });
  it('122 questions, 180 termes, 10 lettres, 7 checklists', () => {
    expect(toutesLesQuestions(formation)).toHaveLength(ATTENDUS.questions);
    expect(glossaire(formation)).toHaveLength(ATTENDUS.termes);
    expect(lettres(formation)).toHaveLength(ATTENDUS.lettres);
    expect(checklists(formation)).toHaveLength(ATTENDUS.checklists);
  });
});

describe('en-tête du document', () => {
  it('lit le titre, l’édition et la date de mise à jour', () => {
    expect(formation.titre).toBe("Formation complète — L'immobilier locatif en France");
    expect(formation.edition).toBe('septembre 2026');
    expect(formation.aJourAu).toBe('2026-09-24');
    expect(formation.aJourAuTexte).toBe('24 septembre 2026');
    expect(formation.accroche).toMatch(/^Trois niveaux progressifs/);
  });
  it('isole la phrase de conclusion finale', () => {
    expect(formation.conclusion).toBe("*Fin de la formation. Bonne route vers l'autonomie.*");
    const annexeI = tousLesElements(formation).at(-1)!;
    expect(annexeI.markdown).not.toContain('Fin de la formation');
    expect(annexeI.markdown).toMatch(/Vérifiez toujours la date d'entrée en vigueur\.$/);
  });
});

describe('parties et éléments', () => {
  it('reconnaît les cinq parties dans l’ordre', () => {
    expect(formation.parties.map((p) => [p.type, p.niveau])).toEqual([
      ['mode-emploi', undefined],
      ['niveau', 1],
      ['niveau', 2],
      ['niveau', 3],
      ['annexes', undefined],
    ]);
  });
  it('garde l’introduction de chaque niveau sans le séparateur final', () => {
    const n1 = formation.parties[1];
    expect(n1.intro).toMatch(/^Ce premier niveau pose le vocabulaire/);
    expect(n1.intro).not.toMatch(/---/);
  });
  it('découpe un module en six rubriques', () => {
    const m = parNumero('1.1');
    expect(m.titreCourt).toBe("Le paysage de l'immobilier locatif et les règles du jeu");
    expect(m.rubriques.map((r) => r.titre)).toEqual([
      'Objectifs',
      'Leçon',
      'Points clés',
      'Pièges à éviter',
      'Textes de référence',
      'Quiz 1.1',
    ]);
    expect(m.rubriques.map((r) => r.id)).toEqual([
      'objectifs',
      'lecon',
      'points-cles',
      'pieges-a-eviter',
      'textes-de-reference',
      'quiz-1-1',
    ]);
    expect(m.niveau).toBe(1);
  });
  it('tronque l’identifiant du module 3.11 à 80 caractères', () => {
    const m = parNumero('3.11');
    expect(m.id).toHaveLength(80);
    expect(m.id).toBe('module-3-11-les-autres-baux-commercial-professionnel-parking-et-baux-de-longue-d');
  });
  it('type correctement examens, checklist, sections et annexes', () => {
    const types = tousLesElements(formation).map((e) => e.type);
    expect(types.filter((t) => t === 'examen')).toHaveLength(3);
    expect(types.filter((t) => t === 'checklist')).toHaveLength(1);
    expect(types.filter((t) => t === 'section')).toHaveLength(5);
    const annexes = tousLesElements(formation).filter((e) => e.type === 'annexe');
    expect(annexes.map((a) => a.numero).join('')).toBe('ABCDEFGHI');
  });
  it('conserve le Markdown des rubriques sans le modifier', () => {
    const lecon = parNumero('1.12').rubriques.find((r) => r.id === 'lecon')!;
    expect(lecon.markdown).toContain('Cash-flow mensuel avant impôt : (6 240 − 2 127) / 12 − 652,43 = −309,68 €.');
    expect(lireSource()).toContain(lecon.markdown);
  });
});

describe('quiz', () => {
  it('extrait les questions du module 1.1 avec identifiants, options et explication', () => {
    const q = quizDuModule(parNumero('1.1'));
    expect(q).toHaveLength(4);
    expect(q[0].id).toBe('q1-1-1');
    expect(q[0].options.B).toBe('La loi n° 89-462 du 6 juillet 1989');
    expect(q[0].reponse).toBe('B');
    expect(q[3].id).toBe('q1-1-4');
    expect(q[0].explication).toMatch(/^La loi du 6 juillet 1989/);
  });
  it('donne une réponse A à D et une explication à chacune des 122 questions', () => {
    for (const q of toutesLesQuestions(formation)) {
      expect(['A', 'B', 'C', 'D']).toContain(q.reponse);
      expect(q.explication.length).toBeGreaterThan(10);
      expect(Object.values(q.options).every((o) => o.length > 0)).toBe(true);
    }
  });
  it('a des identifiants de question uniques', () => {
    const ids = toutesLesQuestions(formation).map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('encadrés', () => {
  it('compte les encadrés par type', () => {
    expect(comptages(formation).encadresParType).toEqual(ATTENDUS.encadresParType);
  });
  it('conserve chaque ligne des exemples chiffrés', () => {
    const exemple = parNumero('1.12').encadres.find((e) => e.type === 'EXEMPLE')!;
    expect(exemple.lignes).toHaveLength(6);
    expect(exemple.lignes[1]).toBe('Rentabilité brute : 6 240 / 118 000 = 5,29 %.');
  });
  it('numérote les encadrés dans chaque élément', () => {
    const m = parNumero('2.1');
    expect(m.encadres.map((e) => [e.type, e.rang])).toEqual([
      ['EXEMPLE', 1],
      ['ATTENTION', 2],
      ['A_SURVEILLER', 3],
    ]);
  });
  it('repère les neuf encadrés « À surveiller », dont deux dans l’avertissement 0.4', () => {
    const aSurveiller = encadres(formation).filter((e) => e.type === 'A_SURVEILLER');
    expect(aSurveiller).toHaveLength(9);
    expect(aSurveiller[0].elementId).toBe('0-4-avertissement-important');
    expect(aSurveiller[1].elementId).toBe('0-4-avertissement-important');
  });
});

describe('lettres, checklists, glossaire, formules', () => {
  it('extrait les dix modèles de lettres F1 à F10', () => {
    const l = lettres(formation);
    expect(l.map((x) => x.numero)).toEqual(['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10']);
    expect(l[0].titre).toBe('Révision annuelle du loyer');
    expect(l[0].texte.split('\n')[0]).toBe('[Nom et adresse du bailleur]');
    expect(l[7].texte).toMatch(/^QUITTANCE DE LOYER/);
  });
  it('extrait les sept checklists avec leurs cases', () => {
    const c = checklists(formation);
    expect(c.map((x) => [x.id, x.items.length])).toEqual([
      ['mettre-en-location-son-premier-logement', 13],
      ['g1', 8],
      ['g2', 6],
      ['g3', 7],
      ['g4', 6],
      ['g5', 6],
      ['g6', 7],
    ]);
  });
  it('extrait les 180 termes du glossaire avec des identifiants uniques', () => {
    const g = glossaire(formation);
    expect(new Set(g.map((t) => t.id)).size).toBe(180);
    expect(g[0]).toEqual({
      terme: 'Abattement',
      definition:
        "Réduction forfaitaire d'une base imposable (par exemple 30 % au micro-foncier, 50 % au micro-BIC, abattements pour durée de détention des plus-values).",
      lettre: 'A',
      id: 'abattement',
    });
  });
  it('trouve 14 formules dans l’annexe E et 4 dans les modules', () => {
    const e = tousLesElements(formation).find((x) => x.numero === 'E')!;
    expect(e.formules).toHaveLength(14);
    expect(e.formules[0]).toMatch(/^cout_total = prix/);
    expect(comptages(formation).formules).toBe(18);
  });
});

describe('erreurs de syntaxe', () => {
  const doc = (corps: string) =>
    `# Titre\n\n**Édition septembre 2026 — contenu à jour au 24 septembre 2026**\n\n## NIVEAU 1 — Test\n\n${corps}`;

  it('accepte un document minimal', () => {
    const f = parseFormation(doc('### Module 1.1 — Essai\n\n#### Leçon\n\nTexte.'));
    expect(f.parties[0].elements[0].numero).toBe('1.1');
  });
  it('refuse un type d’encadré inconnu en citant la ligne', () => {
    expect(() => parseFormation(doc('### Module 1.1 — Essai\n\n> [!INFO]\n> Texte'))).toThrow(
      /Ligne 9 : type d'encadré inconnu « INFO »/,
    );
  });
  it('refuse une question de quiz sans réponse', () => {
    const md = doc('### Module 1.1 — Essai\n\n#### Quiz 1.1\n\n```quiz\nQ: ?\nA: a\nB: b\nC: c\nD: d\nE: e\n```');
    expect(() => parseFormation(md)).toThrow(ErreurFormation);
    expect(() => parseFormation(md)).toThrow(/sans ligne « R: »/);
  });
  it('refuse une réponse hors A-D', () => {
    const md = doc('### Module 1.1 — Essai\n\n#### Quiz 1.1\n\n```quiz\nQ: ?\nA: a\nB: b\nC: c\nD: d\nR: F\nE: e\n```');
    expect(() => parseFormation(md)).toThrow(/réponse de quiz « F »/);
  });
  it('refuse un bloc de code non refermé', () => {
    expect(() => parseFormation(doc('### Module 1.1 — Essai\n\n```\nx = 1'))).toThrow(/jamais refermé/);
  });
  it('refuse un titre de niveau 3 inconnu', () => {
    expect(() => parseFormation(doc('### Chapitre bizarre'))).toThrow(/titre de niveau 3 non reconnu/);
  });
  it('ignore les « # » situés dans un bloc de code', () => {
    const f = parseFormation(doc('### Module 1.1 — Essai\n\n```\n# pas un titre\n```'));
    expect(f.parties[0].elements).toHaveLength(1);
  });
});

describe('slugify', () => {
  it('reproduit la convention des fichiers livrés', () => {
    expect(slugify('0.3 Conventions de rédaction (utiles pour la page web)')).toBe(
      '0-3-conventions-de-redaction-utiles-pour-la-page-web',
    );
    expect(slugify("Accompagnateur Rénov'")).toBe('accompagnateur-renov');
    expect(slugify('Éco-PTZ')).toBe('eco-ptz');
    expect(slugify('Zonage A, B, C')).toBe('zonage-a-b-c');
  });
});

import { describe, expect, it } from 'vitest';
import { construireBase, decouperEnPassages, lignesDeTableaux, sansIntitule } from './assistant';
import { IndexFiches, mots, racine, repondre } from './assistant-recherche';

describe('mots de la question', () => {
  it('ramène singulier et pluriel, nom et verbe à la même racine', () => {
    expect(racine('loyers')).toBe(racine('loyer'));
    expect(racine('charges')).toBe(racine('charge'));
    expect(racine('impayes')).toBe(racine('impaye'));
    expect(racine('declarations')).toBe(racine('declarer'));
    expect(racine('vends')).toBe(racine('vendre'));
    expect(racine('retroactivement')).toBe(racine('retroactivite'));
  });

  it('ignore accents et mots vides, garde les classes DPE et les montants', () => {
    expect(mots('Mon logement est classé F')).toEqual(mots('logement classe f'));
    expect(mots('Est-ce que je peux')).toEqual([]);
    expect(mots('plafond de 15 000 €')).toContain('15000');
    expect(mots('classé G')).toContain('g');
  });
});

describe('découpage de la formation', () => {
  it('un passage par paragraphe à intitulé en gras, avec ses tableaux et encadrés', () => {
    const p = decouperEnPassages(
      'Intro sans intitulé.\n\n**Le dossier.** Texte.\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n> [!ATTENTION]\n> Encadré.\n\n**Les visites** (article 3) : texte.',
    );
    expect(p.map((x) => x.titre)).toEqual([undefined, 'Le dossier', 'Les visites']);
    expect(p[1]?.md).toContain('| 1 | 2 |');
    expect(p[1]?.md).toContain('Encadré.');
  });

  it('retire l’intitulé déjà affiché comme titre', () => {
    expect(sansIntitule('**L’annonce.** Une annonce précise.')).toBe('Une annonce précise.');
    expect(sansIntitule('**Choisir la garantie.**\n\n| a | b |')).toBe('| a | b |');
    expect(sansIntitule('**Ce qui est interdit** (article 22-2) : relevés.')).toBe('(article 22-2) : relevés.');
  });

  it('une ligne de tableau par fiche, avec les en-têtes', () => {
    expect(lignesDeTableaux('| Date | Événement |\n|---|---|\n| 2028 | F non décent |')).toEqual([
      { entetes: ['Date', 'Événement'], cellules: ['2028', 'F non décent'] },
    ]);
  });
});

const base = construireBase();
const index = new IndexFiches(base);

describe('base de fiches', () => {
  it('couvre leçons, points clés, quiz et exercices, glossaire et annexes', () => {
    const genres = new Set(base.fiches.map((f) => f.g));
    expect([...genres].sort()).toEqual(['a', 'g', 'l', 'p', 'q']);
    expect(base.fiches.length).toBeGreaterThan(1000);
  });

  it('chaque fiche a un titre, une réponse et une adresse dans le site', () => {
    for (const f of base.fiches) {
      expect(f.t.trim(), f.i).not.toBe('');
      expect(f.h.trim(), f.i).not.toBe('');
      expect(f.u, f.i).toMatch(/^\//);
      expect(f.h, f.i).not.toMatch(/\sid="/);
    }
  });

  it('ajoute les sigles du glossaire aux synonymes', () => {
    expect(base.synonymes.GLI).toMatch(/loyers impayés/i);
  });
});

describe('réponses', () => {
  /** Question d'élève → la réponse principale doit venir de ce module (ou porter ce titre). */
  const attendus: [string, (m: string | undefined, titre: string) => boolean][] = [
    ['Mon logement est classé F, est-ce que je peux encore le louer ?', (m) => m === '3.9' || m === '1.4'],
    ['Quand les logements G deviennent-ils interdits à la location ?', (m) => m === '3.9' || m === '1.4'],
    ['Comment calculer la révision du loyer ?', (_, t) => /IRL|révision/i.test(t)],
    ['Quels papiers je peux demander à un locataire ?', (m) => m === '1.7'],
    ['Quels papiers puis-je demander à un candidat locataire ?', (m, t) => m === '1.7' && /pouvez demander/.test(t)],
    ['Est-ce que je peux demander des relevés bancaires ?', (m) => m === '1.7'],
    ['Combien de temps pour rendre la caution ?', (_, t) => /dépôt de garantie/i.test(t)],
    ['Mon locataire ne paie plus son loyer, que faire ?', (m) => m === '2.13'],
    ['Micro-foncier ou régime réel, lequel choisir ?', (m) => m === '2.6' || m === '2.8'],
    ["C'est quoi le déficit foncier ?", (_, t) => /déficit foncier/i.test(t)],
    ['Puis-je cumuler une GLI et une caution ?', (m) => m === '1.7' || m === '2.4'],
    ['Le propriétaire peut-il changer les serrures ?', (m) => m === '2.13'],
    ["Qu'est-ce que l'IRL ?", (_, t) => /IRL/.test(t)],
    ['Quelle durée pour un bail meublé ?', (_, t) => /durée/i.test(t)],
  ];
  for (const [question, verifier] of attendus) {
    it(question, () => {
      const r = repondre(index, question);
      expect(r.principale, 'aucune réponse').toBeDefined();
      const f = r.principale?.fiche;
      expect(verifier(f?.m, f?.t ?? ''), `réponse : ${f?.t} (${f?.c})`).toBe(true);
    });
  }

  it('ne présente pas de réponse à une question hors sujet', () => {
    expect(repondre(index, 'Quelle est la meilleure recette de crêpes ?').principale).toBeUndefined();
  });

  it('« ne paie plus » compte comme un impayé, « qui paie l’entretien » non', () => {
    expect([...index.analyser('Mon locataire ne paie plus').ajoutes.keys()]).toContain(racine('impaye'));
    expect([...index.analyser('Qui paie l’entretien de la chaudière ?').ajoutes.keys()]).not.toContain(
      racine('impaye'),
    );
  });

  it('favorise le module depuis lequel la question est posée', () => {
    const r = repondre(index, 'Quels sont les pièges à éviter ?', '2.6');
    expect(r.principale?.fiche.m).toBe('2.6');
  });

  it('répond en quelques millisecondes', () => {
    const debut = performance.now();
    for (let k = 0; k < 20; k++) repondre(index, 'Quel délai pour rendre le dépôt de garantie en meublé ?');
    expect((performance.now() - debut) / 20).toBeLessThan(50);
  });
});

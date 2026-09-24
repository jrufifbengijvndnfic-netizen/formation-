import { describe, expect, it } from 'vitest';
import { ChercheurGlossaire, normaliser, variantesDuTerme } from './glossaire-match';
import { glossaire, parseFormation } from './parse-formation';
import { lireSource } from './source';

const termes = glossaire(parseFormation(lireSource()));
const chercheur = new ChercheurGlossaire(termes);
const ids = (texte: string) => chercheur.chercher(texte).map((o) => o.id);

describe('repérage des termes du glossaire', () => {
  it('ignore la casse et les accents des mots ordinaires', () => {
    expect(ids('La DECENCE du logement')).toEqual(['decence']);
    expect(ids('les abattements pour durée de détention')).toEqual(['abattement']);
  });
  it('exige la casse exacte pour les sigles', () => {
    expect(ids('Le TRI des fonds propres')).toEqual(['tri']);
    expect(ids('le tri sélectif, une van, un ort')).toEqual([]);
    expect(ids('la carte G')).toEqual(['carte-g']);
    expect(ids('la carte g')).toEqual([]);
  });
  it('préfère la formulation la plus longue', () => {
    expect(ids('un bail mobilité de dix mois')).toEqual(['bail-mobilite']);
    expect(ids('le DPE collectif de l’immeuble')).toEqual(['dpe-collectif']);
  });
  it('reconnaît les variantes entre parenthèses et les sigles associés', () => {
    expect(variantesDuTerme({ terme: 'Assurance loyers impayés (GLI)', definition: '', lettre: 'A', id: 'x' })).toEqual([
      'Assurance loyers impayés (GLI)',
      'Assurance loyers impayés',
      'GLI',
    ]);
    expect(variantesDuTerme({ terme: 'ELAN (loi)', definition: '', lettre: 'E', id: 'x' })).toContain('loi ELAN');
    expect(ids('une GLI et le dispositif Jeanbrun')).toEqual(['assurance-loyers-impayes-gli', 'jeanbrun-dispositif']);
    expect(ids("l'ILC ou l'ILAT")).toEqual(['ilc-et-ilat', 'ilc-et-ilat']);
  });
  it('exclut les termes trop génériques', () => {
    expect(ids('Le bail et le congé')).toEqual([]);
  });
  it('respecte les limites de mots', () => {
    expect(ids('syndicat')).toEqual([]);
    expect(ids('le syndicat des copropriétaires')).toEqual(['syndicat-des-coproprietaires']);
  });
  it('normalise sans changer la longueur du texte', () => {
    const t = 'Éco-PTZ à l’État';
    expect(normaliser(t)).toHaveLength(t.length);
    expect(normaliser(t)).toBe("eco-ptz a l'etat");
  });
  it('trouve chaque terme de l’annexe C sous sa propre forme', () => {
    const introuvables = termes
      .filter((t) => !['bail', 'conge', 'zonage-a-b-c'].includes(t.id))
      .filter((t) => !chercheur.chercher(t.terme).some((o) => o.id === t.id))
      .map((t) => t.terme);
    expect(introuvables).toEqual([]);
  });
});

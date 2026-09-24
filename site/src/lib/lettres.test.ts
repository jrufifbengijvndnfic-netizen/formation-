import { describe, expect, it } from 'vitest';
import { analyserLettre, champsDe, remplirLettre } from './lettres';
import { lettres, parseFormation } from './parse-formation';
import { lireSource } from './source';

const toutes = lettres(parseFormation(lireSource()));
const f1 = toutes[0]!;
const f2 = toutes[1]!;

describe('modèles de lettres', () => {
  it('reproduit le modèle à l’identique quand aucun champ n’est rempli', () => {
    for (const l of toutes) {
      expect(remplirLettre(analyserLettre(l.id, l.texte), {})).toBe(l.texte);
    }
  });
  it('repère les champs de F1 avec leur contexte', () => {
    const champs = champsDe(analyserLettre(f1.id, f1.texte));
    expect(champs[0]).toMatchObject({ id: 'f1-c1', libelle: 'Nom et adresse du bailleur', genre: 'texte' });
    const date = champs.find((c) => c.contexte === '[Lieu], le …');
    expect(date?.genre).toBe('date');
    expect(champs.some((c) => c.libelle === 'loyer actuel')).toBe(true);
  });
  it('propose une liste pour les alternatives et garde les crochets englobants', () => {
    const champs = champsDe(analyserLettre(f2.id, f2.texte));
    const choix = champs.find((c) => c.libelle === 'en votre faveur / à votre charge');
    expect(choix?.genre).toBe('choix');
    expect(choix?.options).toEqual(['en votre faveur', 'à votre charge']);
    const segments = analyserLettre(f2.id, f2.texte);
    const texte = remplirLettre(segments, Object.fromEntries(champsDe(segments).map((c) => [c.id, 'X'])));
    expect(texte).toContain('[Ce montant vous sera remboursé le X / Ce montant sera à régler avec l\'échéance du X.]');
  });
  it('met en forme les dates saisies', () => {
    const segments = analyserLettre(f1.id, f1.texte);
    const date = champsDe(segments).find((c) => c.contexte === '[Lieu], le …')!;
    const lieu = champsDe(segments).find((c) => c.libelle === 'Lieu')!;
    const texte = remplirLettre(segments, { [date.id]: '2026-09-24', [lieu.id]: 'Lyon' });
    expect(texte).toContain('Lyon, le 24 septembre 2026');
  });
  it('compte les champs de chaque modèle', () => {
    expect(toutes.map((l) => champsDe(analyserLettre(l.id, l.texte)).length).every((n) => n > 0)).toBe(true);
  });
});

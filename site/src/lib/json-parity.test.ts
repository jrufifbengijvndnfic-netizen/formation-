/**
 * Preuve de fidélité du parseur : les trois JSON livrés dans le pack se régénèrent
 * à l'octet près depuis le Markdown.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { serialiser, versGlossaireJson, versQuizJson, versStructureJson } from './json-export';
import { parseFormation } from './parse-formation';
import { DOSSIER_PACK, lireSource } from './source';

const formation = parseFormation(lireSource());
const livre = (nom: string) => readFileSync(path.join(DOSSIER_PACK, nom), 'utf8');

describe('parité avec les JSON du pack', () => {
  it('structure.json', () => {
    expect(serialiser(versStructureJson(formation))).toBe(livre('structure.json'));
  });
  it('quiz.json', () => {
    expect(serialiser(versQuizJson(formation))).toBe(livre('quiz.json'));
  });
  it('glossaire.json', () => {
    expect(serialiser(versGlossaireJson(formation))).toBe(livre('glossaire.json'));
  });
});

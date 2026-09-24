/**
 * Test différentiel : les mêmes entrées aléatoires passent dans reference-calculs.py
 * (via scripts/pont-reference.py) et dans calculs.ts ; les résultats doivent coïncider.
 * Ignoré si python3 n'est pas installé.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import * as calc from './calculs';
import { RACINE_SITE } from './source';

const python = spawnSync('python3', ['--version']);
const pythonDisponible = python.status === 0;

interface Cas {
  fonction: string;
  args?: unknown[];
  kwargs?: Record<string, unknown>;
}

function executerPython(cas: Cas[]): unknown[] {
  const r = spawnSync('python3', [path.join(RACINE_SITE, 'scripts/pont-reference.py')], {
    input: JSON.stringify(cas),
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0) throw new Error(r.stderr);
  return JSON.parse(r.stdout) as unknown[];
}

/** Générateur pseudo-aléatoire déterministe (mulberry32) pour des cas reproductibles. */
function aleatoire(graine: number) {
  let a = graine;
  const suivant = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    entre: (min: number, max: number) => Math.round((min + suivant() * (max - min)) * 100) / 100,
    entier: (min: number, max: number) => Math.floor(min + suivant() * (max - min + 1)),
    parmi: <T,>(liste: readonly T[]): T => liste[Math.floor(suivant() * liste.length)] as T,
  };
}

function proche(a: unknown, b: unknown, chemin = ''): void {
  if (typeof a === 'number' && typeof b === 'number') {
    const tolerance = 1e-6 * Math.max(1, Math.abs(b));
    expect(Math.abs(a - b), `${chemin} : ${a} contre ${b} (Python)`).toBeLessThanOrEqual(tolerance);
  } else if (Array.isArray(a) && Array.isArray(b)) {
    expect(a.length, chemin).toBe(b.length);
    a.forEach((x, i) => proche(x, b[i], `${chemin}[${i}]`));
  } else if (a && b && typeof a === 'object' && typeof b === 'object') {
    for (const k of Object.keys(b)) proche((a as never)[k], (b as never)[k], `${chemin}.${k}`);
  } else {
    expect(a, chemin).toEqual(b);
  }
}

describe.skipIf(!pythonDisponible)('calculs.ts contre reference-calculs.py (entrées aléatoires)', () => {
  const r = aleatoire(20260924);
  const cas: { py: Cas; ts: () => unknown }[] = [];
  const ajouter = (py: Cas, ts: () => unknown) => cas.push({ py, ts });

  for (let i = 0; i < 150; i++) {
    const capital = r.entre(10_000, 600_000);
    const taux = r.entre(0.005, 0.07);
    const annees = r.entier(5, 27);
    const tassu = r.entre(0, 0.006);
    ajouter({ fonction: 'mensualite', args: [capital, taux, annees] }, () => calc.mensualite(capital, taux, annees));
    const revenus = r.entre(1_000, 15_000);
    const loyers = r.entre(0, 3_000);
    const credits = r.entre(0, 800);
    ajouter({ fonction: 'capacite_emprunt', args: [revenus, loyers, credits, taux, annees, tassu] }, () =>
      calc.capaciteEmprunt(revenus, loyers, credits, taux, annees, tassu),
    );
    const loyer = r.entre(300, 3_000);
    const irlA = r.entre(130, 150);
    const irlN = r.entre(130, 155);
    const dpe = r.parmi(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    ajouter({ fonction: 'revision_irl', args: [loyer, irlN, irlA, dpe] }, () =>
      calc.revisionIrl(loyer, irlN, irlA, dpe),
    );
    const tmi = r.parmi([0, 0.11, 0.3, 0.41, 0.45]);
    const recettes = r.entre(1_000, 40_000);
    const charges = r.entre(0, 30_000);
    const interets = r.entre(0, 15_000);
    const nb = r.entier(0, 4);
    ajouter({ fonction: 'impot_micro_foncier', args: [recettes, tmi] }, () => calc.impotMicroFoncier(recettes, tmi));
    ajouter({ fonction: 'impot_reel_foncier', args: [recettes, charges, nb, tmi] }, () =>
      calc.impotReelFoncier(recettes, charges, nb, tmi),
    );
    const plafond = r.parmi([10_700, 21_400]);
    ajouter({ fonction: 'deficit_foncier', args: [recettes, interets, charges, plafond] }, () =>
      calc.deficitFoncier(recettes, interets, charges, plafond),
    );
    const abattement = r.parmi([0.5, 0.3]);
    ajouter({ fonction: 'impot_micro_bic', args: [recettes, abattement, tmi] }, () =>
      calc.impotMicroBic(recettes, abattement, tmi),
    );
    const amort = r.entre(0, 12_000);
    ajouter({ fonction: 'lmnp_reel', args: [recettes, charges, amort, tmi] }, () =>
      calc.lmnpReel(recettes, charges, amort, tmi),
    );
    const prix = r.entre(50_000, 900_000);
    const travaux = r.entre(0, 300_000);
    const neuf = r.parmi([true, false]);
    const regime = r.parmi(['intermediaire', 'social', 'tres_social'] as const);
    const plafondJ = r.parmi([8_000, 10_000, 12_000]);
    ajouter({ fonction: 'jeanbrun', args: [prix, travaux, neuf, regime, plafondJ] }, () =>
      calc.jeanbrun(prix, travaux, neuf, regime, plafondJ),
    );
    const p = r.entre(0, 400_000);
    ajouter({ fonction: 'surtaxe', args: [p] }, () => calc.surtaxe(p));
    const vente = r.entre(30_000, 1_500_000);
    const d = r.entier(0, 35);
    const frais = r.entre(0, 40_000);
    const amortPv = r.entre(0, 100_000);
    const fc = r.entre(0, 20_000);
    ajouter(
      { fonction: 'plus_value', args: [prix, frais, travaux, vente, d, amortPv, fc] },
      () => calc.plusValue(prix, frais, travaux, vente, d, amortPv, fc),
    );
    const patrimoine = r.entre(500_000, 12_000_000);
    ajouter({ fonction: 'ifi', args: [patrimoine] }, () => calc.ifi(patrimoine));
    const tauxDep = r.parmi([0.038, 0.045, 0.05]);
    ajouter({ fonction: 'dmto', args: [prix, tauxDep] }, () => calc.dmto(prix, tauxDep));
    ajouter({ fonction: 'emoluments_ttc', args: [prix] }, () => calc.emolumentsTtc(prix));
    const base = r.entre(0, 2_500_000);
    ajouter({ fonction: 'droits_ligne_directe', args: [base] }, () => calc.droitsLigneDirecte(base));
    const age = r.entier(0, 100);
    ajouter({ fonction: 'coef_nue_propriete', args: [age] }, () => calc.coefNuePropriete(age));
  }
  for (let i = 0; i < 25; i++) {
    const levier = r.parmi([true, false]);
    const taux = r.entre(0.01, 0.06);
    const horizon = r.entier(1, 25);
    const croissance = r.entre(-0.03, 0.04);
    ajouter(
      { fonction: 'scenario_colocation', kwargs: { levier, taux, horizon, croissance_prix: croissance } },
      () => calc.scenarioColocation({ levier, taux, horizon, croissancePrix: croissance }),
    );
  }

  it(`${cas.length} cas identiques à la référence Python`, () => {
    const attendus = executerPython(cas.map((c) => c.py));
    cas.forEach((c, i) => {
      proche(c.ts(), attendus[i], `${c.py.fonction} #${i}`);
    });
  });
});

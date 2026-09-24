/**
 * Chargement de la formation au moment du build (une seule lecture, mise en cache) et
 * vérification automatique des comptages : le build s'arrête si le contenu est incomplet.
 */
import { ecartsComptages } from './attendus';
import { parseFormation } from './parse-formation';
import { lireSource } from './source';
import type { Formation } from './types';

let cache: Formation | null = null;

export function chargerFormation(): Formation {
  if (cache) return cache;
  const f = parseFormation(lireSource());
  const ecarts = ecartsComptages(f);
  if (ecarts.length) {
    throw new Error(
      `Le contenu ne correspond pas aux comptages attendus (src/lib/attendus.ts) :\n- ${ecarts.join('\n- ')}`,
    );
  }
  cache = f;
  return f;
}

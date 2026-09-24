/**
 * Régénère structure.json, quiz.json et glossaire.json depuis le Markdown.
 *   npm run build-json            → vérifie que les fichiers du pack sont à jour (code 1 sinon)
 *   npm run build-json -- --write → réécrit les fichiers du pack
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { ecartsComptages } from '../src/lib/attendus';
import { serialiser, versGlossaireJson, versQuizJson, versStructureJson } from '../src/lib/json-export';
import { parseFormation } from '../src/lib/parse-formation';
import { DOSSIER_PACK, lireSource } from '../src/lib/source';

const ecrire = process.argv.includes('--write');
const formation = parseFormation(lireSource());

const ecarts = ecartsComptages(formation);
if (ecarts.length) {
  console.warn(`Attention, comptages différents de src/lib/attendus.ts :\n- ${ecarts.join('\n- ')}`);
}

const fichiers = {
  'structure.json': versStructureJson(formation),
  'quiz.json': versQuizJson(formation),
  'glossaire.json': versGlossaireJson(formation),
};

let differences = 0;
for (const [nom, donnees] of Object.entries(fichiers)) {
  const chemin = path.join(DOSSIER_PACK, nom);
  const genere = serialiser(donnees);
  const actuel = existsSync(chemin) ? readFileSync(chemin, 'utf8') : null;
  if (actuel === genere) {
    console.log(`✓ ${nom} : identique`);
    continue;
  }
  if (ecrire) {
    writeFileSync(chemin, genere);
    console.log(`✎ ${nom} : réécrit`);
  } else {
    differences++;
    console.log(`✗ ${nom} : différent du Markdown (lancez « npm run build-json -- --write »)`);
  }
}
process.exitCode = differences ? 1 : 0;

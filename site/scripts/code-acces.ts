/**
 * Empreinte d'un nouveau code d'accès, à coller dans EMPREINTES_ACCES (src/lib/acces.ts).
 * Usage : npm run code-acces -- <code> <niveau 1, 2 ou 3>
 * Exemple : npm run code-acces -- 7F3K-92QD 2
 */
import { EMPREINTES_ACCES, empreinteCode, normaliserCode } from '../src/lib/acces';

const [code = '', niveau = ''] = process.argv.slice(2);
if (!normaliserCode(code) || !['1', '2', '3'].includes(niveau)) {
  console.error('Usage : npm run code-acces -- <code> <niveau 1, 2 ou 3>');
  process.exit(1);
}
const empreinte = await empreinteCode(code);
const actuel = EMPREINTES_ACCES[empreinte];
if (actuel) console.log(`Ce code ouvre déjà le niveau ${actuel}.`);
console.log(`Code « ${normaliserCode(code)} », niveau ${niveau} : ligne à ajouter dans EMPREINTES_ACCES :`);
console.log(`  '${empreinte}': ${niveau},`);

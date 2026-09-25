/** Banque de questions du test final (JSON statique, chargé au démarrage du test). */
import { exercicesDuModule, tousLesModules } from '../../lib/donnees';
import { lienElement } from '../../lib/navigation';
import { quizDuModule } from '../../lib/parse-formation';
import { banqueTest } from '../../lib/test-final';

export function GET(): Response {
  return new Response(JSON.stringify(banqueTest(tousLesModules, quizDuModule, exercicesDuModule, lienElement)), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

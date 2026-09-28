/** Fiches de l'outil « Poser une question » (JSON statique, chargé à l'ouverture de la page). */
import { construireBase } from '../../lib/assistant';

export function GET(): Response {
  return new Response(JSON.stringify(construireBase()), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

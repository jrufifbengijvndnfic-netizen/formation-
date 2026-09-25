/**
 * Actions « À faire maintenant » de fin de module (files/…/actions.md) : une par module, avec un
 * simulateur éventuel. Logique pure, testée dans actions.test.ts.
 */

export interface ActionModule {
  module: string;
  texte: string;
  /** Identifiant d'un simulateur du site. */
  outil?: string;
}

export function lireActions(texte: string): ActionModule[] {
  const actions: ActionModule[] = [];
  let courante: ActionModule | null = null;
  texte.split('\n').forEach((brut, i) => {
    const ligne = brut.trim();
    const titre = /^## Module (\d\.\d{1,2})$/.exec(ligne);
    if (titre) {
      courante = { module: titre[1] as string, texte: '' };
      actions.push(courante);
      return;
    }
    if (!courante || !ligne) return;
    const outil = /^Outil : ([a-z0-9-]+)$/.exec(ligne);
    const c = courante as ActionModule;
    if (outil) c.outil = outil[1] as string;
    else if (c.texte) throw new Error(`actions.md, ligne ${i + 1} : une seule ligne de texte par action`);
    else c.texte = ligne;
  });
  return actions;
}

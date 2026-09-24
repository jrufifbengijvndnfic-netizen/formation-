/** Checklists : cases cochées mémorisées, remise à zéro, impression. */
import { modifier, progression, stockageLocal } from './stockage';

document.querySelectorAll<HTMLElement>('[data-checklist]').forEach((racine) => {
  const id = racine.dataset.checklist ?? '';
  const cases = [...racine.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-index]')];
  const etat = racine.querySelector<HTMLElement>('[data-checklist-etat]');

  const afficherEtat = () => {
    const cochees = cases.filter((c) => c.checked).length;
    if (etat) {
      etat.textContent = `${cochees} sur ${cases.length} case${cases.length > 1 ? 's' : ''} cochée${cochees > 1 ? 's' : ''}${
        stockageLocal() ? '' : ' (non conservées après la visite : stockage du navigateur indisponible)'
      }`;
    }
  };
  const charger = () => {
    const valeurs = progression().checklists[id] ?? [];
    cases.forEach((c, i) => (c.checked = valeurs[i] === true));
    afficherEtat();
  };
  const enregistrer = () =>
    modifier((p) => ({ ...p, checklists: { ...p.checklists, [id]: cases.map((c) => c.checked) } }));

  cases.forEach((c) =>
    c.addEventListener('change', () => {
      enregistrer();
      afficherEtat();
    }),
  );
  racine.querySelector('[data-checklist-raz]')?.addEventListener('click', () => {
    if (!cases.some((c) => c.checked)) return;
    if (!window.confirm('Décocher toutes les cases de cette liste ?')) return;
    cases.forEach((c) => (c.checked = false));
    enregistrer();
    afficherEtat();
  });
  charger();
  document.addEventListener('progression:modifiee', charger);
});

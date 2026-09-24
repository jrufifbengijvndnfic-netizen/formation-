/** Frise de l'annexe B : situation recalculée par rapport à la date du jour du visiteur. */
import { ajouterMois, formaterDateFr, iso } from '../lib/dates-fr';

const LIBELLES: Record<string, string> = { passe: 'Passé', imminent: 'Dans moins de six mois', futur: 'À venir' };

document.querySelectorAll<HTMLElement>('[data-frise]').forEach((racine) => {
  const d = new Date();
  const aujourdHui = iso(d.getFullYear(), d.getMonth() + 1, d.getDate());
  const dans6Mois = ajouterMois(aujourdHui, 6);
  const evenements = [...racine.querySelectorAll<HTMLLIElement>('.frise__evenement')];
  for (const li of evenements) {
    const debut = li.dataset.debut ?? '';
    const fin = li.dataset.fin ?? '';
    const periode = fin < aujourdHui ? 'passe' : debut <= dans6Mois ? 'imminent' : 'futur';
    li.dataset.periode = periode;
    const etiquette = li.querySelector('[data-etiquette]');
    if (etiquette) etiquette.textContent = LIBELLES[periode] ?? '';
  }
  const suivant = evenements.find((li) => (li.dataset.fin ?? '') >= aujourdHui);
  const repere = document.createElement('li');
  repere.className = 'frise__aujourdhui';
  const span = document.createElement('span');
  span.textContent = `Aujourd’hui, ${formaterDateFr(aujourdHui)}`;
  repere.appendChild(span);
  if (suivant) suivant.before(repere);
  else racine.querySelector('.frise')?.appendChild(repere);

  const legende = racine.querySelector('[data-frise-legende]');
  const reference = racine.dataset.reference;
  if (legende && reference) {
    legende.textContent = `Situation calculée par rapport à la date du jour (${formaterDateFr(aujourdHui)}). Le contenu de la formation est à jour au ${formaterDateFr(reference)} : les échéances postérieures ont pu évoluer.`;
  }
});

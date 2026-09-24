/** Simulateurs : recalcul à chaque saisie, erreurs explicites, paramètres partagés dans l'adresse. */
import { lireNombre, nombre } from '../lib/format';
import { rendreResultat } from '../lib/rendu-simulateur';
import {
  depuisParametres,
  executer,
  simulateurParId,
  valeursParDefaut,
  versParametres,
  type Simulateur,
  type Valeurs,
} from '../lib/simulateurs';

function champ(racine: HTMLElement, sim: Simulateur, id: string) {
  return racine.querySelector<HTMLInputElement | HTMLSelectElement>(`#${CSS.escape(`${sim.id}-${id}`)}`);
}

function lire(racine: HTMLElement, sim: Simulateur): Valeurs {
  const v: Valeurs = {};
  for (const c of sim.champs) {
    const el = champ(racine, sim, c.id);
    if (!el) continue;
    if (c.type === 'nombre') v[c.id] = lireNombre(el.value);
    else if (c.type === 'case') v[c.id] = (el as HTMLInputElement).checked;
    else v[c.id] = el.value;
  }
  return v;
}

function ecrire(racine: HTMLElement, sim: Simulateur, v: Valeurs): void {
  for (const c of sim.champs) {
    const el = champ(racine, sim, c.id);
    const x = v[c.id];
    if (!el || x === undefined) continue;
    if (c.type === 'case') (el as HTMLInputElement).checked = x === true;
    else if (c.type === 'nombre') el.value = nombre(Number(x), 0, 4).replace(/\u202f/g, ' ');
    else el.value = String(x);
  }
}

async function copier(texte: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texte);
    return true;
  } catch {
    return false;
  }
}

document.querySelectorAll<HTMLElement>('[data-simulateur]').forEach((racine) => {
  const sim = simulateurParId(racine.dataset.simulateur ?? '');
  if (!sim) return;
  const sortie = racine.querySelector<HTMLElement>('[data-sim-resultat]');
  const blocErreurs = racine.querySelector<HTMLElement>('[data-sim-erreurs]');
  const listeErreurs = racine.querySelector<HTMLElement>('[data-sim-liste-erreurs]');
  const annonce = racine.querySelector<HTMLElement>('[data-sim-annonce]');
  const statut = racine.querySelector<HTMLElement>('[data-sim-statut]');
  let minuterie: number | undefined;
  let minuterieAnnonce: number | undefined;

  const calculer = (majAdresse: boolean) => {
    const v = lire(racine, sim);
    const { erreurs, resultat } = executer(sim, v);
    for (const c of sim.champs) {
      const el = champ(racine, sim, c.id);
      const message = racine.querySelector<HTMLElement>(`#${CSS.escape(`${sim.id}-${c.id}-erreur`)}`);
      const erreur = erreurs.find((e) => e.champ === c.id);
      if (el) {
        if (erreur) el.setAttribute('aria-invalid', 'true');
        else el.removeAttribute('aria-invalid');
      }
      if (message) {
        message.textContent = erreur?.message ?? '';
        message.hidden = !erreur;
      }
    }
    if (blocErreurs && listeErreurs) {
      blocErreurs.hidden = erreurs.length === 0;
      listeErreurs.replaceChildren(
        ...erreurs.map((e) => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = `#${sim.id}-${e.champ}`;
          const libelle = sim.champs.find((c) => c.id === e.champ)?.libelle ?? e.champ;
          a.textContent = `${libelle} : ${e.message}`;
          li.appendChild(a);
          return li;
        }),
      );
    }
    if (sortie) {
      sortie.hidden = !resultat;
      if (resultat) sortie.innerHTML = rendreResultat(resultat);
    }
    window.clearTimeout(minuterieAnnonce);
    minuterieAnnonce = window.setTimeout(() => {
      if (!annonce) return;
      annonce.textContent = resultat
        ? `Résultats mis à jour. ${resultat.synthese.map((s) => `${s.libelle} : ${s.valeur}`).join('. ')}.`
        : `${erreurs.length} champ${erreurs.length > 1 ? 's' : ''} à corriger.`;
    }, 900);
    if (majAdresse) {
      const params = versParametres(sim, v);
      const requete = params.toString();
      const adresse = `${window.location.pathname}${requete ? `?${requete}` : ''}${window.location.hash}`;
      window.history.replaceState(null, '', adresse);
    }
  };

  racine.querySelector('[data-sim-formulaire]')?.addEventListener('input', () => {
    window.clearTimeout(minuterie);
    minuterie = window.setTimeout(() => calculer(true), 120);
  });
  racine.querySelector('[data-sim-formulaire]')?.addEventListener('change', () => calculer(true));
  racine.querySelector('[data-sim-defaut]')?.addEventListener('click', () => {
    ecrire(racine, sim, valeursParDefaut(sim));
    calculer(true);
    if (statut) statut.textContent = 'Valeurs de l’exemple rétablies.';
  });
  racine.querySelector('[data-sim-partager]')?.addEventListener('click', async () => {
    calculer(true);
    const ok = await copier(window.location.href);
    if (statut)
      statut.textContent = ok
        ? 'Lien copié : il contient vos paramètres.'
        : `Copiez l’adresse de la page : ${window.location.href}`;
  });

  const params = new URLSearchParams(window.location.search);
  if ([...params.keys()].some((k) => sim.champs.some((c) => c.id === k))) {
    ecrire(racine, sim, depuisParametres(sim, params));
    calculer(false);
  }
});

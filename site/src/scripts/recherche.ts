/**
 * Page Recherche : la réponse de la formation à la question (outil « Poser une question »), puis les
 * pages qui contiennent les mots cherchés (index statique Pagefind généré au build).
 */
import { chercherPages, extrait } from './pagefind';
import { chargerIndex, construireReponse } from './reponses';

const formulaire = document.querySelector<HTMLFormElement>('[data-recherche]');
const champ = document.querySelector<HTMLInputElement>('#recherche-page');
const etat = document.querySelector<HTMLElement>('#recherche-etat');
const liste = document.querySelector<HTMLOListElement>('[data-resultats]');
const blocReponse = document.querySelector<HTMLElement>('[data-reponse-recherche]');
const contenuReponse = blocReponse?.querySelector<HTMLElement>('[data-reponse-contenu]');
let jeton = 0;

/** Réponse de la formation, au-dessus des résultats (masquée si la formation ne répond pas). */
async function repondre(q: string, mon: number): Promise<void> {
  if (!blocReponse || !contenuReponse) return;
  try {
    const index = await chargerIndex();
    if (mon !== jeton) return;
    const { element, trouvee } = construireReponse(index, q, { niveau: 3, lienRecherche: false });
    contenuReponse.replaceChildren(element);
    blocReponse.hidden = !trouvee;
  } catch {
    blocReponse.hidden = true;
  }
}

async function chercher(q: string): Promise<void> {
  const mon = ++jeton;
  if (!liste || !etat) return;
  if (!q.trim()) {
    liste.replaceChildren();
    etat.textContent = '';
    if (blocReponse) blocReponse.hidden = true;
    return;
  }
  void repondre(q, mon);
  const trouve = await chercherPages(q, 30);
  if (mon !== jeton) return;
  if (!trouve) {
    etat.textContent = 'Index de recherche indisponible (il est créé par « npm run build »).';
    return;
  }
  etat.textContent =
    trouve.total === 0
      ? `Aucune page ne contient « ${q} ».`
      : `${trouve.total} page${trouve.total > 1 ? 's' : ''} pour « ${q} »${trouve.total > 30 ? ' (30 premières affichées)' : ''}.`;
  liste.replaceChildren(
    ...trouve.pages.map((d) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = d.url;
      a.textContent = d.meta.title ?? d.url;
      const p = document.createElement('p');
      p.appendChild(extrait(d.excerpt));
      li.append(a, p);
      return li;
    }),
  );
}

let minuterie: number | undefined;
champ?.addEventListener('input', () => {
  window.clearTimeout(minuterie);
  minuterie = window.setTimeout(() => {
    const q = champ.value;
    const url = new URL(window.location.href);
    if (q) url.searchParams.set('q', q);
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
    void chercher(q);
  }, 180);
});
formulaire?.addEventListener('submit', (e) => {
  e.preventDefault();
  void chercher(champ?.value ?? '');
});
const initiale = new URLSearchParams(window.location.search).get('q') ?? '';
if (champ) {
  champ.value = initiale;
  if (initiale) void chercher(initiale);
  champ.focus();
}

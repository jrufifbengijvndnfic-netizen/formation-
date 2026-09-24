/** Recherche plein texte : index statique Pagefind généré au build (npm run build). */
interface ResultatPagefind {
  url: string;
  excerpt: string;
  meta: { title?: string };
}
interface Pagefind {
  options(o: Record<string, unknown>): Promise<void>;
  search(q: string): Promise<{ results: { data(): Promise<ResultatPagefind> }[] } | null>;
}

const formulaire = document.querySelector<HTMLFormElement>('[data-recherche]');
const champ = document.querySelector<HTMLInputElement>('#recherche-page');
const etat = document.querySelector<HTMLElement>('#recherche-etat');
const liste = document.querySelector<HTMLOListElement>('[data-resultats]');
const base = (import.meta.env.BASE_URL ?? '/').replace(/\/?$/, '/');
let pagefind: Pagefind | null = null;
let jeton = 0;

async function charger(): Promise<Pagefind | null> {
  if (pagefind) return pagefind;
  try {
    const chemin = `${base}pagefind/pagefind.js`;
    pagefind = (await import(/* @vite-ignore */ chemin)) as Pagefind;
    await pagefind.options({ excerptLength: 28, baseUrl: base });
    return pagefind;
  } catch {
    if (etat) etat.textContent = 'Index de recherche indisponible (il est créé par « npm run build »).';
    return null;
  }
}

/** Nettoie un extrait Pagefind : seul <mark> est conservé. */
function extrait(html: string): DocumentFragment {
  const gabarit = document.createElement('template');
  gabarit.innerHTML = html;
  const sortie = document.createDocumentFragment();
  gabarit.content.childNodes.forEach((n) => {
    if (n.nodeType === Node.ELEMENT_NODE && (n as Element).tagName === 'MARK') {
      const m = document.createElement('mark');
      m.textContent = n.textContent;
      sortie.appendChild(m);
    } else {
      sortie.appendChild(document.createTextNode(n.textContent ?? ''));
    }
  });
  return sortie;
}

async function chercher(q: string): Promise<void> {
  const mon = ++jeton;
  if (!liste || !etat) return;
  if (!q.trim()) {
    liste.replaceChildren();
    etat.textContent = '';
    return;
  }
  const pf = await charger();
  if (!pf || mon !== jeton) return;
  const recherche = await pf.search(q);
  if (!recherche || mon !== jeton) return;
  const donnees = await Promise.all(recherche.results.slice(0, 30).map((r) => r.data()));
  if (mon !== jeton) return;
  etat.textContent =
    recherche.results.length === 0
      ? `Aucun résultat pour « ${q} ».`
      : `${recherche.results.length} résultat${recherche.results.length > 1 ? 's' : ''} pour « ${q} »${recherche.results.length > 30 ? ' (30 premiers affichés)' : ''}.`;
  liste.replaceChildren(
    ...donnees.map((d) => {
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

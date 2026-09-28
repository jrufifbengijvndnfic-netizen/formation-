/**
 * Recherche plein texte Pagefind (index statique généré au build par « npm run build »), partagée par
 * la page Recherche et le panneau « Une question ? ».
 */
export interface ResultatPage {
  url: string;
  excerpt: string;
  meta: { title?: string };
}
interface Pagefind {
  options(o: Record<string, unknown>): Promise<void>;
  search(q: string): Promise<{ results: { data(): Promise<ResultatPage> }[] } | null>;
}

const base = (import.meta.env.BASE_URL ?? '/').replace(/\/?$/, '/');
let pagefind: Promise<Pagefind | null> | null = null;

/** Pagefind chargé une seule fois ; null s'il est indisponible (site non construit). */
export function chargerPagefind(): Promise<Pagefind | null> {
  pagefind ??= (async () => {
    try {
      const pf = (await import(/* @vite-ignore */ `${base}pagefind/pagefind.js`)) as Pagefind;
      await pf.options({ excerptLength: 28, baseUrl: base });
      return pf;
    } catch {
      return null;
    }
  })();
  return pagefind;
}

/** Pages qui contiennent les mots cherchés : nombre total et les `limite` premières. */
export async function chercherPages(
  q: string,
  limite: number,
): Promise<{ total: number; pages: ResultatPage[] } | null> {
  const pf = await chargerPagefind();
  if (!pf) return null;
  const recherche = await pf.search(q);
  if (!recherche) return { total: 0, pages: [] };
  const pages = await Promise.all(recherche.results.slice(0, limite).map((r) => r.data()));
  return { total: recherche.results.length, pages };
}

/** Extrait Pagefind nettoyé : seul <mark> est conservé, le reste devient du texte. */
export function extrait(html: string): DocumentFragment {
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

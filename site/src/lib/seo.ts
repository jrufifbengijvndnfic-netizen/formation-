/**
 * Référencement (cahier des charges SEO) : marque, titres, descriptions, données structurées.
 * Fonctions pures, testées dans seo.test.ts.
 */

/** Nom de marque (suffixe des titres, fournisseur de la formation). */
export const MARQUE = 'Formation Locatif';

/** Domaine de production : utilisé si SITE_URL n'est pas défini au build (voir astro.config.mjs). */
export const SITE_PAR_DEFAUT = 'https://formation-locatif.com';

/**
 * Offres commerciales (prix TTC en euros), affichées sur la page Tarifs, l'accueil et les pages de
 * niveau, et déclarées dans les données structurées. `lienAchat` : adresse de la page de paiement
 * (plateforme de vente) ; tant qu'elle est absente, le site indique « achat bientôt disponible ».
 */
export interface Offre {
  id: 'niveau-1' | 'niveau-2' | 'niveau-3' | 'pack';
  prix: number;
  niveaux: (1 | 2 | 3)[];
  lienAchat?: string | undefined;
}
export const DEVISE = 'EUR';
export const OFFRES: Offre[] = [
  { id: 'niveau-1', prix: 97, niveaux: [1] },
  { id: 'niveau-2', prix: 197, niveaux: [2] },
  { id: 'niveau-3', prix: 297, niveaux: [3] },
  { id: 'pack', prix: 447, niveaux: [1, 2, 3] },
];
export const offreNiveau = (n: 1 | 2 | 3): Offre => OFFRES.find((o) => o.id === `niveau-${n}`) as Offre;
export const offrePack = (): Offre => OFFRES.find((o) => o.id === 'pack') as Offre;
/** Prix des niveaux achetés séparément, pour afficher l'économie du pack. */
export const prixSepares = (): number => OFFRES.filter((o) => o.id !== 'pack').reduce((t, o) => t + o.prix, 0);
/** « 97 € » avec espace insécable. */
export const prixTexte = (prix: number): string => `${prix}\u00a0€`;

/** Offre au format schema.org ; « InStock » seulement quand l'achat est réellement possible. */
export function offreJsonLd(o: Offre, url: string): Record<string, unknown> {
  return {
    '@type': 'Offer',
    category: 'Paid',
    price: String(o.prix),
    priceCurrency: DEVISE,
    url: o.lienAchat ?? url,
    ...(o.lienAchat ? { availability: 'https://schema.org/InStock' } : {}),
  };
}

/** Image de partage (Open Graph, Twitter), 1200 × 630, dans public/images/. */
export const IMAGE_PARTAGE = {
  chemin: 'images/og-image.webp',
  largeur: 1200,
  hauteur: 630,
  type: 'image/webp',
} as const;

export const LONGUEUR_DESCRIPTION = 160;

export interface EtapeFilAriane {
  libelle: string;
  href?: string | undefined;
}

/** « Titre | Formation Locatif ». */
export const titreDePage = (titre: string): string => `${titre} | ${MARQUE}`;

/** Raccourcit au dernier mot entier pour tenir en `max` caractères, points de suspension compris. */
export function raccourcir(texte: string, max = LONGUEUR_DESCRIPTION): string {
  const propre = texte.replace(/\s+/g, ' ').trim();
  if (propre.length <= max) return propre;
  const coupe = propre.slice(0, max - 1);
  const espace = coupe.lastIndexOf(' ');
  return `${(espace > max / 2 ? coupe.slice(0, espace) : coupe).replace(/[\s,;:.–—-]+$/, '')}…`;
}

/** Adresse absolue d'un chemin du site (qui contient déjà la base éventuelle). */
export const adresseAbsolue = (chemin: string, site: URL | string): string => new URL(chemin, site).href;

/** Fil d'Ariane au format schema.org `BreadcrumbList` (§ 5.3) ; la dernière étape n'a pas d'adresse. */
export function filArianeJsonLd(etapes: EtapeFilAriane[], site: URL | string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: etapes.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: e.libelle,
      ...(e.href && i < etapes.length - 1 ? { item: adresseAbsolue(e.href, site) } : {}),
    })),
  };
}

/**
 * Redirections permanentes (301), chemins relatifs à la base du site. Servies par _redirects
 * (Netlify, Cloudflare Pages) et vercel.json ; une page de repli (meta refresh) existe aussi.
 */
export const REDIRECTIONS: Record<string, string> = { 'annexe/c/': 'glossaire/' };

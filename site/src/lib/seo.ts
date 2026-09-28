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
 * (plateforme de vente) ; tant qu'elle est absente, le site indique « paiement en ligne bientôt ouvert ».
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

/** Longueur au-delà de laquelle Google tronque souvent le titre (audit de conversion, C4). */
export const LONGUEUR_TITRE = 70;

/** Longueur maximale d'un titre sans suffixe ; au-delà, il est abrégé. */
export const LONGUEUR_TITRE_MAX = 72;

/**
 * « Titre | Formation Locatif », ou le titre seul si le suffixe le ferait dépasser 70 caractères.
 * Un titre trop long (titre de module de la formation) est abrégé dans la balise <title> seulement,
 * avant son sous-titre (« : » ou parenthèse) : le titre affiché dans la page reste intact.
 */
export function titreDePage(titre: string): string {
  const complet = `${titre} | ${MARQUE}`;
  if (complet.length <= LONGUEUR_TITRE) return complet;
  if (titre.length <= LONGUEUR_TITRE_MAX) return titre;
  const coupe = titre.search(/ : | \(/);
  return coupe > 20 && coupe <= LONGUEUR_TITRE_MAX
    ? titreDePage(titre.slice(0, coupe))
    : raccourcir(titre, LONGUEUR_TITRE_MAX);
}

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
 * Redirections permanentes (301), chemins relatifs à la base du site. Servies par le .htaccess
 * (Hostinger) ; une page de repli (meta refresh) existe aussi.
 */
export const REDIRECTIONS: Record<string, string> = {};

/**
 * Codes de vérification des outils pour webmasters (balise meta). À copier depuis Google Search
 * Console (propriété « préfixe d'URL », méthode « balise HTML ») et Bing Webmaster Tools. Vide = pas
 * de balise. La vérification par enregistrement DNS (propriété « domaine ») n'a pas besoin de code ici.
 */
export const VERIFICATIONS = {
  google: '',
  bing: '',
};

/**
 * Site web et éditeur (schema.org `WebSite` et `Organization`) : aident Google à afficher le nom du
 * site (« Formation Locatif ») au-dessus du lien dans les résultats.
 */
export function siteWebJsonLd(site: URL | string): Record<string, unknown> {
  const url = adresseAbsolue('/', site);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}#site`,
        name: MARQUE,
        alternateName: [new URL(url).hostname, 'L’immobilier locatif en France'],
        url,
        inLanguage: 'fr',
        publisher: { '@id': `${url}#editeur` },
      },
      {
        '@type': 'Organization',
        '@id': `${url}#editeur`,
        name: MARQUE,
        url,
        logo: adresseAbsolue('favicon.svg', site),
      },
    ],
  };
}

/**
 * robots.txt : toutes les pages sont explorables (les pages en noindex aussi : Google doit pouvoir
 * lire leur balise noindex pour les écarter) ; seul l'index du moteur de recherche interne
 * (fichiers de Pagefind, qui ne sont pas des pages) est interdit. Le site n'a pas de zone privée.
 */
export function robots(prefixe: string, adresseSitemap: string): string {
  return ['User-agent: *', 'Allow: /', `Disallow: ${prefixe}pagefind/`, '', `Sitemap: ${adresseSitemap}`, ''].join(
    '\n',
  );
}

/**
 * Fichier .htaccess pour l'hébergement Apache ou LiteSpeed (Hostinger) : HTTPS et domaine sans
 * « www » imposés (301), /sitemap_index.xml redirigé vers /sitemap.xml, page 404, redirections,
 * en-têtes de sécurité et cache.
 */
export function htaccess(domaine: string, prefixe: string, redirections: Record<string, string>): string {
  const echapper = (t: string) => t.replace(/[.]/g, '\\.');
  return [
    '# Généré au build (site/src/lib/seo.ts) : ne pas modifier à la main.',
    'Options -Indexes',
    '# La page du site passe avant les fichiers par défaut de l’hébergeur (default.php, index.php).',
    'DirectoryIndex index.html',
    `ErrorDocument 404 ${prefixe}404.html`,
    '',
    'RewriteEngine On',
    '# HTTPS imposé (sans boucle derrière un CDN qui transmet X-Forwarded-Proto)',
    'RewriteCond %{HTTPS} off',
    'RewriteCond %{HTTP:X-Forwarded-Proto} !https',
    `RewriteRule ^(.*)$ https://${domaine}/$1 [R=301,L]`,
    '# Domaine principal sans « www » : une seule adresse pour Google',
    `RewriteCond %{HTTP_HOST} ^www\\.${echapper(domaine)}$ [NC]`,
    `RewriteRule ^(.*)$ https://${domaine}/$1 [R=301,L]`,
    '# Nom de plan du site cherché par les robots habitués à WordPress (Yoast, Rank Math)',
    `RewriteRule ^${echapper(prefixe.slice(1))}sitemap_index\\.xml$ ${prefixe}sitemap.xml [R=301,L]`,
    ...Object.entries(redirections).map(
      ([de, vers]) =>
        `RewriteRule ^${echapper(prefixe.slice(1) + de.replace(/\/$/, ''))}/?$ ${prefixe}${vers} [R=301,L]`,
    ),
    '',
    '<IfModule mod_headers.c>',
    '  Header always set Strict-Transport-Security "max-age=31536000"',
    '  Header always set X-Content-Type-Options "nosniff"',
    '  Header always set Referrer-Policy "strict-origin-when-cross-origin"',
    '  Header always set X-Frame-Options "DENY"',
    '  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"',
    '  <FilesMatch "\\.(js|css|woff2|webp|svg)$">',
    '    Header set Cache-Control "public, max-age=31536000, immutable"',
    '  </FilesMatch>',
    '  <FilesMatch "\\.(html|xml|txt|json)$">',
    '    Header set Cache-Control "no-cache"',
    '  </FilesMatch>',
    '</IfModule>',
    '',
    '<IfModule mod_deflate.c>',
    '  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/xml application/json text/javascript application/javascript image/svg+xml',
    '</IfModule>',
    '',
  ].join('\n');
}

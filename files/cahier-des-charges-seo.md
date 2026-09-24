# ARCHITECTURE SEO & CODE : CAHIER DES CHARGES DÉVELOPPEUR ULTIME (FORMATION-LOCATIF.FR)

**A L'ATTENTION DE L'IA DE DÉVELOPPEMENT / DÉVELOPPEUR FULL-STACK**
Ce document est le cahier des charges technique STRICT ET DÉFINITIF pour la création du site `formation-locatif.fr`. L'objectif est d'atteindre un score Lighthouse de 100/100 (Performance, Accessibilité, SEO) et de structurer le code pour une indexation sémantique parfaite par les moteurs de recherche. **Aucune déviation n'est autorisée sur les critères suivants.**

## 1. STACK TECHNIQUE RECOMMANDÉE (Pour SEO & Performance maximaux)

*   **Front-end / Générateur de site statique (SSG) ou Server-Side Rendering (SSR) obligatoire :** Next.js (React), Nuxt.js (Vue), Astro (fortement recommandé pour sa gestion du JavaScript) ou un CMS Headless couplé à un front-end statique.
    *   *Interdiction stricte* des Single Page Applications (SPA) pures fonctionnant uniquement côté client (Client-Side Rendering).
*   **CSS :** Tailwind CSS pour minimiser le poids du CSS inutilisé (PurgeCSS natif).
*   **Hébergement :** Vercel, Netlify ou Cloudflare Pages (pour un déploiement CDN global et des temps de réponse TTFB < 50ms).

## 2. EXIGENCES DE STRUCTURE HTML & BALISAGE SÉMANTIQUE

### 2.1 Hiérarchie des titres (Heading Tags)
*   Une seule balise `<h1>` par page, contenant le mot-clé principal et placée dans le flux principal (`<main>`).
*   Imbrication logique stricte des balises `<h2>`, `<h3>`, `<h4>` sans sauter de niveaux.

### 2.2 Balises Sémantiques HTML5
Le layout ne doit pas reposer uniquement sur des `<div>`. Utilisation obligatoire de :
`<header>`, `<nav>` (avec attributs ARIA), `<main>`, `<article>`, `<section>`, `<footer>`, `<aside>`.

### 2.3 Optimisation des Images
*   Format obligatoire : `WebP` ou `AVIF` (avec fallback).
*   Attributs `width` et `height` obligatoires pour éviter le Cumulative Layout Shift (CLS).
*   Attribut `loading="lazy"` obligatoire sur toutes les images sous la ligne de flottaison. L'image Hero (LCP) doit avoir `loading="eager"` ou `priority`.
*   Attribut `alt` descriptif systématique.

### 2.4 Liens Internes & Externes
*   Ancres explicites et sémantiques (ex: pas de "Cliquez ici").
*   Liens externes : `rel="noopener noreferrer"`.
*   Liens d'affiliation/partenariats : `rel="sponsored"`.

### 2.5 Fil d'Ariane (Breadcrumbs)
*   **Visuel (UI) :** Un fil d'ariane cliquable doit être visible sur toutes les pages profondes (ex: *Accueil > Fiscalité > LMNP ou SCI*).
*   **Code HTML :** Doit être encapsulé dans une balise `<nav aria-label="Breadcrumb">` structurée avec une liste `<ol>` et `<li>`.

## 3. PERFORMANCES EXTRÊMES (CORE WEB VITALS) & RESSOURCES

Le code généré doit garantir la validation des seuils Core Web Vitals de Google :
*   **LCP (Largest Contentful Paint) :** Inférieur à 2.5 secondes.
*   **CLS (Cumulative Layout Shift) :** Strictement inférieur à 0.1 (Aucun saut visuel toléré).
*   **INP (Interaction to Next Paint) :** Inférieur à 200 ms.

### 3.1 Gestion critique des Polices et Scripts tiers
*   **Polices (Fonts) :** Interdiction totale de charger des polices depuis des serveurs externes (comme `fonts.googleapis.com`). Toutes les polices doivent être **hébergées localement (Self-hosted)**, préchargées (`<link rel="preload" as="font">`), et utiliser la propriété CSS `font-display: swap;`.
*   **Scripts Tiers (Analytics, Pixels) :** L'exécution des scripts de suivi (Google Analytics, Pixel Facebook, Tag Manager) doit être **différée**. Ils ne doivent pas bloquer le thread principal (Main Thread) et doivent idéalement se déclencher à l'interaction de l'utilisateur (scroll, clic) ou via des attributs `defer` ou `async`.

## 4. SEO TECHNIQUE & METADATA (Zone `<head>`)

Chaque page générée doit comporter ces balises meta dynamiques :

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <title>TITRE DYNAMIQUE OPTIMISÉ | Formation Locatif</title>
  <meta name="description" content="DESCRIPTION DYNAMIQUE (150-160 caractères max).">
  
  <!-- Canonical URL (CRITIQUE) -->
  <link rel="canonical" href="https://formation-locatif.fr/URL-DYNAMIQUE">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="TITRE DYNAMIQUE">
  <meta property="og:description" content="DESCRIPTION DYNAMIQUE">
  <meta property="og:url" content="https://formation-locatif.fr/URL-DYNAMIQUE">
  <meta property="og:image" content="https://formation-locatif.fr/images/og-image.webp">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
</head>
```

## 5. DONNÉES STRUCTURÉES (SCHEMA.ORG JSON-LD)

L'injection de JSON-LD dans le `<head>` est obligatoire pour cibler les Rich Snippets Google.

### 5.1 Page de Vente (La Formation) - Type `Course`
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Formation Investissement Immobilier Locatif",
  "description": "Le programme complet pour devenir rentier immobilier en partant de zéro. Stratégie, financement, fiscalité.",
  "provider": {
    "@type": "Organization",
    "name": "Formation Locatif",
    "sameAs": "https://formation-locatif.fr"
  },
  "offers": {
    "@type": "Offer",
    "price": "997",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

### 5.2 Articles de Blog - Type `FAQPage`
Pour apparaître en Position Zéro :
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Faut-il investir en nom propre (LMNP) ou en SCI ?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Le statut LMNP est idéal pour un premier investissement..."
    }
  }]
}
</script>
```

### 5.3 Fil d'Ariane (Toutes les pages enfants) - Type `BreadcrumbList`
Obligatoire pour l'affichage de la hiérarchie dans la SERP Google :
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Accueil",
    "item": "https://formation-locatif.fr/"
  },{
    "@type": "ListItem",
    "position": 2,
    "name": "Fiscalité",
    "item": "https://formation-locatif.fr/fiscalite/"
  },{
    "@type": "ListItem",
    "position": 3,
    "name": "LMNP ou SCI"
  }]
}
</script>
```

## 6. ARCHITECTURE DES ROUTES (ROUTING)
*   Les URL doivent être propres (Clean URLs), descriptives, en minuscules et sans caractères spéciaux (`/blog/calculer-rentabilite-locative`).
*   Règle stricte : Le code doit pouvoir gérer des redirections serveur `301 Moved Permanently` en cas de modification d'URL.

## 7. SÉCURITÉ ET FICHIERS SYSTÈMES
*   **SSL (HTTPS)** forcé systématiquement.
*   **`robots.txt`** et **`sitemap.xml`** doivent être auto-générés à chaque build (SSG) contenant uniquement les URL canoniques indexables.

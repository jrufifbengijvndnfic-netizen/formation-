/**
 * Guides pratiques (rubrique /guides/) : articles d'actualité ou de méthode, écrits pour répondre aux
 * recherches réelles des bailleurs (audit/ETUDE-RECHERCHES-2026-11.md, audit/SEARCH-CONSOLE-2026-11.md).
 * Le texte de chaque guide est un fichier Markdown de files/guides/, rendu comme la formation
 * (encadrés `> [!TYPE]`, tableaux, liens « module 2.1 »). Les faits viennent de la formation ou de
 * sources citées en fin de guide ; un texte en projet est présenté comme un projet.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { lien } from './navigation';
import { MARQUE, adresseAbsolue } from './seo';
import { DOSSIER_PACK } from './source';

export interface Guide {
  slug: string;
  /** Balise <title> (sans la marque), 72 caractères au plus. */
  titre: string;
  h1: string;
  /** Méta-description, de 110 à 160 caractères. */
  description: string;
  /** Surtitre court affiché au-dessus du titre. */
  sur: string;
  /** Dates ISO (AAAA-MM-JJ) de publication et de dernière mise à jour. */
  publie: string;
  misAJour: string;
  /** Modules de la formation qui approfondissent le sujet. */
  modules: string[];
  /** Simulateurs gratuits liés (identifiants de src/lib/simulateurs.ts). */
  simulateurs: string[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'lmnp-budget-2027-amortissement',
    titre: 'LMNP et budget 2027 : le plafonnement de l’amortissement expliqué',
    h1: 'LMNP et budget 2027 : le plafonnement de l’amortissement expliqué',
    description:
      'Projet de loi de finances pour 2027 : amortissement LMNP plafonné à 2,5 % et 7 000 € par an ? Ce qui est voté, ce qui ne l’est pas, et que faire en attendant.',
    sur: 'Fiscalité · location meublée',
    publie: '2026-11-01',
    misAJour: '2026-11-01',
    modules: ['2.7', '2.8', '3.5'],
    simulateurs: ['micro-bic-ou-reel', 'micro-foncier-ou-reel', 'plus-value'],
  },
  {
    slug: 'encadrement-des-loyers-24-novembre-2026',
    titre: 'Encadrement des loyers après le 24 novembre 2026 : ce qui change',
    h1: 'Encadrement des loyers après le 24 novembre 2026 : ce qui change pour les bailleurs',
    description:
      'Fin ou prolongation de l’encadrement des loyers au 24 novembre 2026, vote du Sénat, blocage à la relocation jusqu’en 2027 : les règles selon votre ville.',
    sur: 'Loyer · réglementation',
    publie: '2026-11-01',
    misAJour: '2026-11-01',
    modules: ['2.1', '1.6', '1.8'],
    simulateurs: ['encadrement-loyers', 'loyer-relocation', 'revision-loyer'],
  },
];

export const DOSSIER_GUIDES = path.resolve(DOSSIER_PACK, '..', 'guides');

export const cheminGuide = (g: Guide): string => `guides/${g.slug}/`;

export function texteGuide(g: Guide): string {
  const fichier = path.join(DOSSIER_GUIDES, `${g.slug}.md`);
  if (!existsSync(fichier)) throw new Error(`Guide introuvable : ${fichier}`);
  return readFileSync(fichier, 'utf8');
}

/** Guides qui renvoient vers un simulateur (encart « Guide sur ce sujet » de la page du simulateur). */
export const guidesDuSimulateur = (id: string): Guide[] => GUIDES.filter((g) => g.simulateurs.includes(id));

/** Données structurées Article d'un guide (éditeur : la marque ; auteur : à compléter avec une personne). */
export function guideJsonLd(g: Guide, site: URL | string): Record<string, unknown> {
  const url = adresseAbsolue(lien(cheminGuide(g)), site);
  const editeur = { '@type': 'Organization', name: MARQUE, url: adresseAbsolue(lien(), site) };
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: g.h1,
    description: g.description,
    url,
    mainEntityOfPage: url,
    inLanguage: 'fr',
    datePublished: g.publie,
    dateModified: g.misAJour,
    author: editeur,
    publisher: editeur,
    isAccessibleForFree: true,
  };
}

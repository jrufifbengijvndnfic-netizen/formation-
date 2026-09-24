/**
 * Données structurées schema.org `Course` de la formation (cahier des charges SEO, § 5.1), partagées
 * par l'accueil de la formation, la page de vente et la page Tarifs.
 */
import { formation, niveaux, organisation, titreSite } from './donnees';
import { texteBrut } from './render';
import { MARQUE, OFFRES, adresseAbsolue, offreJsonLd, offreNiveau, offrePack } from './seo';

/**
 * Durée indicative du tableau 0.2 (« 10 à 12 heures », « 15 à 18 heures », « 20 heures et plus ») :
 * somme des minimums.
 */
export const heuresMinimum = niveaux.reduce(
  (s, n) => s + Number(/\d+/.exec(organisation[`Niveau ${n.niveau}`]?.duree ?? '')?.[0] ?? 0),
  0,
);

/**
 * @param site adresse du site
 * @param cheminOffre page qui présente l'offre (adresse des `Offer`)
 * @param toutesLesOffres vrai : les quatre offres au premier niveau ; faux : pack en tête, niveaux en parties
 */
export function coursJsonLd(site: URL | string, cheminOffre: string, toutesLesOffres = false): Record<string, unknown> {
  const urlOffre = adresseAbsolue(cheminOffre, site);
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: titreSite,
    description: texteBrut(formation.accroche),
    inLanguage: 'fr',
    dateModified: formation.aJourAu,
    educationalLevel: 'Débutant à confirmé',
    provider: { '@type': 'Organization', name: MARQUE, sameAs: adresseAbsolue('/', site) },
    offers: toutesLesOffres ? OFFRES.map((o) => offreJsonLd(o, urlOffre)) : offreJsonLd(offrePack(), urlOffre),
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Online', courseWorkload: `PT${heuresMinimum}H` },
    hasPart: niveaux.map((n) => ({
      '@type': 'Course',
      name: `Niveau ${n.niveau} — ${n.titreCourt}`,
      description: texteBrut(n.intro),
      inLanguage: 'fr',
      offers: offreJsonLd(offreNiveau(n.niveau), urlOffre),
    })),
  };
}

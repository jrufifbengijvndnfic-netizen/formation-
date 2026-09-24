import { describe, expect, it } from 'vitest';
import { filArianeJsonLd, raccourcir, titreDePage } from './seo';

describe('titres et descriptions', () => {
  it('suffixe la marque', () => {
    expect(titreDePage('Module 1.1 — Le paysage')).toBe('Module 1.1 — Le paysage | Formation Locatif');
  });

  it('omet la marque quand le titre dépasserait 70 caractères', () => {
    const long = 'Simulateur rentabilité locative gratuit : brute, nette et cash-flow';
    expect(titreDePage(long)).toBe(long);
    expect(titreDePage('x'.repeat(50))).toHaveLength(70);
  });

  it('abrège un titre de plus de 72 caractères avant son sous-titre', () => {
    expect(titreDePage('Module 2.1 — Le loyer en profondeur : révision, relocation, encadrement, réévaluation')).toBe(
      'Module 2.1 — Le loyer en profondeur | Formation Locatif',
    );
    expect(titreDePage('Module 1.5 — Les diagnostics obligatoires (dossier de diagnostic technique)')).toBe(
      'Module 1.5 — Les diagnostics obligatoires | Formation Locatif',
    );
    expect(titreDePage('mot '.repeat(30)).length).toBeLessThanOrEqual(72);
  });

  it('laisse intacte une description courte', () => {
    expect(raccourcir('Base amortissable et déduction annuelle.')).toBe('Base amortissable et déduction annuelle.');
  });

  it('coupe au dernier mot entier, 160 caractères au plus', () => {
    const long =
      "Comprendre le fonctionnement d'une copropriété, voter utilement, maîtriser les charges et les obligations nouvelles (plan pluriannuel de travaux, DPE collectif, fonds de travaux).";
    const court = raccourcir(long);
    expect(court.length).toBeLessThanOrEqual(160);
    expect(court.endsWith('…')).toBe(true);
    expect(long.startsWith(court.slice(0, -1))).toBe(true);
    expect(court).not.toMatch(/[\s,]…$/);
  });
});

describe('fil d’Ariane (schema.org)', () => {
  it('produit des adresses absolues, sans adresse pour la page courante', () => {
    const j = filArianeJsonLd(
      [{ libelle: 'Accueil', href: '/' }, { libelle: 'Niveau 1', href: '/niveau-1/' }, { libelle: 'Module 1.1' }],
      'https://formation-locatif.com',
    );
    expect(j).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://formation-locatif.com/' },
        { '@type': 'ListItem', position: 2, name: 'Niveau 1', item: 'https://formation-locatif.com/niveau-1/' },
        { '@type': 'ListItem', position: 3, name: 'Module 1.1' },
      ],
    });
  });

  it('respecte un sous-dossier (BASE_PATH)', () => {
    const j = filArianeJsonLd(
      [{ libelle: 'Accueil', href: '/formation-/' }, { libelle: 'Glossaire' }],
      'https://x.github.io',
    );
    expect((j.itemListElement as { item?: string }[])[0]?.item).toBe('https://x.github.io/formation-/');
  });
});

describe('redirections 301', () => {
  it('vercel.json reprend chaque redirection de REDIRECTIONS', async () => {
    const { readFileSync } = await import('node:fs');
    const { REDIRECTIONS } = await import('./seo');
    const config = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8')) as {
      redirects: { source: string; destination: string; statusCode: number }[];
    };
    for (const [de, vers] of Object.entries(REDIRECTIONS)) {
      expect(config.redirects).toContainEqual({ source: `/${de}`, destination: `/${vers}`, statusCode: 301 });
    }
  });
});

describe('offres', () => {
  it('niveau 1 sous 100 €, niveau 3 autour de 300 €, pack moins cher que les niveaux séparés', async () => {
    const { offreNiveau, offrePack, prixSepares, offreJsonLd } = await import('./seo');
    expect(offreNiveau(1).prix).toBeLessThan(100);
    expect(offreNiveau(3).prix).toBeGreaterThanOrEqual(280);
    expect(offreNiveau(3).prix).toBeLessThanOrEqual(320);
    expect(offrePack().prix).toBeLessThan(prixSepares());
    // Pas de disponibilité annoncée tant qu'aucun lien d'achat n'existe.
    expect(offreJsonLd(offreNiveau(1), 'https://x/tarifs/')).not.toHaveProperty('availability');
  });
});

describe('déploiement Vercel', () => {
  it('le vercel.json de la racine du dépôt reprend redirections et en-têtes de site/vercel.json', async () => {
    const { readFileSync } = await import('node:fs');
    const lire = (chemin: string) => JSON.parse(readFileSync(new URL(chemin, import.meta.url), 'utf8'));
    const racine = lire('../../../vercel.json');
    const site = lire('../../vercel.json');
    expect(racine.redirects).toEqual(site.redirects);
    expect(racine.headers).toEqual(site.headers);
    expect(racine.outputDirectory).toBe('site/dist');
  });
});

import { describe, expect, it } from 'vitest';
import { filArianeJsonLd, raccourcir, titreDePage } from './seo';

describe('titres et descriptions', () => {
  it('suffixe la marque', () => {
    expect(titreDePage('Module 1.1 — Le paysage')).toBe('Module 1.1 — Le paysage | Formation Locatif');
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
      'https://formation-locatif.fr',
    );
    expect(j).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://formation-locatif.fr/' },
        { '@type': 'ListItem', position: 2, name: 'Niveau 1', item: 'https://formation-locatif.fr/niveau-1/' },
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

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

describe('robots.txt', () => {
  it('autorise les pages, interdit seulement l’index de recherche et déclare le plan du site', async () => {
    const { robots } = await import('./seo');
    const r = robots('/', 'https://formation-locatif.com/sitemap.xml');
    expect(r).toContain('User-agent: *\nAllow: /');
    expect(r).toContain('Disallow: /pagefind/');
    expect(r).toContain('Sitemap: https://formation-locatif.com/sitemap.xml');
    expect(r.match(/^Disallow:/gm)).toHaveLength(1);
  });
});

describe('hébergement Apache ou LiteSpeed (.htaccess)', () => {
  it('redirige /sitemap_index.xml vers /sitemap.xml en 301', async () => {
    const { htaccess } = await import('./seo');
    expect(htaccess('formation-locatif.com', '/', {})).toContain(
      'RewriteRule ^sitemap_index\\.xml$ /sitemap.xml [R=301,L]',
    );
  });

  it('impose HTTPS et le domaine sans www, et sert la page 404', async () => {
    const { htaccess } = await import('./seo');
    const h = htaccess('formation-locatif.com', '/', { 'annexe/c/': 'glossaire/' });
    expect(h).toContain('RewriteCond %{HTTP_HOST} ^www\\.formation-locatif\\.com$ [NC]');
    expect(h).toContain('RewriteRule ^(.*)$ https://formation-locatif.com/$1 [R=301,L]');
    expect(h).toContain('ErrorDocument 404 /404.html');
    expect(h).toContain('DirectoryIndex index.html');
    expect(h).toContain('RewriteCond %{HTTP:X-Forwarded-Proto} !https');
    expect(h).toContain('RewriteRule ^annexe/c/?$ /glossaire/ [R=301,L]');
  });
});

describe('nom du site pour Google', () => {
  it('déclare WebSite et Organization', async () => {
    const { siteWebJsonLd } = await import('./seo');
    const j = JSON.stringify(siteWebJsonLd('https://formation-locatif.com'));
    expect(j).toContain('"@type":"WebSite"');
    expect(j).toContain('"name":"Formation Locatif"');
    expect(j).toContain('formation-locatif.com');
  });
});

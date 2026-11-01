import { describe, expect, it } from 'vitest';
import { moduleParNumero } from './donnees';
import { GUIDES, guideJsonLd, guidesDuSimulateur, texteGuide } from './guides';
import { simulateurParId } from './simulateurs';

describe('guides pratiques', () => {
  it('ont des adresses uniques', () => {
    expect(new Set(GUIDES.map((g) => g.slug)).size).toBe(GUIDES.length);
  });

  it.each(GUIDES.map((g) => [g.slug, g] as const))('%s : référencement, liens et texte', (_slug, g) => {
    expect(g.titre.length).toBeLessThanOrEqual(72);
    expect(g.description.length).toBeGreaterThanOrEqual(110);
    expect(g.description.length).toBeLessThanOrEqual(160);
    expect(g.misAJour >= g.publie).toBe(true);
    for (const n of g.modules) expect(moduleParNumero(n), `module ${n}`).toBeDefined();
    for (const id of g.simulateurs) expect(simulateurParId(id), `simulateur ${id}`).toBeDefined();
    const md = texteGuide(g);
    // Le titre de la page est le H1 : le texte commence à H2 et se termine par ses sources.
    expect(md).not.toMatch(/^# /m);
    expect(md).toMatch(/^## En bref/);
    expect(md).toMatch(/^## Sources/m);
    // Liens internes écrits depuis la racine, vers des outils qui existent.
    for (const [, id] of md.matchAll(/\]\(\/simulateurs\/([^/)]+)\/\)/g)) {
      expect(simulateurParId(id as string), `lien vers ${id}`).toBeDefined();
    }
  });

  it('sont reliés depuis les simulateurs qu’ils citent', () => {
    for (const g of GUIDES) for (const id of g.simulateurs) expect(guidesDuSimulateur(id)).toContain(g);
  });

  it('déclarent un article gratuit, daté', () => {
    const g = GUIDES[0]!;
    expect(guideJsonLd(g, 'https://formation-locatif.com')).toMatchObject({
      '@type': 'Article',
      url: `https://formation-locatif.com/guides/${g.slug}/`,
      datePublished: g.publie,
      dateModified: g.misAJour,
      isAccessibleForFree: true,
    });
  });
});

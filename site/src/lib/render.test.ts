import { describe, expect, it } from 'vitest';
import { ChercheurGlossaire } from './glossaire-match';
import { glossaire, modules, parseFormation, tousLesElements } from './parse-formation';
import { nouveauContexte, rendreMarkdown, texteBrut } from './render';
import { lireSource } from './source';
import type { Element } from './types';

const f = parseFormation(lireSource());
const existants = new Set(modules(f).map((m) => m.numero as string));
const chercheur = new ChercheurGlossaire(glossaire(f));

/** Rend un élément comme sur sa page : introduction puis rubriques, contexte partagé. */
function rendreElement(e: Element, options = {}) {
  const ctx = nouveauContexte({ modulesExistants: existants, moduleCourant: e.numero, ...options });
  const html = [e.intro, ...e.rubriques.filter((r) => !r.quiz && !r.lettre).map((r) => r.markdown)]
    .map((md) => rendreMarkdown(md, ctx))
    .join('\n');
  return { html, ctx };
}

describe('rendu du Markdown', () => {
  it('numérote les encadrés comme le parseur, dans tous les éléments', () => {
    for (const e of tousLesElements(f)) {
      const { html } = rendreElement(e);
      const types = [...html.matchAll(/id="encadre-(\d+)" role="note" aria-labelledby="encadre-\d+-etiquette" data-type="([A-Z_]+)"/g)].map(
        (m) => [Number(m[1]), m[2]],
      );
      expect(types, e.id).toEqual(e.encadres.map((x) => [x.rang, x.type]));
    }
  });

  it('conserve les retours à la ligne des exemples chiffrés', () => {
    const m = modules(f).find((x) => x.numero === '1.12') as Element;
    const { html } = rendreElement(m);
    expect(html).toContain('Rentabilité brute : 6 240 / 118 000 = 5,29 %.<br>');
    expect(html).toContain('<p class="encadre__etiquette" id="encadre-1-etiquette">Exemple chiffré</p>');
  });

  it('rend les tableaux dans un conteneur défilant accessible avec des en-têtes scope="col"', () => {
    const { html } = rendreElement(modules(f).find((x) => x.numero === '1.1') as Element);
    expect(html).toMatch(/<div class="tableau[^"]*" role="region" tabindex="0" aria-label="Tableau : Acteur, Rôle"><table>/);
    expect(html).toContain('<th scope="col">Acteur</th>');
  });

  it('rend les formules en chasse fixe', () => {
    const annexeE = tousLesElements(f).find((e) => e.numero === 'E') as Element;
    const { html } = rendreElement(annexeE, { ancresFormules: true });
    expect(html.match(/<pre class="formule" tabindex="0">/g)).toHaveLength(14);
    expect(html).toContain('<p id="e1" class="formule-titre"><strong>E1. Rentabilités.</strong></p>');
    expect(html).toContain('id="e14"');
  });

  it('lie les mentions de modules et d’annexes, sauf vers la page elle-même', () => {
    const m = modules(f).find((x) => x.numero === '2.8') as Element;
    const { html } = rendreElement(m);
    expect(html).toContain('<a href="/module/3-4/">3.4</a>');
    const soi = rendreMarkdown('Voir le module 2.8 et le module 2.6.', nouveauContexte({ modulesExistants: existants, moduleCourant: '2.8' }));
    expect(soi).toBe('<p>Voir le module 2.8 et le module <a href="/module/2-6/">2.6</a>.</p>');
    const liste = rendreMarkdown('Voir modules 2.6, 2.7, 3.4 et 3.5.', nouveauContexte({ modulesExistants: existants }));
    expect(liste.match(/<a href="\/module\//g)).toHaveLength(4);
    expect(rendreMarkdown("l'annexe H et l'annexe C", nouveauContexte())).toBe(
      '<p>l\'annexe <a href="/annexe/h/">H</a> et l\'annexe <a href="/glossaire/">C</a></p>',
    );
    expect(rendreMarkdown("L'annexe a été revue.", nouveauContexte())).not.toContain('<a');
    expect(rendreMarkdown('module 9.9', nouveauContexte({ modulesExistants: existants }))).not.toContain('<a');
  });

  it('lie la colonne « Module » du tableau des nouveautés', () => {
    const s05 = tousLesElements(f).find((e) => e.numero === '0.5') as Element;
    const { html } = rendreElement(s05, { colonneModule: true });
    expect(html).toContain('<td class="num"><a href="/module/2-6/">Module 2.6</a>, <a href="/module/2-7/">Module 2.7</a></td>');
  });

  it('transforme les cas d’examen en titres et les corrigés en blocs repliables', () => {
    const examens = tousLesElements(f).filter((e) => e.type === 'examen');
    const compte = examens.map((e) => {
      const { html } = rendreElement(e, { corriges: true });
      return [
        (html.match(/<details class="corrige">/g) ?? []).length,
        (html.match(/<h2 id="cas-\d+-[^"]+" class="cas-titre">/g) ?? []).length,
      ];
    });
    expect(compte).toEqual([
      [3, 3],
      [4, 4],
      [5, 5],
    ]);
  });

  it('ajoute une infobulle à la première occurrence de chaque terme seulement', () => {
    const m = modules(f).find((x) => x.numero === '1.12') as Element;
    const { html } = rendreElement(m, { glossaire: chercheur });
    const ids = [...html.matchAll(/aria-describedby="(def-[^"]+)"/g)].map((x) => x[1]);
    expect(ids.length).toBeGreaterThan(3);
    expect(new Set(ids).size).toBe(ids.length);
    expect(html).toContain('id="def-cash-flow"');
    expect(html).not.toMatch(/<(h2|th|strong)[^>]*>[^<]*<span class="terme">/);
  });

  it('ne place aucune infobulle dans les tableaux, titres, formules et liens', () => {
    for (const m of modules(f)) {
      const { html } = rendreElement(m, { glossaire: chercheur });
      for (const bloc of html.match(/<table>[\s\S]*?<\/table>|<pre[\s\S]*?<\/pre>|<a [^>]*>[\s\S]*?<\/a>/g) ?? []) {
        expect(bloc, m.numero).not.toContain('class="terme"');
      }
    }
  });

  it('donne des noms uniques aux tableaux d’une même page', () => {
    const annexeA = tousLesElements(f).find((e) => e.numero === 'A') as Element;
    const { html } = rendreElement(annexeA);
    const libelles = [...html.matchAll(/aria-label="(Tableau[^"]*)"/g)].map((x) => x[1]);
    expect(new Set(libelles).size).toBe(libelles.length);
  });

  it('extrait un texte brut sans balisage', () => {
    expect(texteBrut('**Gras** et `code` | ok')).toBe('Gras et code | ok');
  });
});

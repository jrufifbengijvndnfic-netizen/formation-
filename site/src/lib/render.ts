/**
 * Rendu HTML du Markdown de la formation (au build) : remark + GFM, puis extensions maison :
 * - encadrés `> [!TYPE]` → bloc « tampon » étiqueté, retours à la ligne conservés ;
 * - blocs de code sans langage → formules en chasse fixe ;
 * - tableaux → conteneur défilant accessible, en-têtes `scope`, chiffres alignés ;
 * - « module 2.1 », « annexe H » → liens internes ;
 * - paragraphes « Corrigé. » des examens → corrigés repliables ;
 * - première occurrence des termes du glossaire → infobulle accessible (modules uniquement).
 *
 * Le texte n'est jamais réécrit : seules des balises sont ajoutées autour.
 */
import type { Element as HElement, ElementContent, Root as HRoot, Text as HText } from 'hast';
import { h } from 'hastscript';
import type { Blockquote, Paragraph, PhrasingContent, Root as MRoot, Text as MText } from 'mdast';
import { toString as texteMdast } from 'mdast-util-to-string';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { SKIP, visit } from 'unist-util-visit';
import { visitParents } from 'unist-util-visit-parents';
import { espacesInsecables } from './format';
import type { ChercheurGlossaire } from './glossaire-match';
import { cheminAnnexe, cheminModule, lien } from './navigation';
import { slugify } from './slug';
import { LIBELLES_ENCADRE, TYPES_ENCADRE, type TypeEncadre } from './types';

/** État partagé entre les morceaux (intro, rubriques) d'une même page. */
export interface ContexteRendu {
  /** Numérotation des encadrés, identique au rang calculé par le parseur. */
  encadres: number;
  /** Préfixe des ancres d'encadrés quand plusieurs éléments partagent une page (section 0). */
  prefixeEncadres?: string;
  /** Libellés des tableaux déjà utilisés (pour des régions aux noms uniques). */
  tableaux: Map<string, number>;
  /** Termes du glossaire déjà signalés sur la page (seule la première occurrence l'est). */
  termesVus: Set<string>;
  /** Chercheur de termes ; absent = pas d'infobulles. */
  glossaire?: ChercheurGlossaire | undefined;
  /** Numéro du module affiché (pas de lien vers lui-même). */
  moduleCourant?: string | undefined;
  /** Numéros de modules existants (seuls ceux-ci deviennent des liens). */
  modulesExistants: Set<string>;
  /** Transforme les paragraphes « Corrigé. » en blocs repliables. */
  corriges?: boolean;
  /** Ajoute des ancres « #e1 »… aux intitulés des formules de l'annexe E. */
  ancresFormules?: boolean;
  /** Lie les numéros de la colonne « Module » du tableau des nouveautés (section 0.5). */
  colonneModule?: boolean;
}

export function nouveauContexte(options: Partial<ContexteRendu> = {}): ContexteRendu {
  return {
    encadres: 0,
    tableaux: new Map(),
    termesVus: new Set(),
    modulesExistants: new Set(),
    ...options,
  };
}

const classeEncadre = (t: TypeEncadre) => `encadre--${t.toLowerCase().replace('_', '-')}`;

// ---------------------------------------------------------------------------
// Plugins remark (arbre Markdown)
// ---------------------------------------------------------------------------

/** Retire `n` caractères au début d'un paragraphe, à travers ses nœuds texte. */
function retirerDebut(p: Paragraph, n: number): void {
  let reste = n;
  while (reste > 0 && p.children.length) {
    const premier = p.children[0] as PhrasingContent;
    if (premier.type !== 'text') break;
    if (premier.value.length <= reste) {
      reste -= premier.value.length;
      p.children.shift();
    } else {
      premier.value = premier.value.slice(reste);
      reste = 0;
    }
  }
}

/** Remplace les retours à la ligne des nœuds texte par des sauts de ligne (<br>). */
function conserverRetours(noeud: Blockquote): void {
  visit(noeud, 'text', (t: MText, index, parent) => {
    if (!parent || index === undefined || !t.value.includes('\n')) return;
    const morceaux = t.value.split('\n');
    const remplacement: PhrasingContent[] = [];
    morceaux.forEach((m, i) => {
      if (i > 0) remplacement.push({ type: 'break' });
      if (m) remplacement.push({ type: 'text', value: m });
    });
    (parent.children as PhrasingContent[]).splice(index, 1, ...remplacement);
    return [SKIP, index + remplacement.length];
  });
}

function remarkEncadres(ctx: ContexteRendu) {
  return (arbre: MRoot) => {
    visit(arbre, 'blockquote', (noeud: Blockquote) => {
      const premier = noeud.children[0];
      if (!premier || premier.type !== 'paragraph') return;
      const m = /^\[!([A-Z_]+)\][ \t]*\n?/.exec(texteMdast(premier));
      if (!m || !(TYPES_ENCADRE as readonly string[]).includes(m[1] as string)) return;
      const type = m[1] as TypeEncadre;
      retirerDebut(premier, m[0].length);
      if (!premier.children.length) noeud.children.shift();
      conserverRetours(noeud);
      ctx.encadres += 1;
      const id = `${ctx.prefixeEncadres ?? ''}encadre-${ctx.encadres}`;
      noeud.data = {
        hName: 'div',
        hProperties: {
          className: ['encadre', classeEncadre(type)],
          id,
          role: 'note',
          'aria-labelledby': `${id}-etiquette`,
          'data-type': type,
        },
      };
      noeud.children.unshift({
        type: 'paragraph',
        data: { hProperties: { className: ['encadre__etiquette'], id: `${id}-etiquette` } },
        children: [{ type: 'text', value: LIBELLES_ENCADRE[type] }],
      });
    });
  };
}

/**
 * Examens : l'intitulé en gras de chaque cas (« **Cas 1 — …** ») devient un titre de niveau 2
 * (texte inchangé) et le paragraphe « Corrigé. » un bloc repliable.
 */
function remarkCorriges(ctx: ContexteRendu) {
  return (arbre: MRoot) => {
    if (!ctx.corriges) return;
    visit(arbre, 'paragraph', (p: Paragraph, index, parent) => {
      if (!parent || index === undefined) return;
      const premier = p.children[0];
      if (premier?.type === 'strong' && /^Cas \d+ — /.test(texteMdast(premier))) {
        const titre = texteMdast(premier);
        p.children.shift();
        const suite = p.children[0];
        if (suite?.type === 'text') suite.value = suite.value.replace(/^\s+/, '');
        parent.children.splice(index, 0, {
          type: 'heading',
          depth: 2,
          data: { hProperties: { id: slugify(titre), className: ['cas-titre'] } },
          children: [{ type: 'text', value: titre }],
        });
        return [SKIP, index + 2];
      }
      if (!texteMdast(p).startsWith('Corrigé.')) return;
      parent.children.splice(index, 1, {
        type: 'blockquote',
        data: { hName: 'details', hProperties: { className: ['corrige'] } },
        children: [
          {
            type: 'paragraph',
            data: { hName: 'summary', hProperties: { className: ['corrige__bouton'] } },
            children: [{ type: 'text', value: 'Voir le corrigé' }],
          },
          p,
        ],
      });
      return [SKIP, index + 1];
    });
  };
}

function remarkAncresFormules(ctx: ContexteRendu) {
  return (arbre: MRoot) => {
    if (!ctx.ancresFormules) return;
    visit(arbre, 'paragraph', (p: Paragraph) => {
      const premier = p.children[0];
      if (premier?.type !== 'strong') return;
      const m = /^(E\d+)\./.exec(texteMdast(premier));
      if (m) p.data = { hProperties: { id: (m[1] as string).toLowerCase(), className: ['formule-titre'] } };
    });
  };
}

// Lettre d'annexe en capitale uniquement : « l'annexe a été… » ne doit pas devenir un lien.
const RE_REFERENCES =
  /(?<![\p{L}])([Mm]odules?|[Aa]nnexes?)\s+((?:\d\.\d{1,2}|[A-I])(?:(?:,\s*|\s+et\s+|\s+ou\s+)(?:\d\.\d{1,2}|[A-I]))*)(?![\p{L}\p{N}])/gu;

/** Transforme « module 2.1 », « modules 2.6, 2.7 et 3.4 », « annexe H » en liens internes. */
function remarkLiensInternes(ctx: ContexteRendu) {
  return (arbre: MRoot) => {
    visitParents(arbre, 'text', (t: MText, ancetres) => {
      if (ancetres.some((a) => a.type === 'link' || a.type === 'heading' || a.type === 'linkReference')) return;
      const parent = ancetres.at(-1) as { children: PhrasingContent[] } | undefined;
      if (!parent) return;
      const nouveaux: PhrasingContent[] = [];
      let curseur = 0;
      RE_REFERENCES.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = RE_REFERENCES.exec(t.value))) {
        const annexe = (m[1] as string).toLowerCase().startsWith('annexe');
        const liste = m[2] as string;
        const debutListe = m.index + m[0].length - liste.length;
        const re = annexe ? /[A-I]/g : /\d\.\d{1,2}/g;
        let r: RegExpExecArray | null;
        while ((r = re.exec(liste))) {
          const cible = r[0];
          const valide = annexe ? true : ctx.modulesExistants.has(cible) && cible !== ctx.moduleCourant;
          if (!valide) continue;
          const pos = debutListe + r.index;
          if (pos > curseur) nouveaux.push({ type: 'text', value: t.value.slice(curseur, pos) });
          nouveaux.push({
            type: 'link',
            url: lien(annexe ? cheminAnnexe(cible) : cheminModule(cible)),
            children: [{ type: 'text', value: cible }],
          });
          curseur = pos + cible.length;
        }
      }
      if (!nouveaux.length) return;
      if (curseur < t.value.length) nouveaux.push({ type: 'text', value: t.value.slice(curseur) });
      const index = parent.children.indexOf(t);
      parent.children.splice(index, 1, ...nouveaux);
      return [SKIP, index + nouveaux.length];
    });
  };
}

// ---------------------------------------------------------------------------
// Plugins rehype (arbre HTML)
// ---------------------------------------------------------------------------

function texteHast(n: ElementContent | HRoot): string {
  if (n.type === 'text') return n.value;
  if ('children' in n) return (n.children as ElementContent[]).map(texteHast).join('');
  return '';
}

const RE_NOMBRE = /^[−-]?\+?[\d  .,]+\s?(?:€|%|€ HC|m²|ans?|mois)?(?:\s\(.*\))?$/;

function rehypeTableaux(ctx: ContexteRendu) {
  return (arbre: HRoot) => {
    visit(arbre, 'element', (el: HElement, index, parent) => {
      if (el.tagName !== 'table' || !parent || index === undefined) return;
      const thead = el.children.find((c): c is HElement => c.type === 'element' && c.tagName === 'thead');
      const tbody = el.children.find((c): c is HElement => c.type === 'element' && c.tagName === 'tbody');
      const entetes: string[] = [];
      let colonneModule = -1;
      visit(thead ?? el, 'element', (c: HElement) => {
        if (c.tagName === 'th') {
          c.properties = { ...c.properties, scope: 'col' };
          const texte = texteHast(c).trim();
          if (ctx.colonneModule && texte === 'Module') colonneModule = entetes.length;
          entetes.push(texte);
        }
      });
      let lignes = 0;
      if (tbody) {
        for (const tr of tbody.children) {
          if (tr.type !== 'element' || tr.tagName !== 'tr') continue;
          lignes++;
          tr.children
            .filter((c): c is HElement => c.type === 'element' && c.tagName === 'td')
            .forEach((td, col) => {
              const texte = texteHast(td).trim();
              if (texte && RE_NOMBRE.test(texte)) {
                td.properties = { ...td.properties, className: ['num'] };
              }
              if (col === colonneModule) lierNumerosModules(td, ctx);
            });
        }
      }
      let libelle = `Tableau : ${entetes.filter(Boolean).join(', ')}`;
      const deja = ctx.tableaux.get(libelle) ?? 0;
      ctx.tableaux.set(libelle, deja + 1);
      if (deja) libelle += ` (${deja + 1})`;
      const classes = ['tableau'];
      if (lignes > 12) classes.push('tableau--long');
      if (entetes.length > 4) classes.push('tableau--large');
      parent.children[index] = h(
        'div',
        { className: classes, role: 'region', tabIndex: 0, ariaLabel: libelle },
        [el],
      );
      return SKIP;
    });
  };
}

/** Dans la colonne « Module » du tableau des nouveautés : « 2.6, 2.7 » → deux liens. */
function lierNumerosModules(td: HElement, ctx: ContexteRendu): void {
  const texte = texteHast(td);
  const enfants: ElementContent[] = [];
  let curseur = 0;
  for (const m of texte.matchAll(/\d\.\d{1,2}/g)) {
    if (!ctx.modulesExistants.has(m[0])) continue;
    if (m.index > curseur) enfants.push({ type: 'text', value: texte.slice(curseur, m.index) });
    enfants.push(h('a', { href: lien(cheminModule(m[0])) }, `Module ${m[0]}`));
    curseur = m.index + m[0].length;
  }
  if (!enfants.length) return;
  if (curseur < texte.length) enfants.push({ type: 'text', value: texte.slice(curseur) });
  td.children = enfants;
}

function rehypeFormules() {
  return (arbre: HRoot) => {
    visit(arbre, 'element', (el: HElement) => {
      if (el.tagName !== 'pre') return;
      const code = el.children.find((c): c is HElement => c.type === 'element' && c.tagName === 'code');
      const classes = (code?.properties?.className as string[] | undefined) ?? [];
      if (classes.some((c) => String(c).startsWith('language-'))) return;
      el.properties = { ...el.properties, className: ['formule'], tabIndex: 0 };
    });
  };
}

const BALISES_SANS_INFOBULLE = new Set([
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'table',
  'pre',
  'code',
  'a',
  'button',
  'strong',
  'b',
  'summary',
]);

function rehypeInfobulles(ctx: ContexteRendu) {
  return (arbre: HRoot) => {
    const chercheur = ctx.glossaire;
    if (!chercheur) return;
    visitParents(arbre, 'text', (t: HText, ancetres) => {
      const bloque = ancetres.some(
        (a) =>
          a.type === 'element' &&
          (BALISES_SANS_INFOBULLE.has(a.tagName) ||
            ((a.properties?.className as string[] | undefined) ?? []).some(
              (c) => c === 'encadre__etiquette' || c === 'terme',
            )),
      );
      if (bloque) return;
      const occurrences = chercheur.chercher(t.value).filter((o) => !ctx.termesVus.has(o.id));
      if (!occurrences.length) return;
      const nouveaux: ElementContent[] = [];
      let curseur = 0;
      for (const o of occurrences) {
        if (ctx.termesVus.has(o.id)) continue;
        ctx.termesVus.add(o.id);
        const terme = chercheur.termes.get(o.id);
        if (!terme) continue;
        if (o.debut > curseur) nouveaux.push({ type: 'text', value: t.value.slice(curseur, o.debut) });
        const idBulle = `def-${o.id}`;
        nouveaux.push(
          h('span', { className: ['terme'] }, [
            h(
              'a',
              {
                href: lien(`glossaire/#${o.id}`),
                className: ['terme__declencheur'],
                ariaDescribedBy: idBulle,
                dataTerme: o.id,
              },
              t.value.slice(o.debut, o.fin),
            ),
            h('span', { className: ['terme__bulle'], role: 'tooltip', id: idBulle, dataPagefindIgnore: '' }, [
              h('span', { className: ['terme__nom'] }, terme.terme),
              ` : ${terme.definition}`,
            ]),
          ]),
        );
        curseur = o.fin;
      }
      if (curseur < t.value.length) nouveaux.push({ type: 'text', value: t.value.slice(curseur) });
      const parent = ancetres.at(-1) as HElement | HRoot;
      const index = parent.children.indexOf(t);
      parent.children.splice(index, 1, ...nouveaux);
      return [SKIP, index + nouveaux.length];
    });
  };
}

/** Espaces insécables françaises dans tous les textes (hors formules et code). */
function rehypeTypographie() {
  return (arbre: HRoot) => {
    visitParents(arbre, 'text', (t: HText, ancetres) => {
      if (ancetres.some((a) => a.type === 'element' && (a.tagName === 'pre' || a.tagName === 'code'))) return;
      t.value = espacesInsecables(t.value);
    });
  };
}

/** Liens externes : ouverture dans le même onglet, sans transmettre l'adresse de la page. */
function rehypeLiensExternes() {
  return (arbre: HRoot) => {
    visit(arbre, 'element', (el: HElement) => {
      const href = el.tagName === 'a' ? String(el.properties?.href ?? '') : '';
      if (/^https?:\/\//.test(href)) {
        el.properties = { ...el.properties, rel: ['noopener', 'noreferrer'], className: ['lien-externe'] };
      }
    });
  };
}

// ---------------------------------------------------------------------------
// Point d'entrée
// ---------------------------------------------------------------------------

export function rendreMarkdown(md: string, ctx: ContexteRendu = nouveauContexte()): string {
  if (!md.trim()) return '';
  const processeur = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkEncadres, ctx)
    .use(remarkCorriges, ctx)
    .use(remarkAncresFormules, ctx)
    .use(remarkLiensInternes, ctx)
    .use(remarkRehype)
    .use(rehypeTableaux, ctx)
    .use(rehypeFormules)
    .use(rehypeInfobulles, ctx)
    .use(rehypeTypographie)
    .use(rehypeLiensExternes)
    .use(rehypeStringify);
  return String(processeur.processSync(md));
}

/** Rendu d'une ligne de texte courte (élément de liste, cellule) sans paragraphe englobant. */
export function rendreEnLigne(md: string, ctx: ContexteRendu = nouveauContexte()): string {
  return rendreMarkdown(md, ctx)
    .replace(/^<p>/, '')
    .replace(/<\/p>\s*$/, '');
}

/** Texte brut (sans balisage Markdown) pour les descriptions et les extraits. */
export function texteBrut(md: string): string {
  const arbre = unified().use(remarkParse).use(remarkGfm).parse(md);
  return texteMdast(arbre).replace(/\s+/g, ' ').trim();
}

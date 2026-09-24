# L'immobilier locatif en France — formation et site web (édition septembre 2026)

- `files/` : le pack de contenu. **`files/formation-immobilier-locatif-2026/formation-immobilier-locatif-2026.md`
  est la source unique de vérité** ; les JSON et le site en sont dérivés.
- `site/` : le site statique (Astro + TypeScript). Commandes, architecture et procédure de mise à jour :
  [`site/README.md`](site/README.md).
- [`ETAT-DES-LIEUX.md`](ETAT-DES-LIEUX.md) : état du projet, décisions et prochaines étapes.

```bash
cd site
npm install
npm run dev      # développement
npm test         # tests
npm run build    # site dans site/dist/
```

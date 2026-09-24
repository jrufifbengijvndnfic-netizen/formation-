/** Page de module : « Marquer comme lu » et sommaire actif. */
import { marquerLu } from '../lib/progression';
import { maintenant, modifier, progression } from './stockage';

const bouton = document.querySelector<HTMLButtonElement>('[data-marquer-lu]');
const etat = document.querySelector<HTMLElement>('[data-etat-lecture]');

function afficher(): void {
  if (!bouton) return;
  const numero = bouton.dataset.marquerLu ?? '';
  const lu = progression().lus[numero];
  bouton.setAttribute('aria-pressed', String(Boolean(lu)));
  bouton.textContent = lu ? 'Module lu' : 'Marquer comme lu';
  if (etat) {
    etat.textContent = lu
      ? `Lu le ${new Date(lu).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}. Cliquez à nouveau pour annuler.`
      : '';
  }
}

bouton?.addEventListener('click', () => {
  const numero = bouton.dataset.marquerLu ?? '';
  const lu = !progression().lus[numero];
  const ok = modifier((p) => marquerLu(p, numero, lu, maintenant()));
  afficher();
  if (!ok && etat) etat.textContent += ' (non conservé après la visite : stockage du navigateur indisponible)';
});
afficher();
document.addEventListener('progression:modifiee', afficher);

// Sommaire : rubrique visible mise en évidence.
const liens = [...document.querySelectorAll<HTMLAnchorElement>('.sommaire a[href^="#"]')];
const cibles = liens
  .map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
  .filter((x): x is HTMLElement => Boolean(x));
if ('IntersectionObserver' in window && cibles.length) {
  const observateur = new IntersectionObserver(
    (entrees) => {
      const visible = entrees
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      liens.forEach((a) => a.setAttribute('aria-current', String(a.hash === `#${visible.target.id}`)));
    },
    { rootMargin: '-15% 0px -70% 0px' },
  );
  cibles.forEach((c) => observateur.observe(c));
}

/**
 * Modèles de lettres : formulaire généré depuis les champs […], aperçu en direct, copie,
 * téléchargement .txt et impression. Les saisies ne quittent jamais le navigateur.
 */
import { valeurChamp, type SegmentLettre } from '../lib/lettres';
import { echapper } from '../lib/format';
import { slugify } from '../lib/slug';

async function copier(texte: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texte);
    return true;
  } catch {
    const zone = document.createElement('textarea');
    zone.value = texte;
    zone.setAttribute('readonly', '');
    zone.style.position = 'fixed';
    zone.style.opacity = '0';
    document.body.appendChild(zone);
    zone.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    zone.remove();
    return ok;
  }
}

function imprimer(titre: string, texte: string): void {
  const cadre = document.createElement('iframe');
  cadre.setAttribute('aria-hidden', 'true');
  cadre.tabIndex = -1;
  cadre.style.cssText = 'position:fixed;width:0;height:0;border:0;right:0;bottom:0';
  cadre.srcdoc = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${echapper(titre)}</title><style>@page{margin:20mm}body{font:11pt/1.55 Georgia,serif;color:#000}pre{white-space:pre-wrap;font:inherit;margin:0}</style></head><body><pre>${echapper(texte)}</pre></body></html>`;
  cadre.addEventListener('load', () => {
    cadre.contentWindow?.focus();
    cadre.contentWindow?.print();
    setTimeout(() => cadre.remove(), 1000);
  });
  document.body.appendChild(cadre);
}

document.querySelectorAll<HTMLElement>('[data-lettre]').forEach((racine) => {
  const brut = racine.querySelector('[data-lettre-segments]')?.textContent ?? '[]';
  const segments = JSON.parse(brut) as SegmentLettre[];
  const apercu = racine.querySelector<HTMLElement>('[data-lettre-apercu]');
  const statut = racine.querySelector<HTMLElement>('[data-lettre-statut]');
  const champs = [...racine.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[data-champ]')];
  const titre = racine.dataset.titre ?? 'Lettre';

  const valeurs = (): Record<string, string> =>
    Object.fromEntries(champs.map((c) => [c.dataset.champ ?? '', c.value]));

  const texte = (): string => {
    const v = valeurs();
    return segments.map((s) => (s.type === 'texte' ? s.texte : valeurChamp(s.champ, v[s.champ.id]))).join('');
  };

  const rendre = () => {
    if (!apercu) return;
    const v = valeurs();
    const noeuds: Node[] = segments.map((s) => {
      if (s.type === 'texte') return document.createTextNode(s.texte);
      const saisie = (v[s.champ.id] ?? '').trim();
      if (saisie) return document.createTextNode(valeurChamp(s.champ, saisie));
      const mark = document.createElement('mark');
      mark.textContent = `[${s.champ.libelle}]`;
      return mark;
    });
    apercu.replaceChildren(...noeuds);
  };

  const annoncer = (message: string) => {
    if (statut) statut.textContent = message;
  };

  champs.forEach((c) => c.addEventListener('input', rendre));
  racine.querySelector('[data-lettre-copier]')?.addEventListener('click', async () => {
    annoncer((await copier(texte())) ? 'Texte copié dans le presse-papiers.' : 'Copie impossible : sélectionnez le texte de l’aperçu.');
  });
  racine.querySelector('[data-lettre-telecharger]')?.addEventListener('click', () => {
    const blob = new Blob(['﻿', texte().replace(/\n/g, '\r\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slugify(titre)}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    annoncer('Fichier texte téléchargé.');
  });
  racine.querySelector('[data-lettre-imprimer]')?.addEventListener('click', () => imprimer(titre, texte()));
  racine.querySelector('[data-lettre-effacer]')?.addEventListener('click', () => {
    champs.forEach((c) => (c.value = ''));
    rendre();
    annoncer('Champs effacés.');
  });
  rendre();
});

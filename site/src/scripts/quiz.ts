/**
 * Quiz interactifs : une question à la fois ou toutes, validation au clavier et à la souris,
 * bonne réponse et explication affichées, score final, meilleur score mémorisé, mélange
 * facultatif des propositions (la bonne réponse suit sa proposition).
 */
import { enregistrerQuiz, SEUIL_REUSSITE } from '../lib/progression';
import { maintenant, modifier, progression } from './stockage';

const LETTRES = ['A', 'B', 'C', 'D'];

function melanger<T>(liste: T[]): T[] {
  const t = [...liste];
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j] as T, t[i] as T];
  }
  return t;
}

const pct = (x: number) => `${Math.round(x * 100)} %`;

class Quiz {
  private readonly questions: HTMLLIElement[];
  private readonly reponses = new Map<string, boolean>();
  private mode: 'toutes' | 'une' = 'toutes';
  private courant = 0;

  constructor(
    private readonly racine: HTMLElement,
    private readonly module: string,
  ) {
    this.questions = [...racine.querySelectorAll<HTMLLIElement>('.quiz__question')];
    racine.querySelector<HTMLElement>('[data-quiz-outils]')?.removeAttribute('hidden');
    this.questions.forEach((q) => {
      q.querySelector<HTMLElement>('[data-quiz-solution]')?.setAttribute('hidden', '');
      q.querySelector<HTMLElement>('[data-quiz-boutons]')?.removeAttribute('hidden');
      q.querySelector('form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        this.valider(q);
      });
      q.querySelector('[data-quiz-suivante]')?.addEventListener('click', () => this.suivante());
    });
    racine.querySelectorAll<HTMLInputElement>(`input[name$="-mode"]`).forEach((r) =>
      r.addEventListener('change', () => {
        if (r.checked) this.changerMode(r.value === 'une' ? 'une' : 'toutes');
      }),
    );
    racine.querySelector('[data-quiz-melanger]')?.addEventListener('change', () => {
      if (this.reponses.size === 0) this.ordonner();
    });
    racine
      .querySelectorAll('[data-quiz-recommencer]')
      .forEach((b) => b.addEventListener('click', () => this.recommencer()));
    this.afficherMeilleur();
    document.addEventListener('progression:modifiee', () => this.afficherMeilleur());
  }

  private get melange(): boolean {
    return this.racine.querySelector<HTMLInputElement>('[data-quiz-melanger]')?.checked ?? false;
  }

  /** Réordonne les propositions (mélangées ou dans l'ordre A–D) et renumérote l'affichage. */
  private ordonner(): void {
    for (const q of this.questions) {
      const conteneur = q.querySelector<HTMLElement>('.quiz__options');
      if (!conteneur) continue;
      const options = [...conteneur.querySelectorAll<HTMLLabelElement>('.quiz__option')];
      // Sans mélange : ordre d'affichage fixé au build (data-rang).
      const ordre = this.melange ? melanger(options) : options.sort((a, b) => rang(a) - rang(b));
      ordre.forEach((o, i) => {
        conteneur.appendChild(o);
        const lettre = o.querySelector('[data-lettre-affichee]');
        if (lettre) lettre.textContent = LETTRES[i] ?? '';
      });
    }
  }

  private changerMode(mode: 'toutes' | 'une'): void {
    this.mode = mode;
    if (mode === 'une') {
      const premiereNonRepondue = this.questions.findIndex((q) => !this.reponses.has(q.dataset.question ?? ''));
      this.courant = premiereNonRepondue < 0 ? this.questions.length - 1 : premiereNonRepondue;
    }
    this.afficher();
  }

  private afficher(): void {
    this.questions.forEach((q, i) => {
      q.hidden = this.mode === 'une' && i !== this.courant;
      const suivante = q.querySelector<HTMLButtonElement>('[data-quiz-suivante]');
      if (suivante) {
        const repondue = this.reponses.has(q.dataset.question ?? '');
        suivante.hidden = this.mode !== 'une' || !repondue;
        suivante.textContent = i === this.questions.length - 1 ? 'Voir mon score' : 'Question suivante';
      }
    });
  }

  private valider(q: HTMLLIElement): void {
    const id = q.dataset.question ?? '';
    if (this.reponses.has(id)) return;
    const retour = q.querySelector<HTMLElement>('[data-quiz-retour]');
    const choisie = q.querySelector<HTMLInputElement>('input[type="radio"]:checked');
    if (!retour) return;
    if (!choisie) {
      retour.removeAttribute('data-resultat');
      retour.textContent = 'Choisissez une proposition avant de valider.';
      q.querySelector<HTMLInputElement>('input[type="radio"]')?.focus();
      return;
    }
    const bonne = q.dataset.reponse ?? '';
    const juste = choisie.value === bonne;
    this.reponses.set(id, juste);

    let libelleBonne = '';
    q.querySelectorAll<HTMLLabelElement>('.quiz__option').forEach((o) => {
      const input = o.querySelector('input');
      if (input) input.disabled = true;
      if (valeur(o) === bonne) {
        o.dataset.correcte = '';
        libelleBonne = `${o.querySelector('[data-lettre-affichee]')?.textContent ?? ''} — ${o.querySelector('.quiz__texte')?.textContent ?? ''}`;
      } else if (input?.checked) {
        o.dataset.fausse = '';
      }
    });
    const valider = q.querySelector<HTMLButtonElement>('[data-quiz-valider]');
    if (valider) {
      valider.setAttribute('aria-disabled', 'true');
      valider.textContent = 'Réponse validée';
    }
    const explication = q.querySelector('[data-explication]')?.textContent ?? '';
    retour.dataset.resultat = juste ? 'juste' : 'faux';
    retour.replaceChildren(
      paragraphe(juste ? 'Bonne réponse.' : 'Ce n’est pas la bonne réponse.', 'quiz__verdict'),
      paragraphe(`Réponse attendue : ${libelleBonne}.`),
      paragraphe(explication),
    );

    if (this.mode === 'une') {
      this.afficher();
      q.querySelector<HTMLButtonElement>('[data-quiz-suivante]')?.focus();
    } else if (this.reponses.size === this.questions.length) {
      this.bilan();
    }
  }

  private suivante(): void {
    if (this.courant < this.questions.length - 1) {
      this.courant += 1;
      this.afficher();
      this.questions[this.courant]?.querySelector<HTMLInputElement>('input[type="radio"]')?.focus();
    } else {
      this.bilan();
    }
  }

  private bilan(): void {
    const total = this.questions.length;
    const justes = [...this.reponses.values()].filter(Boolean).length;
    const score = total ? justes / total : 0;
    const enregistre = modifier((p) => enregistrerQuiz(p, this.module, score, maintenant()));
    const bilan = this.racine.querySelector<HTMLElement>('[data-quiz-bilan]');
    if (!bilan) return;
    const meilleur = progression().quiz[this.module]?.meilleur ?? score;
    bilan.querySelector('[data-quiz-score]')!.textContent = `Score : ${justes} sur ${total} (${pct(score)})`;
    bilan.querySelector('[data-quiz-commentaire]')!.textContent = [
      score >= SEUIL_REUSSITE
        ? 'Quiz réussi : le seuil de 70 % est atteint.'
        : 'Il faut 70 % de bonnes réponses pour réussir le quiz. Relisez la leçon puis recommencez.',
      `Meilleur score : ${pct(meilleur)}.`,
      enregistre ? '' : 'Votre navigateur ne permet pas de conserver ce score après la visite.',
    ]
      .filter(Boolean)
      .join(' ');
    bilan.hidden = false;
    bilan.focus();
  }

  private recommencer(): void {
    this.reponses.clear();
    this.courant = 0;
    this.questions.forEach((q) => {
      q.querySelectorAll<HTMLLabelElement>('.quiz__option').forEach((o) => {
        delete o.dataset.correcte;
        delete o.dataset.fausse;
        const input = o.querySelector('input');
        if (input) {
          input.disabled = false;
          input.checked = false;
        }
      });
      const valider = q.querySelector<HTMLButtonElement>('[data-quiz-valider]');
      if (valider) {
        valider.removeAttribute('aria-disabled');
        valider.textContent = 'Valider';
      }
      const retour = q.querySelector<HTMLElement>('[data-quiz-retour]');
      if (retour) {
        retour.replaceChildren();
        retour.removeAttribute('data-resultat');
      }
    });
    this.ordonner();
    const bilan = this.racine.querySelector<HTMLElement>('[data-quiz-bilan]');
    if (bilan) bilan.hidden = true;
    this.afficher();
    this.questions[0]?.querySelector<HTMLInputElement>('input[type="radio"]')?.focus();
  }

  private afficherMeilleur(): void {
    const el = this.racine.querySelector('[data-quiz-meilleur]');
    const etat = progression().quiz[this.module];
    if (!el) return;
    el.textContent = etat
      ? `Meilleur score : ${pct(etat.meilleur)}${etat.meilleur >= SEUIL_REUSSITE ? ' — quiz réussi' : ''}`
      : '';
  }
}

function valeur(option: HTMLLabelElement): string {
  return option.querySelector('input')?.value ?? '';
}

/** Position d'affichage fixée au build. */
function rang(option: HTMLLabelElement): number {
  return Number(option.dataset.rang ?? 0);
}

function paragraphe(texte: string, classe?: string): HTMLParagraphElement {
  const p = document.createElement('p');
  p.textContent = texte;
  if (classe) p.className = classe;
  return p;
}

document.querySelectorAll<HTMLElement>('[data-quiz]').forEach((q) => new Quiz(q, q.dataset.quiz ?? ''));

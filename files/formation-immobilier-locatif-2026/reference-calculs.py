"""Implémentation de référence des calculs de la formation « L'immobilier locatif en France » (édition septembre 2026).

Objectif : servir de modèle aux simulateurs du site (à réécrire en TypeScript) et fournir des jeux de tests.
Tous les exemples chiffrés de la formation sont vérifiés par les assertions en bas de fichier.
Lancer : python3 reference-calculs.py  (aucune dépendance externe)
Simplifications assumées : voir l'annexe E de la formation. Ces calculs sont pédagogiques et ne remplacent pas un conseil personnalisé.
"""

PS_FONCIER = 0.172   # revenus fonciers et plus-values immobilières
PS_LMNP = 0.186      # location meublée non professionnelle (LFSS 2026)


def mensualite(capital, taux_annuel, annees):
    t, n = taux_annuel / 12, annees * 12
    return capital * t / (1 - (1 + t) ** -n)


def capacite_emprunt(revenus_mensuels, loyers_mensuels, credits_existants, taux_annuel, annees, taux_assurance):
    m_max = 0.35 * (revenus_mensuels + 0.70 * loyers_mensuels) - credits_existants
    t, n = taux_annuel / 12, annees * 12
    facteur = t / (1 - (1 + t) ** -n) + taux_assurance / 12
    return m_max, m_max / facteur


def revision_irl(loyer, irl_nouveau, irl_ancien, classe_dpe="D"):
    return loyer if classe_dpe in ("F", "G") else loyer * irl_nouveau / irl_ancien


def penalite_depot(loyer_hc, mois_commences):
    return 0.10 * loyer_hc * mois_commences


def impot_micro_foncier(loyers, tmi):
    base = 0.70 * loyers
    return base * (tmi + PS_FONCIER)


def impot_reel_foncier(loyers, charges, nb_locaux, tmi):
    base = max(0.0, loyers - charges - 20 * nb_locaux)
    return base * (tmi + PS_FONCIER)


def deficit_foncier(loyers, interets, autres_charges, plafond=10_700):
    """Retourne (déficit imputable sur le revenu global, déficit reportable sur 10 ans)."""
    reste_loyers = loyers - interets
    if reste_loyers >= 0:
        deficit_hors_interets = max(0.0, autres_charges - reste_loyers)
        deficit_interets = 0.0
    else:
        deficit_hors_interets = autres_charges
        deficit_interets = -reste_loyers
    imputable = min(deficit_hors_interets, plafond)
    return imputable, deficit_hors_interets - imputable + deficit_interets


def impot_micro_bic(recettes, abattement, tmi):
    base = max(0.0, recettes - max(305, recettes * abattement))
    return base * (tmi + PS_LMNP)


def lmnp_reel(loyers, charges, amortissements_disponibles, tmi):
    """Retourne (base imposable, impôt, amortissements reportés). L'amortissement ne crée pas de déficit."""
    avant = loyers - charges
    utilise = min(amortissements_disponibles, max(0.0, avant))
    base = max(0.0, avant) - utilise
    return base, base * (tmi + PS_LMNP), amortissements_disponibles - utilise


def jeanbrun(prix_hors_frais, travaux=0.0, neuf=True, regime="intermediaire", plafond=8_000):
    taux = {True: {"intermediaire": 0.035, "social": 0.045, "tres_social": 0.055},
            False: {"intermediaire": 0.030, "social": 0.035, "tres_social": 0.040}}[neuf][regime]
    base = 0.80 * (prix_hors_frais + (0 if neuf else travaux))
    return min(base * taux, plafond), base


def surtaxe(p):
    paliers = [(50_000, 0, None), (60_000, 0.02, (60_000, 1 / 20)), (100_000, 0.02, None), (110_000, 0.03, (110_000, 1 / 10)),
               (150_000, 0.03, None), (160_000, 0.04, (160_000, 0.15)), (200_000, 0.04, None), (210_000, 0.05, (210_000, 0.20)),
               (250_000, 0.05, None), (260_000, 0.06, (260_000, 0.25))]
    if p <= 50_000:
        return 0.0
    for borne, taux, lissage in paliers[1:]:
        if p <= borne:
            return taux * p - ((lissage[0] - p) * lissage[1] if lissage else 0)
    return 0.06 * p


def plus_value(prix_achat, frais_reels, travaux_reels, prix_vente, annees, amortissements=0.0, frais_cession=0.0):
    acq = prix_achat + max(frais_reels, 0.075 * prix_achat)
    acq += max(travaux_reels, 0.15 * prix_achat) if annees >= 5 else travaux_reels
    acq -= amortissements
    pv = max(0.0, prix_vente - frais_cession - acq)
    d = annees
    ab_ir = 0 if d < 6 else (0.06 * (d - 5) if d <= 21 else 1.0)
    if d < 6:
        ab_ps = 0
    elif d <= 21:
        ab_ps = 0.0165 * (d - 5)
    elif d == 22:
        ab_ps = 0.0165 * 16 + 0.016
    elif d <= 30:
        ab_ps = 0.0165 * 16 + 0.016 + 0.09 * (d - 22)
    else:
        ab_ps = 1.0
    ir, ps = pv * (1 - ab_ir) * 0.19, pv * (1 - min(ab_ps, 1)) * PS_FONCIER
    st = surtaxe(pv * (1 - ab_ir))
    return {"plus_value": pv, "ir": ir, "ps": ps, "surtaxe": st, "total": ir + ps + st}


def ifi(patrimoine_net):
    if patrimoine_net <= 1_300_000:
        return 0.0
    tranches = [(800_000, 0), (1_300_000, 0.005), (2_570_000, 0.007), (5_000_000, 0.01), (10_000_000, 0.0125), (float("inf"), 0.015)]
    impot, bas = 0.0, 0
    for haut, taux in tranches:
        if patrimoine_net > bas:
            impot += (min(patrimoine_net, haut) - bas) * taux
        bas = haut
    if patrimoine_net < 1_400_000:
        impot -= 17_500 - 0.0125 * patrimoine_net
    return max(0.0, impot)


def dmto(prix, taux_departemental=0.045):
    return prix * taux_departemental * 1.0237 + prix * 0.012


def emoluments_ttc(prix):
    tr = [(6_500, 0.0387), (17_000, 0.01596), (60_000, 0.01064), (float("inf"), 0.00799)]
    ht, bas = 0.0, 0
    for haut, taux in tr:
        if prix > bas:
            ht += (min(prix, haut) - bas) * taux
        bas = haut
    return ht * 1.20


def droits_ligne_directe(base):
    tr = [(8_072, 0.05), (12_109, 0.10), (15_932, 0.15), (552_324, 0.20), (902_838, 0.30), (1_805_677, 0.40), (float("inf"), 0.45)]
    d, bas = 0.0, 0
    for haut, taux in tr:
        if base > bas:
            d += (min(base, haut) - bas) * taux
        bas = haut
    return d


def coef_nue_propriete(age):
    for limite, coef in [(21, 0.10), (31, 0.20), (41, 0.30), (51, 0.40), (61, 0.50), (71, 0.60), (81, 0.70), (91, 0.80)]:
        if age < limite:
            return coef
    return 0.90


def tri(flux):
    bas, haut = -0.99, 1.0
    for _ in range(200):
        mil = (bas + haut) / 2
        van = sum(f / (1 + mil) ** k for k, f in enumerate(flux))
        bas, haut = (mil, haut) if van > 0 else (bas, mil)
    return mil


def scenario_colocation(levier=True, taux=0.0345, horizon=15, croissance_prix=0.01):
    """Cas d'étude du module 3.2 (LMNP au réel, TMI 30 %, PS 18,6 %)."""
    prix, frais, travaux, meubles = 160_000, 12_800, 20_000, 6_000
    total = prix + frais + travaux + meubles
    emprunt = 180_000 if levier else 0
    m = mensualite(emprunt, taux, 25) if levier else 0
    ass = emprunt * 0.003 / 12
    crd, interets = emprunt, []
    for _ in range(25):
        ia = 0
        for _ in range(12):
            i = crd * taux / 12; ia += i; crd -= (m - i)
        interets.append(ia)
    crd_fin = emprunt
    for k in range(horizon * 12):
        crd_fin -= (m - crd_fin * taux / 12)
    ab, am = (prix * 0.85 + travaux) / 30, meubles / 7
    flux = [-(total - emprunt)]
    ard = deficit = amort_bati = 0.0
    for y in range(1, horizon + 1):
        loy, ch = 16_200 * 1.01 ** (y - 1), 4_596 * 1.02 ** (y - 1)
        base = loy - ch - (interets[y - 1] + 12 * ass if levier else 0) - (frais if y == 1 else 0)
        if base < 0:
            deficit += -base; base = 0
        else:
            u = min(deficit, base); base -= u; deficit -= u
        amob = am if y <= 7 else 0
        dispo = ab + amob + ard
        utilise = min(dispo, base); ard = dispo - utilise
        amort_bati += utilise * ab / (ab + amob)
        flux.append(loy - ch - 12 * (m + ass) - (base - utilise) * (0.30 + PS_LMNP))
    vente = prix * (1 + croissance_prix) ** horizon
    pv = plus_value(prix, frais, travaux, vente, horizon, amort_bati)
    flux[-1] += vente - crd_fin - pv["total"]
    return tri(flux), flux


if __name__ == "__main__":
    def ok(val, attendu, tol=0.01, nom=""):
        assert abs(val - attendu) <= tol, f"{nom}: {val} au lieu de {attendu}"

    ok(mensualite(110_000, 0.0335, 20), 629.51, nom="mensualité module 1.12")
    ok((6_240 - 2_127) / 12 - (mensualite(110_000, 0.0335, 20) + 110_000 * 0.0025 / 12), -309.68, nom="cash-flow 1.12")
    ok(revision_irl(700, 148.37, 146.68), 708.07, nom="révision 2.1")
    ok(revision_irl(revision_irl(900, 145.47, 143.46), 146.60, 145.47), 919.70, nom="révision examen N2")
    ok(penalite_depot(800, 2), 160, nom="pénalité dépôt")
    m, c = capacite_emprunt(3_000, 700, 0, 0.0345, 25, 0.003); ok(m, 1_221.50); ok(c, 233_581, 1, "capacité 2.10")
    m, c = capacite_emprunt(4_200, 800, 250, 0.0345, 25, 0.003); ok(m, 1_416); ok(c, 270_774, 1, "capacité examen N2")
    ok(impot_micro_foncier(9_600, 0.30), 3_171.84); ok(impot_reel_foncier(9_600, 7_150, 0, 0.30), 1_156.40)
    ok(impot_micro_foncier(7_800, 0.30), 2_577.12); ok(impot_reel_foncier(7_800, 5_550, 1, 0.30), 1_052.56)
    ok(impot_micro_bic(9_000, 0.50, 0.30), 2_187.00)
    base, imp, report = lmnp_reel(9_000, 6_050, 4_250 + 5_000 / 7, 0.30); ok(imp, 0); ok(report, 2_014.29, nom="ARD 2.8")
    base, imp, _ = lmnp_reel(9_000, 3_500, 127_500 / 30 + 5_000 / 7, 0.30); ok(base, 535.71); ok(imp, 260.36, nom="LMNP 2.7")
    ok(deficit_foncier(8_000, 3_000, 20_000)[0], 10_700); ok(deficit_foncier(8_000, 3_000, 20_000)[1], 4_300)
    ok(deficit_foncier(8_000, 3_000, 20_000, 21_400)[0], 15_000)
    ok(jeanbrun(200_000)[0], 5_600); ok(jeanbrun(200_000, regime="social", plafond=10_000)[0], 7_200)
    ok(jeanbrun(200_000, regime="tres_social", plafond=12_000)[0], 8_800); ok(jeanbrun(150_000, 45_000, neuf=False)[0], 4_680)
    ok(plus_value(100_000, 0, 0, 180_000, 15)["total"], 12_628.15, nom="plus-value 3.5")
    ok(plus_value(150_000, 11_000, 0, 200_000, 12, 45_000)["total"], 16_067.96, nom="plus-value LMNP examen final")
    ok(plus_value(150_000, 11_000, 0, 200_000, 12, 0)["total"], 4_262.93)
    ok(surtaxe(55_000), 850)
    ok(ifi(1_320_000), 1_640, nom="IFI 3.6")
    ok(dmto(200_000, 0.045), 11_613.30); ok(dmto(200_000, 0.05), 12_637.00); ok(emoluments_ttc(200_000), 2_394.30)
    ok(droits_ligne_directe(300_000 * coef_nue_propriete(65) - 100_000), 14_194.35, nom="donation 3.7")
    ok(droits_ligne_directe(200_000), 38_194.35)
    r, flux = scenario_colocation(); ok(round(r * 100, 1), 11.9, 0.05, "TRI 3.2"); ok(flux[1], 308.4, 0.5)
    ok(round(scenario_colocation(levier=False)[0] * 100, 1), 4.1, 0.05, "TRI sans levier")
    ok(round(scenario_colocation(taux=0.042)[0] * 100, 1), 9.4, 0.05, "sensibilité taux")
    ok(round(scenario_colocation(croissance_prix=0.0)[0] * 100, 1), 10.0, 0.05, "sensibilité prix stable")
    print("Tous les jeux de tests sont conformes aux exemples de la formation.")

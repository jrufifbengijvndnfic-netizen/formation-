"""Pont de test : exécute les fonctions de reference-calculs.py sur des cas lus en JSON (stdin)
et renvoie les résultats en JSON (stdout). Utilisé par src/lib/calculs-differentiel.test.ts."""
import importlib.util
import json
import pathlib
import sys

chemin = pathlib.Path(__file__).resolve().parents[2] / "files" / "formation-immobilier-locatif-2026" / "reference-calculs.py"
spec = importlib.util.spec_from_file_location("reference_calculs", chemin)
ref = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ref)

cas = json.load(sys.stdin)
sortie = []
for c in cas:
    f = getattr(ref, c["fonction"])
    r = f(*c.get("args", []), **c.get("kwargs", {}))
    if isinstance(r, tuple):
        r = list(r)
    if c["fonction"] == "scenario_colocation":
        r = [r[0], r[1]]
    sortie.append(r)
json.dump(sortie, sys.stdout)

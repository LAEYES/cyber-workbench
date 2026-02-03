# Standard Sécurité IaC (Infrastructure as Code)

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Exigences minimales (baseline)
- Branch protection + PR obligatoires.
- Scans IaC + secrets à chaque PR.
- Policy-as-code : chiffrement requis, logs requis, pas de stockage public.
- Backend state chiffré + locking ; accès minimal.

## 2. Renforcé (régulé)
- Two-person rule sur changements critiques.
- Traçabilité PR→plan→apply.
- Drift detection + remédiation.

## 3. Preuves
- Règles branches, rapports scans, config state.

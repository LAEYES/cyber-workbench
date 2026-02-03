# STD — D16 — Gestion SBOM & VEX

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. SBOM (obligatoire)
- Une SBOM par artefact prod, générée à chaque release.
- Doit inclure dépendances directes + transitives + hashes.

## 2. VEX
- Pour toute vulnérabilité critique non corrigée immédiatement, publier une VEX :
  - statut (not affected / fixed / under investigation / affected)
  - justification + mitigation + date de revue

## 3. SLA vulnérabilités (référence)
- Critique : ≤ 7 jours (baseline), ≤ 72h (régulé)
- Élevée : ≤ 30 jours

## 4. Preuves
- SBOMs, VEXs, tickets de remédiation.

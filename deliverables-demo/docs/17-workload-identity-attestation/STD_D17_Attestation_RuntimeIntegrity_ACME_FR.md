# STD — D17 — Attestation & Intégrité Runtime

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Attestation (régulé, recommandé baseline)
- Vérifier au minimum :
  - signature image/artefact (D16)
  - digest image
  - posture runtime (ex: kernel, secure boot, policy)

## 2. Pass/fail
- [ ] Aucune identité émise sans attestation (régulé).
- [ ] Logs attestation conservés ≥ 180j.

## 3. Preuves
- Rapports attestation, journaux, policies.

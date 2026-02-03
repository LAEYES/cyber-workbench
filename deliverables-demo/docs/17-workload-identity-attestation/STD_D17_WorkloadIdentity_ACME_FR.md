# STD — D17 — Standard Workload Identity (OIDC / SPIFFE)

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Exigences (baseline)
- Identité unique par service (pas mutualisée).
- Bind à l’artefact : image digest/tag immuable.
- Émission jeton/cert via IdP (no self-signed en prod).

## 2. Contrôles
- Audience/issuer strict.
- Scopes minimaux.

## 3. Preuves
- Exemples de claims, policies, logs d’émission.

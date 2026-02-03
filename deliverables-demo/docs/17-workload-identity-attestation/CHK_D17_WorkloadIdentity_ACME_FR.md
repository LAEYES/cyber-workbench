# CHK — D17 — Checklist Identité Workload

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

- [ ] Identité par service (pas mutualisée).
- [ ] Tokens/certs courts (≤24h / ≤1h régulé).
- [ ] Politiques audience/issuer strict + scopes minimaux.
- [ ] Secretless (pas de secrets dans images, rotation/revocation).
- [ ] (Régulé) Attestation avant émission identité + logs ≥180j.

---
*Joindre preuves : policies, claims, logs émission, rapports vault/STS, attestations.*

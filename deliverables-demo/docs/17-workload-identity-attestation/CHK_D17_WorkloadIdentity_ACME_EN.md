# CHK — D17 — Workload Identity Checklist

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

- [ ] Per-service identity (no shared identities).
- [ ] Short-lived tokens/certs (≤24h / ≤1h regulated).
- [ ] Strict audience/issuer policies + minimal scopes.
- [ ] Secretless (no secrets in images, rotation/revocation).
- [ ] (Regulated) Attestation before issuance + logs ≥180d.

---
*Attach evidence: policies, claims, issuance logs, vault/STS reports, attestations.*

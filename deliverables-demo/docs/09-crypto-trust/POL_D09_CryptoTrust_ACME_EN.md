# POL — D09 — Crypto / Trust (PKI, PQC, HSM, Keys)

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Mission
Establish a **crypto-agile** and **quantum-ready** architecture: certificate management (PKI), key management (KMS/HSM), secrets, and encryption standards (TLS, hybrid PQC), with auditable and traceable controls.

## 2. Baseline requirements
- TLS **1.2+** everywhere in transit (TLS 1.3 recommended).
- At-rest encryption for Confidential+ data (see D07).
- Certificate and key inventory: owner + scope + expiry.
- Rotation:
  - critical secrets/keys: **≤ 12 months** (or stricter based on risk)
  - certificates: automated renewal recommended.
- Separation of duties: PKI/KMS admin ≠ data admin ≠ infra admin.
- Log key/cert operations (issue, revoke, rotate); retention **≥ 180 days** for critical scope.

## 3. Enhanced requirements (regulated)
- HSM/KMS for critical scope (non-exportable keys where feasible).
- Hybrid TLS (classical + PQC) for critical flows **when supported**.
- Immutable crypto logs (WORM) for critical scope.

## 4. Audit criteria (pass/fail)
- [ ] TLS standards defined and enforced.
- [ ] Cert/key inventory maintained.
- [ ] Rotation and revocation evidenced.
- [ ] SoD enforced.
- [ ] Crypto logs centralized and retained.

## 5. Expected evidence
- TLS policy + compliance scans.
- Cert/key inventory + rotation history.
- Revocation/renewal samples.
- KMS/PKI log exports.

---
*Template policy: complemented by PKI, Hybrid PQC/TLS, and Key Management & HSM standards.*

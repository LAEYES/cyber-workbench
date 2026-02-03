# STD — D17 — Attestation & Runtime Integrity

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Attestation (regulated, recommended baseline)
- Verify at minimum:
  - image/artifact signature (D16)
  - image digest
  - runtime posture (e.g., kernel, secure boot, policy)

## 2. Pass/fail
- [ ] No identity issued without attestation (regulated).
- [ ] Attestation logs retained ≥ 180d.

## 3. Evidence
- Attestation reports, logs, policies.

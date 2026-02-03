# STD — D07 — Encryption & Key Management Standard

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Baseline requirements
- TLS 1.2+ in transit.
- At-rest encryption for Confidential+.
- Rotate critical keys/secrets: **≤ 12 months** (or per tooling).

## 2. Enhanced (regulated)
- KMS/HSM/BYOK for critical scope.
- Separation of duties: key admins ≠ data admins.
- Log KMS operations; retention **≥ 180 days**.

## 3. Audit criteria
- [ ] TLS in place.
- [ ] At-rest encryption for Confidential+.
- [ ] Rotation and KMS logs.

## 4. Evidence
- TLS/KMS configs + rotation history + logs.

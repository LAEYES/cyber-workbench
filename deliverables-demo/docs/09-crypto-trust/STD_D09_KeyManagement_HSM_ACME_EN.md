# STD — D09 — Key Management & HSM Standard

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Baseline requirements
- Central KMS (cloud or on‑prem) for encryption keys.
- Sensitive keys: RBAC + least privilege.
- Rotate critical keys: **≤ 12 months**.
- Log KMS operations (create/rotate/decrypt); retention ≥ 180d for critical scope.

## 2. Enhanced (regulated)
- HSM for critical keys (non-exportable).
- Two-person rule for sensitive operations (rotation/disable).
- Separation of duties (key admin ≠ data admin).

## 3. Evidence
- KMS/HSM config, rotation history, log exports.

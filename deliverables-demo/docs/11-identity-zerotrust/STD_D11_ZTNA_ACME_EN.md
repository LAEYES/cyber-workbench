# STD — D11 — ZTNA Standard (Application-level access)

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Baseline requirements
- MFA required.
- App/resource-level access (no broad network routing).
- Minimum posture for sensitive access: managed device + active EDR + supported OS.
- Third-party access: dedicated accounts + time-bound + sponsor.
- Centralize ZTNA logs (auth, resources, policy changes); retention ≥ 90d.

## 2. Enhanced (regulated)
- Phishing-resistant MFA for admins.
- Session recording for admin access via bastion.
- Log retention ≥ 180d + integrity.

## 3. Evidence
- ZTNA policy exports, protected app list, logs.

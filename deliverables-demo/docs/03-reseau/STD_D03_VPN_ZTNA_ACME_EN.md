# STD — D03 — Remote Access Standard (VPN / ZTNA)

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Purpose
Define **auditable** requirements for remote access (users/admins/third parties).

## 2. Baseline requirements
- MFA required.
- Separate user/admin/third-party access.
- Minimum posture for sensitive access: managed device, active EDR, supported OS.
- Split tunneling: denied by default; exception max **30d**.
- User access: no direct DATA/BACKUP access.
- Connection logs centralized; retention **≥ 90 days**.

## 3. Enhanced (regulated)
- Prefer ZTNA for critical apps.
- Phishing-resistant MFA for admins.
- Session recording for admin access (critical scope).
- Log retention **≥ 180 days** + integrity.

## 4. Expected evidence
- Policy exports + groups.
- Sample logs.

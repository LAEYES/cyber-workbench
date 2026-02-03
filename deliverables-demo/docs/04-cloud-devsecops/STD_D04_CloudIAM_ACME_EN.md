# Cloud IAM Standard

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Baseline requirements
- SSO/federation recommended; no long-lived local users for critical scope.
- MFA: **100% admins**.
- Long-lived user keys: prohibited; prefer STS/OIDC.
- Access reviews: critical scope **monthly**.
- Centralized IAM logs; retention **≥ 90 days**.

## 2. Enhanced (regulated)
- Phishing-resistant MFA for admins.
- Break-glass: two-person control + quarterly tests + rotate after use.
- Log retention **≥ 180 days** + integrity.

## 3. Evidence
- IAM exports, MFA dashboard, access review reports.

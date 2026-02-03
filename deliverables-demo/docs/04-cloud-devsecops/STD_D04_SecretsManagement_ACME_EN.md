# Secrets Management Standard

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Baseline requirements
- Secrets must be stored in a vault/KMS.
- Secrets in code/tickets/docs: prohibited.
- Rotate sensitive secrets: **≤ 90 days**.
- Vault access logs enabled; retention **≥ 90 days**.

## 2. Enhanced (regulated)
- Two-person rule for critical secrets.
- Log retention **≥ 180 days** + integrity.
- Secret leak detection with CI blocking.

## 3. Evidence
- Vault/RBAC config, rotation history, scan reports.

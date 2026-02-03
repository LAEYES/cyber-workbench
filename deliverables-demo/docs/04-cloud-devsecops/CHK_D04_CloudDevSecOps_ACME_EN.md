# Cloud & DevSecOps Checklist (D04)

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Landing zone
- [ ] Dev/test/prod separation.
- [ ] Guardrails (no unapproved public storage, no internet admin).

## 2. Cloud IAM
- [ ] 100% admin MFA.
- [ ] No long-lived user keys.
- [ ] Monthly access reviews for critical scope.

## 3. Logs
- [ ] Audit logs centralized; retention ≥ 90d/180d.

## 4. IaC
- [ ] PR required + IaC/secret scans.
- [ ] Encrypted state + locking.

## 5. Secrets
- [ ] Vault mandatory; rotation ≤ 90d.
- [ ] Secret scanning blocks CI.

## 6. Enhanced (regulated)
- [ ] Immutable logs + integrity.
- [ ] Two-person rule for critical changes.

---
*Checklist: complete with evidence.*

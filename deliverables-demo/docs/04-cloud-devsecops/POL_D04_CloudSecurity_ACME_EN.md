# Cloud Security Policy

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Purpose
Define **measurable and auditable** security requirements for cloud services (IaaS/PaaS/SaaS) and associated DevSecOps practices.

## 2. Baseline requirements
### 2.1 Landing zone & separation
- Dev/test/prod separation (at least logical); recommended: separate accounts/projects.
- Guardrails prohibit: unapproved public storage, unmanaged long-lived keys, internet-exposed admin.

### 2.2 Logging
- Audit logs enabled and centralized.
- Retention: **≥ 90 days** (baseline).

### 2.3 Encryption
- TLS in transit.
- At-rest encryption for sensitive data (KMS).

### 2.4 Posture & compliance
- CSPM/controls-as-code for critical scope.
- Remediate critical misconfigs: **≤ 7 days**.

## 3. Enhanced requirements (regulated)
- Strict prod/non-prod account separation.
- BYOK/HYOK for critical scope where applicable.
- Immutable logs + retention **≥ 180 days** + integrity.
- Monthly cloud access reviews for critical scope.
- At least yearly cloud IR exercises.

## 4. Audit criteria (pass/fail)
- [ ] Guardrails in place.
- [ ] Logs centralized with retention.
- [ ] Encryption in place.
- [ ] Posture monitored (CSPM) and remediated.

## 5. Expected evidence
- Landing zone diagram.
- Guardrail/policy extracts.
- Log extracts + retention proof.

---
*Template: adapt to the cloud provider (AWS/Azure/GCP).* 

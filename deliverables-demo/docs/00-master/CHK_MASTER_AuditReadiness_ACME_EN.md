# CHK — MASTER — Audit Readiness (cross-domain)

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Governance & risk
- [ ] D01: policies in force, periodic reviews.
- [ ] D15: risk register up-to-date + time-boxed acceptances.

## 2. Identity (human + machine)
- [ ] D02/D11: MFA + RBAC/SoD + access reviews.
- [ ] D17: workload identity + no static secrets in production.

## 3. Detection & response
- [ ] D10: critical logs ingested, priority detections active.
- [ ] D13: playbooks + audit trails + approvals.
- [ ] D14: case management + triage SLAs.

## 4. Hardening & vulnerabilities
- [ ] D05: patching meets SLAs, EDR coverage.
- [ ] D06: SDLC gates + vulnerability management.

## 5. Data & crypto
- [ ] D07: classification + backups + tests.
- [ ] D09: key management, rotation, PKI.

## 6. Supply chain
- [ ] D16: SBOM 100% prod + signing + provenance (as required).

## 7. Resilience
- [ ] D12: defined RPO/RTO + proven DR/restore tests.

## 8. Compliance & evidence
- [ ] D08: chain of custody + compliant retention.
- [ ] Immutable evidence for critical incidents/decisions (regulated).

---
*Pass/fail: if a critical item is “no”, trigger an action plan with due date and owner.*

# CHK — MASTER — Audit Readiness (cross-domain)

**Organization:** ACME  
**Version:** 0.3 (hardened)  
**Date:** 2026-02-03

## 0. Audit decision rule
- **PASS** = 0 failed critical items.
- **FAIL** = ≥ 1 failed critical item (action plan mandatory).

## 1. Governance & risk (critical)
- [ ] D01: policies in force, reviews ≥ yearly, exceptions time-boxed (≤ 30d).
- [ ] D15: risk register current, acceptances ≤ 90d (regulated ≤ 60d), decisions traceable.

## 2. Identity (human + machine) (critical)
- [ ] D02/D11: MFA 100% privileged accounts + SoD, access reviews ≥ quarterly (regulated ≥ monthly).
- [ ] D17: workload identity in prod + 0 unmanaged static secrets; tokens/certs ≤ 24h (regulated ≤ 1h).

## 3. Detection & response (critical)
- [ ] D10: critical log coverage = 100% + priority detections active; critical triage ≤ 1h.
- [ ] D13: versioned playbooks + audit trails; approvals for critical actions.
- [ ] D14: case management (workflow + mandatory fields) + tracked triage SLAs (MTTD/MTTR).

## 4. Hardening & vulnerabilities (critical)
- [ ] D05: critical patch ≤ 7d (regulated ≤ 72h) + EDR coverage ≥ 95% (regulated ≥ 99%).
- [ ] D06: SDLC gates (SAST/DAST/dep scan) + critical vulns ≤ 7d (regulated ≤ 72h) OR documented VEX/mitigation.

## 5. Data & crypto (critical)
- [ ] D07: effective classification + encryption for sensitive data + restore tests ≥ quarterly.
- [ ] D09: key management (KMS/HSM), rotation ≥ yearly (regulated ≤ 6 months), usage inventory.

## 6. Supply chain (critical)
- [ ] D16: SBOM 100% prod releases + signing & verification (deny unsigned); critical vulns ≤ 7d (regulated ≤ 72h).

## 7. Resilience (critical)
- [ ] D12: defined RPO/RTO + restore tests ≥ quarterly + DR test ≥ yearly (evidence retained).

## 8. Compliance & evidence (critical)
- [ ] D08: chain-of-custody + compliant retention (≥ 1y; regulated ≥ 3y) + integrity.
- [ ] Critical incidents/decisions: immutable evidence (WORM) (regulated) + timestamped exports.

## 9. Minimum retention (reminder)
- SIEM/SOAR/IdP/ZTNA: ≥ 180d (regulated ≥ 1y)
- Releases/SBOM/attestations: ≥ 1y (regulated ≥ 3y)
- DR/restore tests: ≥ 3y

---
*If FAIL: open a case (D14), assign an owner, set a due date, and link evidence (D08/D13).*

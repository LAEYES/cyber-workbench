# MAT — MASTER — Coverage Matrix (baseline vs regulated)

**Organization:** ACME  
**Version:** 0.3 (hardened)  
**Date:** 2026-02-03

## 1. Goal
Make coverage readable **and audit-ready** without tables: for each domain, restate Policy/Standards/Checklist plus **key SLAs/thresholds** and **minimum retention** (baseline vs regulated).

> Note: Values below are **default targets** (tune per criticality, legal constraints, and context). “Regulated” applies to critical scopes.

## 2. Matrix (by domain)
- **D01 Governance**: POL + STD + CHK
  - SLAs/Thresholds: policy review ≥ yearly; exceptions time-boxed ≤ 30d.
  - Retention: decisions/approvals ≥ 1y (regulated ≥ 3y).
- **D02 IAM/PAM**: POL + STD + CHK
  - SLAs/Thresholds: MFA 100% privileged accounts; privileged access reviews ≥ monthly (regulated).
  - Retention: auth/admin logs ≥ 180d (regulated ≥ 1y).
- **D03 Network**: POL + STD + CHK
  - SLAs/Thresholds: firewall/segmentation changes approved; 0 orphan rules.
  - Retention: FW/VPN logs ≥ 90d (regulated ≥ 180d).
- **D04 Cloud/DevSecOps**: POL + STD + CHK
  - SLAs/Thresholds: 100% secrets out of repos; IaC scanning on PRs = 100%.
  - Retention: CI/CD logs ≥ 90d (regulated ≥ 180d).
- **D05 Endpoints**: POL + STD + CHK
  - SLAs/Thresholds: critical patch ≤ 7d (regulated ≤ 72h); EDR coverage ≥ 95% (regulated ≥ 99%).
  - Retention: EDR telemetry ≥ 30d (regulated ≥ 90d).
- **D06 AppSec**: POL + STD + CHK
  - SLAs/Thresholds: SAST/DAST in pipeline; critical vulns fixed/mitigated ≤ 7d (regulated ≤ 72h).
  - Retention: scan/release reports ≥ 1y (regulated ≥ 3y).
- **D07 Data**: POL + STD + CHK
  - SLAs/Thresholds: data classified; encryption in transit/at rest for sensitive.
  - Retention: backup/restore test evidence ≥ 1y (regulated ≥ 3y).
- **D08 Compliance/Legal (evidence)**: POL + STD + CHK
  - SLAs/Thresholds: documented chain-of-custody; legal requests handled within mandated timelines.
  - Retention: incident evidence ≥ 1y (regulated ≥ 3y) + integrity.
- **D09 Crypto/Trust**: POL + STD + CHK
  - SLAs/Thresholds: key rotation at least yearly (regulated ≤ 6 months); HSM/KMS usage.
  - Retention: PKI/KMS/HSM logs ≥ 180d (regulated ≥ 1y).
- **D10 SOC / Detection & Response**: POL + STD + CHK
  - SLAs/Thresholds: tracked MTTD/MTTR; critical triage ≤ 1h; critical log coverage = 100%.
  - Retention: SIEM logs ≥ 180d (regulated ≥ 1y).
- **D11 Identity / Zero Trust**: POL + STD + CHK
  - SLAs/Thresholds: ZTNA for remote access; re-auth on sensitive actions.
  - Retention: ZTNA/IdP logs ≥ 180d (regulated ≥ 1y).
- **D12 Resilience (BCP/DR/Backups)**: POL + STD + CHK
  - SLAs/Thresholds: defined RPO/RTO; restore tests ≥ quarterly; DR tests ≥ yearly.
  - Retention: test reports ≥ 3y.
- **D13 Orchestration / Policy-as-Code**: POL + STD + CHK
  - SLAs/Thresholds: versioned playbooks; approvals for critical actions; full execution trace.
  - Retention: SOAR/workflow audit trails ≥ 180d (regulated ≥ 1y).
- **D14 SOC Interface**: POL + STD + CHK
  - SLAs/Thresholds: case workflow + mandatory fields; two-person close for critical cases (regulated).
  - Retention: UI action logs ≥ 90d (regulated ≥ 180d).
- **D15 Risk Engine**: POL + STD + CHK
  - SLAs/Thresholds: risk acceptance ≤ 90d (regulated ≤ 60d); score ≥ 16 (1–25) reviewed weekly.
  - Retention: decisions + rationale ≥ 1y (regulated ≥ 3y).
- **D16 Supply chain (SBOM/Provenance/Signing)**: POL + STD + CHK
  - SLAs/Thresholds: SBOM 100% prod releases; prod artifacts signed + verified; critical vuln ≤ 7d (regulated ≤ 72h).
  - Retention: SBOM/attestations/release logs ≥ 1y (regulated ≥ 3y).
- **D17 Workload Identity / Attestation**: POL + STD + CHK
  - SLAs/Thresholds: token/cert lifetime ≤ 24h (regulated ≤ 1h); 0 unmanaged static secret in prod.
  - Retention: issuance/attestation logs ≥ 180d (regulated ≥ 1y).
- **D18 Deception**: POL + STD + CHK
  - SLAs/Thresholds: every trigger = ticket + timeline; auto playbook ≤ 30 min; monthly tests.
  - Retention: deception logs ≥ 180d (regulated ≥ 1y).

## 3. RACI (template)
- **R**: Domain owner (IT/Cloud/SecOps)
- **A**: CISO
- **C**: Risk/Legal/Privacy
- **I**: Exec / Business

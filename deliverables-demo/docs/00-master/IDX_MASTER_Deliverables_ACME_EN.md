# IDX — MASTER — Deliverables Index (D01→D18)

**Organization:** ACME  
**Version:** 0.2  
**Date:** 2026-02-03

## 1. Purpose
Provide an operational table of contents: what exists, why it exists, and where to find evidence.

## 2. Index (summary)
- **D01 Governance**: ISMS policies, risk register, inventory, TPRM, checklists.
- **D02 IAM/PAM**: IAM policy, MFA, PAM, checklist.
- **D03 Network**: segmentation, firewall, VPN/ZTNA, checklist.
- **D04 Cloud/DevSecOps**: cloud IAM, IaC, secrets, checklist.
- **D05 Endpoints**: hardening, patching, EDR, checklist.
- **D06 AppSec**: secure dev, vuln mgmt, checklist.
- **D07 Data**: classification, encryption/keys, backup, checklist.
- **D08 Compliance/Legal**: obligations, disclosure, evidence handling, checklist.
- **D09 Crypto/Trust**: PKI, PQC/hybrid TLS, HSM/keys, checklist.
- **D10 SOC**: SIEM/logging, IR, use cases, checklist.
- **D11 Identity/ZT**: ZTNA, continuous auth, checklist.
- **D12 Resilience**: DRP, BCP, immutable backups, checklist.
- **D13 Orchestration**: policy-as-code, SOAR playbooks, audit trails, checklist.
- **D14 SOC Interface**: KPI dashboards, case mgmt, UI RBAC, checklist.
- **D15 Risk Engine**: scoring, evidence linkage, AI guardrails, checklist.
- **D16 Supply chain**: SBOM/VEX, provenance, signing, checklist.
- **D17 Workload Identity**: secretless, attestation, checklist.
- **D18 Deception**: honeypots, honeytokens/canary, playbooks, checklist.

## 3. Where deliverables live
- Generated via `gen` into `docs/<domain>/` (or `deliverables-demo/docs/<domain>/` for demos).

## 4. Where evidence lives
- Tickets (D14/D10), SIEM/SOAR exports (D10/D13), SBOM/attestation artifacts (D16), access logs (D02/D11/D17), patch/vuln reports (D05/D06), DR/backup evidence (D12).

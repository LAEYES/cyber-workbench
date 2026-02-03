# IDX — MASTER — Deliverables Index (D01→D18)

**Organization:** ACME  
**Version:** 0.3 (hardened)  
**Date:** 2026-02-03

## 1. Purpose
Provide an **operational** table of contents: what exists, why it exists, which files are expected, and where evidence should be found.

## 2. File naming convention
- Deliverables are generated as: `TYPE_<Code>_<Name>_<ORG>_<FR|EN>.md`
- Expected folders: `docs/<domain>/` (or `deliverables-demo/docs/<domain>/` for demos)

## 3. Detailed index by domain

### D01 — Governance
**Expected deliverables (examples)**
- `POL_D01_PSSI_*`
- `STD_D01_*` (ISMS pack)
- `REG_D01_RiskRegister_*`
- `INV_D01_AssetInventory_*`
- `QST_D01_TPRM_*`
- `CHK_D01_Compliance_*`

**Typical evidence**
- Steering committee minutes, approvals, risk decisions (D15), annual review proof.

### D02 — IAM / PAM
**Expected deliverables**
- `POL_D02_IAM_PAM_*`
- `STD_D02_MFA_*`
- `STD_D02_PAM_*`
- `CHK_D02_IAM_PAM_*`

**Typical evidence**
- IdP/MFA exports, access reviews, admin logs, exception tickets.

### D03 — Network
**Expected deliverables**
- `POL_D03_NetworkSecurity_*`
- `STD_D03_Segmentation_*`
- `STD_D03_Firewall_*`
- `STD_D03_VPN_ZTNA_*`
- `CHK_D03_Network_*`

**Typical evidence**
- FW/VPN configs, rule reviews, FW/VPN logs, diagrams.

### D04 — Cloud & DevSecOps
**Expected deliverables**
- `POL_D04_CloudSecurity_*`
- `STD_D04_CloudIAM_*`
- `STD_D04_IaC_Security_*`
- `STD_D04_SecretsManagement_*`
- `CHK_D04_CloudDevSecOps_*`

**Typical evidence**
- CI/CD logs, IaC scan results, secrets manager config, IAM reviews.

### D05 — Endpoints
**Expected deliverables**
- `POL_D05_EndpointSecurity_*`
- `STD_D05_Hardening_*`
- `STD_D05_PatchManagement_*`
- `STD_D05_EDR_*`
- `CHK_D05_Endpoints_*`

**Typical evidence**
- Patch reports, EDR coverage, EDR telemetry, time-boxed exceptions.

### D06 — AppSec / SDLC
**Expected deliverables**
- `POL_D06_AppSec_*`
- `STD_D06_SecureDevelopment_*`
- `STD_D06_VulnerabilityManagement_*`
- `CHK_D06_AppSec_*`

**Typical evidence**
- SAST/DAST/dep scan results, vuln tickets, gating proof.

### D07 — Data
**Expected deliverables**
- `POL_D07_DataProtection_*`
- `STD_D07_DataClassification_*`
- `STD_D07_EncryptionAndKeyManagement_*`
- `STD_D07_BackupAndRecovery_*`
- `CHK_D07_DataProtection_*`

**Typical evidence**
- Classification reports, encryption configs, restore tests, backup logs.

### D08 — Cyber Compliance & Legal
**Expected deliverables**
- `POL_D08_ComplianceLegal_*`
- `STD_D08_RegulatoryObligations_*`
- `STD_D08_IncidentDisclosure_*`
- `STD_D08_EvidenceHandling_*`
- `CHK_D08_ComplianceLegal_*`

**Typical evidence**
- Chain-of-custody, timestamped exports, retention controls, evidence access logs.

### D09 — Crypto / Trust
**Expected deliverables**
- `POL_D09_CryptoTrust_*`
- `STD_D09_PKI_*`
- `STD_D09_PQC_HybridTLS_*`
- `STD_D09_KeyManagement_HSM_*`
- `CHK_D09_CryptoTrust_*`

**Typical evidence**
- Key/cert inventory, KMS/HSM logs, rotation evidence, TLS configs.

### D10 — SOC / Detection
**Expected deliverables**
- `POL_D10_SOC_Detection_*`
- `STD_D10_SIEM_Logging_*`
- `STD_D10_IncidentResponse_*`
- `STD_D10_DetectionUsecases_*`
- `CHK_D10_SOC_Detection_*`

**Typical evidence**
- SIEM exports, log coverage, incident tickets, timelines (D14), playbook executions (D13).

### D11 — Identity / Zero Trust
**Expected deliverables**
- `POL_D11_Identity_ZeroTrust_*`
- `STD_D11_ZTNA_*`
- `STD_D11_ContinuousAuth_*`
- `CHK_D11_Identity_ZeroTrust_*`

**Typical evidence**
- ZTNA config, IdP logs, re-auth proof, access reviews.

### D12 — Resilience / Backup
**Expected deliverables**
- `POL_D12_Resilience_*`
- `STD_D12_DRP_*`
- `STD_D12_BCP_*`
- `STD_D12_ImmutableBackups_*`
- `CHK_D12_Resilience_*`

**Typical evidence**
- Restore/DR test reports, immutability proof, backup inventory.

### D13 — Orchestration & Automation
**Expected deliverables**
- `POL_D13_Orchestration_Automation_*`
- `STD_D13_Playbooks_IR_SOAR_*`
- `STD_D13_PolicyAsCode_*`
- `STD_D13_Evidence_AuditTrails_*`
- `CHK_D13_Orchestration_Automation_*`

**Typical evidence**
- Playbook executions, audit trails, approvals, exports.

### D14 — SOC Interface
**Expected deliverables**
- `POL_D14_SOC_Interface_*`
- `STD_D14_Dashboards_KPIs_*`
- `STD_D14_CaseManagement_Workflows_*`
- `STD_D14_AccessControl_UI_*`
- `CHK_D14_SOC_Interface_*`

**Typical evidence**
- Dashboard exports/screens, ticket templates, UI action logs.

### D15 — Risk Engine
**Expected deliverables**
- `POL_D15_RiskEngine_*`
- `STD_D15_RiskScoringModel_*`
- `STD_D15_Control_Evidence_Linkage_*`
- `STD_D15_AI_Assist_Guardrails_*`
- `CHK_D15_RiskEngine_*`

**Typical evidence**
- Risk register, decisions, controls↔evidence linkage, AI logs where allowed.

### D16 — Supply Chain
**Expected deliverables**
- `POL_D16_SupplyChainSecurity_*`
- `STD_D16_SoftwareProvenance_SLSA_*`
- `STD_D16_SBOM_VEX_Management_*`
- `STD_D16_ArtifactSigning_Verification_*`
- `CHK_D16_SupplyChainSecurity_*`

**Typical evidence**
- SBOM, VEX, attestations, verification policies, release logs.

### D17 — Workload Identity & Attestation
**Expected deliverables**
- `POL_D17_WorkloadIdentity_*`
- `STD_D17_WorkloadIdentity_*`
- `STD_D17_Attestation_RuntimeIntegrity_*`
- `STD_D17_SecretlessAccess_*`
- `CHK_D17_WorkloadIdentity_*`

**Typical evidence**
- Claims/attestations, issuance logs, secret scans, vault/STS configs.

### D18 — Deception
**Expected deliverables**
- `POL_D18_Deception_*`
- `STD_D18_HoneypotDeployment_*`
- `STD_D18_Honeytokens_Canary_*`
- `STD_D18_DeceptionResponse_Playbooks_*`
- `CHK_D18_Deception_*`

**Typical evidence**
- Deception inventory, monthly tests, incident tickets, SOAR/SIEM logs.

## 4. Evidence pointers (cross-domain)
- **Tickets & timelines**: D14 (case mgmt) + D10 (IR)
- **SIEM/SOAR exports & audit trails**: D10 + D13
- **Chain-of-custody & retention**: D08
- **SBOM / attestations / release logs**: D16
- **Identity & access logs**: D02/D11/D17
- **Vuln/patch reports**: D06/D05
- **DR/restore evidence**: D12

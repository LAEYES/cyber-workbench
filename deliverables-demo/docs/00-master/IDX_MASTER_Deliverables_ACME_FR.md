# IDX — MASTER — Index des livrables (D01→D18)

**Organisation :** ACME  
**Version :** 0.3 (durci)  
**Date :** 2026-02-03

## 1. Objectif
Fournir une table des matières **opérationnelle** : quoi existe, à quoi ça sert, quels fichiers sont attendus, et où trouver les preuves.

## 2. Convention fichiers
- Les livrables sont générés sous la forme : `TYPE_<Code>_<Nom>_<ORG>_<FR|EN>.md`
- Dossiers attendus : `docs/<domain>/` (ou `deliverables-demo/docs/<domain>/` pour les démos)

## 3. Index détaillé par domaine

### D01 — Gouvernance
**Livrables attendus (exemples)**
- `POL_D01_PSSI_*`
- `STD_D01_*` (pack ISMS)
- `REG_D01_RiskRegister_*`
- `INV_D01_AssetInventory_*`
- `QST_D01_TPRM_*`
- `CHK_D01_Compliance_*`

**Preuves typiques**
- Minutes de comité, validations, registre risques, décisions d’acceptation (D15), preuves de revue annuelle.

### D02 — IAM / PAM
**Livrables attendus**
- `POL_D02_IAM_PAM_*`
- `STD_D02_MFA_*`
- `STD_D02_PAM_*`
- `CHK_D02_IAM_PAM_*`

**Preuves typiques**
- Exports IdP/MFA, revues d’accès, journaux admin, tickets d’exception.

### D03 — Réseau
**Livrables attendus**
- `POL_D03_NetworkSecurity_*`
- `STD_D03_Segmentation_*`
- `STD_D03_Firewall_*`
- `STD_D03_VPN_ZTNA_*`
- `CHK_D03_Network_*`

**Preuves typiques**
- Configs FW/VPN, revues règles, logs FW/VPN, diagrams.

### D04 — Cloud & DevSecOps
**Livrables attendus**
- `POL_D04_CloudSecurity_*`
- `STD_D04_CloudIAM_*`
- `STD_D04_IaC_Security_*`
- `STD_D04_SecretsManagement_*`
- `CHK_D04_CloudDevSecOps_*`

**Preuves typiques**
- Logs CI/CD, scans IaC, config secrets manager, revues IAM.

### D05 — Endpoints
**Livrables attendus**
- `POL_D05_EndpointSecurity_*`
- `STD_D05_Hardening_*`
- `STD_D05_PatchManagement_*`
- `STD_D05_EDR_*`
- `CHK_D05_Endpoints_*`

**Preuves typiques**
- Rapports patching, couverture EDR, journaux EDR, exceptions time-boxed.

### D06 — AppSec / SDLC
**Livrables attendus**
- `POL_D06_AppSec_*`
- `STD_D06_SecureDevelopment_*`
- `STD_D06_VulnerabilityManagement_*`
- `CHK_D06_AppSec_*`

**Preuves typiques**
- Résultats SAST/DAST/dep scan, tickets vuln, preuve de gating.

### D07 — Données
**Livrables attendus**
- `POL_D07_DataProtection_*`
- `STD_D07_DataClassification_*`
- `STD_D07_EncryptionAndKeyManagement_*`
- `STD_D07_BackupAndRecovery_*`
- `CHK_D07_DataProtection_*`

**Preuves typiques**
- Rapports classification, configs chiffrement, tests restore, journaux backup.

### D08 — Conformité & Juridique Cyber
**Livrables attendus**
- `POL_D08_ComplianceLegal_*`
- `STD_D08_RegulatoryObligations_*`
- `STD_D08_IncidentDisclosure_*`
- `STD_D08_EvidenceHandling_*`
- `CHK_D08_ComplianceLegal_*`

**Preuves typiques**
- Chaîne de preuve, exports horodatés, conservation, journalisation accès preuves.

### D09 — Crypto / Trust
**Livrables attendus**
- `POL_D09_CryptoTrust_*`
- `STD_D09_PKI_*`
- `STD_D09_PQC_HybridTLS_*`
- `STD_D09_KeyManagement_HSM_*`
- `CHK_D09_CryptoTrust_*`

**Preuves typiques**
- Inventaire clés/certs, logs KMS/HSM, preuves rotation, configs TLS.

### D10 — SOC / Détection
**Livrables attendus**
- `POL_D10_SOC_Detection_*`
- `STD_D10_SIEM_Logging_*`
- `STD_D10_IncidentResponse_*`
- `STD_D10_DetectionUsecases_*`
- `CHK_D10_SOC_Detection_*`

**Preuves typiques**
- Exports SIEM, couverture logs, tickets incidents, timelines (D14), exécutions playbooks (D13).

### D11 — Identity / Zero Trust
**Livrables attendus**
- `POL_D11_Identity_ZeroTrust_*`
- `STD_D11_ZTNA_*`
- `STD_D11_ContinuousAuth_*`
- `CHK_D11_Identity_ZeroTrust_*`

**Preuves typiques**
- Config ZTNA, logs IdP, preuves re-auth, revues accès.

### D12 — Résilience / Backup
**Livrables attendus**
- `POL_D12_Resilience_*`
- `STD_D12_DRP_*`
- `STD_D12_BCP_*`
- `STD_D12_ImmutableBackups_*`
- `CHK_D12_Resilience_*`

**Preuves typiques**
- Rapports tests restore/DR, preuves immutabilité, inventaire sauvegardes.

### D13 — Orchestration & Automation
**Livrables attendus**
- `POL_D13_Orchestration_Automation_*`
- `STD_D13_Playbooks_IR_SOAR_*`
- `STD_D13_PolicyAsCode_*`
- `STD_D13_Evidence_AuditTrails_*`
- `CHK_D13_Orchestration_Automation_*`

**Preuves typiques**
- Exécutions playbooks, audit trails, approvals, exports.

### D14 — Interface SOC
**Livrables attendus**
- `POL_D14_SOC_Interface_*`
- `STD_D14_Dashboards_KPIs_*`
- `STD_D14_CaseManagement_Workflows_*`
- `STD_D14_AccessControl_UI_*`
- `CHK_D14_SOC_Interface_*`

**Preuves typiques**
- Captures/export dashboards, modèles de tickets, logs actions UI.

### D15 — Risk Engine
**Livrables attendus**
- `POL_D15_RiskEngine_*`
- `STD_D15_RiskScoringModel_*`
- `STD_D15_Control_Evidence_Linkage_*`
- `STD_D15_AI_Assist_Guardrails_*`
- `CHK_D15_RiskEngine_*`

**Preuves typiques**
- Registre risques, décisions, liens contrôles↔preuves, logs IA si autorisé.

### D16 — Supply Chain
**Livrables attendus**
- `POL_D16_SupplyChainSecurity_*`
- `STD_D16_SoftwareProvenance_SLSA_*`
- `STD_D16_SBOM_VEX_Management_*`
- `STD_D16_ArtifactSigning_Verification_*`
- `CHK_D16_SupplyChainSecurity_*`

**Preuves typiques**
- SBOM, VEX, attestations, policies de vérification, logs release.

### D17 — Workload Identity & Attestation
**Livrables attendus**
- `POL_D17_WorkloadIdentity_*`
- `STD_D17_WorkloadIdentity_*`
- `STD_D17_Attestation_RuntimeIntegrity_*`
- `STD_D17_SecretlessAccess_*`
- `CHK_D17_WorkloadIdentity_*`

**Preuves typiques**
- Claims/attestations, logs émission, scans secrets, configs vault/STS.

### D18 — Deception
**Livrables attendus**
- `POL_D18_Deception_*`
- `STD_D18_HoneypotDeployment_*`
- `STD_D18_Honeytokens_Canary_*`
- `STD_D18_DeceptionResponse_Playbooks_*`
- `CHK_D18_Deception_*`

**Preuves typiques**
- Inventaire leurres, tests mensuels, tickets incidents, logs SOAR/SIEM.

## 4. Pointeurs « preuves » (transverse)
- **Tickets & timelines** : D14 (case mgmt) + D10 (IR)
- **Exports SIEM/SOAR & audit trails** : D10 + D13
- **Chaîne de preuve / rétention** : D08
- **SBOM / attestations / release logs** : D16
- **Logs identité & accès** : D02/D11/D17
- **Rapports vuln/patch** : D06/D05
- **DR/restore evidence** : D12

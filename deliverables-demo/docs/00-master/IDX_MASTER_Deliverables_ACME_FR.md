# IDX — MASTER — Index des livrables (D01→D18)

**Organisation :** ACME  
**Version :** 0.2  
**Date :** 2026-02-03

## 1. Objectif
Fournir une table des matières exploitable : quoi existe, à quoi ça sert, et où trouver les preuves.

## 2. Index (résumé)
- **D01 Gouvernance** : politiques ISMS, registre risques, inventaire, TPRM, checklists.
- **D02 IAM/PAM** : politique IAM, MFA, PAM, checklist.
- **D03 Réseau** : segmentation, FW, VPN/ZTNA, checklist.
- **D04 Cloud/DevSecOps** : IAM cloud, IaC, secrets, checklist.
- **D05 Endpoints** : hardening, patching, EDR, checklist.
- **D06 AppSec** : secure dev, vuln mgmt, checklist.
- **D07 Data** : classification, chiffrement/keys, backup, checklist.
- **D08 Compliance/Legal** : obligations, disclosure, evidence handling, checklist.
- **D09 Crypto/Trust** : PKI, PQC/hybrid TLS, HSM/keys, checklist.
- **D10 SOC** : SIEM/logging, IR, use cases, checklist.
- **D11 Identity/ZT** : ZTNA, auth continue, checklist.
- **D12 Résilience** : DRP, BCP, backups immuables, checklist.
- **D13 Orchestration** : policy-as-code, playbooks SOAR, audit trails, checklist.
- **D14 Interface SOC** : dashboards KPI, case mgmt, RBAC UI, checklist.
- **D15 Risk Engine** : scoring, evidence linkage, guardrails IA, checklist.
- **D16 Supply chain** : SBOM/VEX, provenance, signing, checklist.
- **D17 Workload Identity** : secretless, attestation, checklist.
- **D18 Deception** : honeypots, honeytokens/canary, playbooks, checklist.

## 3. Où sont les livrables
- Générés via `gen` dans `docs/<domain>/` (ou `deliverables-demo/docs/<domain>/` pour les démos).

## 4. Où sont les preuves
- Tickets (D14/D10), exports SIEM/SOAR (D10/D13), artefacts SBOM/attestations (D16), journaux d’accès (D02/D11/D17), rapports patch/vuln (D05/D06), preuves DR/backups (D12).

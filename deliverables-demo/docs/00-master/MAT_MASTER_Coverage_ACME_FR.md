# MAT — MASTER — Matrice de couverture (baseline vs régulé)

**Organisation :** ACME  
**Version :** 0.3 (durci)  
**Date :** 2026-02-03

## 1. But
Rendre la couverture lisible **et audit-ready** sans table : pour chaque domaine, rappeler Policy/Standards/Checklist + **SLA/Seuils clés** + **rétentions minimales** (baseline vs régulé).

> Note : Les valeurs ci-dessous sont des **cibles par défaut** (à adapter par criticité, contraintes légales et contexte). Les exigences « régulé » s’appliquent aux périmètres critiques.

## 2. Matrice (par domaine)
- **D01 Gouvernance** : POL + STD + CHK
  - SLA/Seuils : revue policies ≥ annuelle ; exceptions time-boxed ≤ 30j.
  - Rétention : décisions/approbations ≥ 1 an (régulé ≥ 3 ans).
- **D02 IAM/PAM** : POL + STD + CHK
  - SLA/Seuils : MFA 100% comptes à privilèges ; revue accès privilèges ≥ mensuelle (régulé).
  - Rétention : logs auth/admin ≥ 180j (régulé ≥ 1 an).
- **D03 Réseau** : POL + STD + CHK
  - SLA/Seuils : changements FW/segmentation approuvés ; règles orphelines = 0.
  - Rétention : logs FW/VPN ≥ 90j (régulé ≥ 180j).
- **D04 Cloud/DevSecOps** : POL + STD + CHK
  - SLA/Seuils : secrets hors repo = 100% ; IaC scan en PR = 100%.
  - Rétention : logs CI/CD ≥ 90j (régulé ≥ 180j).
- **D05 Endpoints** : POL + STD + CHK
  - SLA/Seuils : patch critique ≤ 7j (régulé ≤ 72h) ; couverture EDR ≥ 95% (régulé ≥ 99%).
  - Rétention : télémétrie EDR ≥ 30j (régulé ≥ 90j).
- **D06 AppSec** : POL + STD + CHK
  - SLA/Seuils : SAST/DAST en pipeline ; vuln critique corrigée/mitigée ≤ 7j (régulé ≤ 72h).
  - Rétention : rapports scans/releases ≥ 1 an (régulé ≥ 3 ans).
- **D07 Données** : POL + STD + CHK
  - SLA/Seuils : données classifiées ; chiffrement en transit/au repos pour sensibles.
  - Rétention : preuves backups/tests restore ≥ 1 an (régulé ≥ 3 ans).
- **D08 Compliance/Legal (preuves)** : POL + STD + CHK
  - SLA/Seuils : chaîne de preuve documentée ; demandes légales traitées selon délais.
  - Rétention : preuves incidents ≥ 1 an (régulé ≥ 3 ans) + intégrité.
- **D09 Crypto/Trust** : POL + STD + CHK
  - SLA/Seuils : rotation clés au moins annuelle (régulé ≤ 6 mois) ; usages HSM/KMS.
  - Rétention : journaux PKI/KMS/HSM ≥ 180j (régulé ≥ 1 an).
- **D10 SOC / Détection & Réponse** : POL + STD + CHK
  - SLA/Seuils : MTTD/MTTR suivis ; triage critique ≤ 1h ; couverture logs critiques = 100%.
  - Rétention : logs SIEM ≥ 180j (régulé ≥ 1 an).
- **D11 Identity / Zero Trust** : POL + STD + CHK
  - SLA/Seuils : ZTNA pour accès distants ; re-auth actions sensibles.
  - Rétention : logs ZTNA/IdP ≥ 180j (régulé ≥ 1 an).
- **D12 Résilience (BCP/DR/Backups)** : POL + STD + CHK
  - SLA/Seuils : RPO/RTO définis ; test restore ≥ trimestriel ; test DR ≥ annuel.
  - Rétention : rapports tests ≥ 3 ans.
- **D13 Orchestration / Policy-as-Code** : POL + STD + CHK
  - SLA/Seuils : playbooks versionnés ; approvals pour actions critiques ; exécution traçable.
  - Rétention : audit trails SOAR/workflows ≥ 180j (régulé ≥ 1 an).
- **D14 Interface SOC** : POL + STD + CHK
  - SLA/Seuils : workflow cases + champs obligatoires ; two-person pour clôture critique (régulé).
  - Rétention : logs UI ≥ 90j (régulé ≥ 180j).
- **D15 Risk Engine** : POL + STD + CHK
  - SLA/Seuils : acceptation risque ≤ 90j (régulé ≤ 60j) ; revue risques ≥ 16 (1–25) hebdo.
  - Rétention : décisions + justifications ≥ 1 an (régulé ≥ 3 ans).
- **D16 Supply chain (SBOM/Provenance/Signing)** : POL + STD + CHK
  - SLA/Seuils : SBOM 100% releases prod ; artefacts prod signés + vérifiés ; vuln critique ≤ 7j (régulé ≤ 72h).
  - Rétention : SBOM/attestations/logs release ≥ 1 an (régulé ≥ 3 ans).
- **D17 Workload Identity / Attestation** : POL + STD + CHK
  - SLA/Seuils : tokens/certs ≤ 24h (régulé ≤ 1h) ; 0 secret statique non inventorié.
  - Rétention : logs émission/attestation ≥ 180j (régulé ≥ 1 an).
- **D18 Deception** : POL + STD + CHK
  - SLA/Seuils : tout trigger = ticket + timeline ; playbook auto ≤ 30 min ; tests mensuels.
  - Rétention : logs deception ≥ 180j (régulé ≥ 1 an).

## 3. RACI (gabarit)
- **R**: Owner domaine (IT/Cloud/SecOps)
- **A**: RSSI/CISO
- **C**: Risk/Legal/Privacy
- **I**: Direction / Métiers

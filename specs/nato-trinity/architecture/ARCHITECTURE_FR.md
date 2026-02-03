# NATO Trinity — Blueprint Technique (FR)

**Status:** Draft 0.1  
**Date:** {{today}}  
**Source spec:** `specs/nato-trinity/NATO_Trinity_Spec_v1.0_FR-EN.md` (v1.0.1)

## 1. Vue d’ensemble
NATO Trinity est une plateforme composée de 3 briques :
1) **Risk Engine** (registre, scoring, décisions, exceptions)  
2) **Policy-as-Code Orchestrator** (gates CI/CD, workflows, approvals, exécution traçable)  
3) **Evidence Engine** (collecte, normalisation, intégrité, rétention, exports audit)

Objectif : rendre les contrôles **exécutables** et les preuves **auditables**.

## 2. Architecture logique (modules)
### 2.1 Services / modules
- **API Gateway** : authentification, routage, rate-limiting, validation.
- **AuthZ / RBAC** : rôles, SoD, décisions two-person.
- **Risk Service** : Risk/Decision/Exception, règles d’expiration, liens.
- **Policy Service** : définition des gates + policy refs + versioning.
- **Orchestrator Service** : exécution playbooks/gates, exécution traçable.
- **Evidence Service** : ingestion, hashing/signature, chain-of-custody, packaging.
- **Case Connector** : intégration ITSM/SOC (D14).
- **Collectors** : connecteurs IdP/SIEM/CI/Registry/KMS…

### 2.2 Stockages
- **DB relationnelle** (ou document) : objets Risk/Decision/Exception/Gate/GateResult/Case refs.
- **Object storage** : preuves brutes (exports, logs, rapports) + manifests.
- **WORM storage (régulé)** : bucket immuable ou système équivalent.
- **Search index** : recherche par risk/case/control/asset, métadonnées preuve.

## 3. Flux principaux (texte)
### 3.1 Flux CI/CD (supply chain)
1) CI produit build + artefacts
2) Génération SBOM + attestation provenance
3) Signature artefacts
4) Exécution Gate (Policy-as-Code)
5) Evidence Engine ingère : logs CI, SBOM, attestations, signature, GateResult
6) En cas de fail : création/lien d’un case/ticket ≤ 24h (REQ-TRI-008)

### 3.2 Flux risque
1) Création Risk (owner)
2) Liens control/evidence
3) Decision (approve) avec expiry si accept (REQ-TRI-003)
4) EvidencePackage exportable (REQ-TRI-004)

### 3.3 Flux incident
1) Alert SIEM
2) Case créé (D14)
3) Orchestrator lance playbook (D13)
4) Evidence capture + chain-of-custody
5) Export audit pack si requis

## 4. Modèle de sécurité (résumé)
- AuthN via IdP (OIDC/SAML) + MFA pour privilégiés.
- AuthZ RBAC + SoD.
- Audit trails : actions sensibles journalisées (REQ-TRI-006).
- Clés dans KMS/HSM ; rotation (baseline ≥ annuel, régulé ≤ 6 mois).
- Evidence immuable en régulé (REQ-TRI-005).

## 5. NFR (résumé)
- Disponibilité cible (à définir), performance recherche EvidencePackage < 5s.
- Backups DB + object storage, tests restore.

## 6. Livrables de ce dossier
- `diagrams/` : diagrammes ASCII/mermaid
- `schemas/` : schémas JSON v0
- `adr/` : décisions d’architecture

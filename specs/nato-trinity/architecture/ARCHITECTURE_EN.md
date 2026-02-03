# NATO Trinity — Technical Blueprint (EN)

**Status:** Draft 0.1  
**Date:** {{today}}  
**Source spec:** `specs/nato-trinity/NATO_Trinity_Spec_v1.0_FR-EN.md` (v1.0.1)

## 1. Overview
NATO Trinity is a platform composed of 3 building blocks:
1) **Risk Engine** (register, scoring, decisions, exceptions)  
2) **Policy-as-Code Orchestrator** (CI/CD gates, workflows, approvals, traceable execution)  
3) **Evidence Engine** (collection, normalization, integrity, retention, audit exports)

Goal: make controls **executable** and evidence **audit-ready**.

## 2. Logical architecture (modules)
### 2.1 Services / modules
- **API Gateway**: authentication, routing, rate limiting, validation.
- **AuthZ / RBAC**: roles, SoD, two-person decisions.
- **Risk Service**: Risk/Decision/Exception, expiry rules, linkages.
- **Policy Service**: gate definitions + policy refs + versioning.
- **Orchestrator Service**: playbook/gate execution, traceable execution.
- **Evidence Service**: ingestion, hashing/signing, chain-of-custody, packaging.
- **Case Connector**: ITSM/SOC integration (D14).
- **Collectors**: connectors for IdP/SIEM/CI/Registry/KMS…

### 2.2 Storage
- **Relational DB** (or document DB): Risk/Decision/Exception/Gate/GateResult/Case references.
- **Object storage**: raw evidence (exports, logs, reports) + manifests.
- **WORM storage (regulated)**: immutable bucket or equivalent system.
- **Search index**: search by risk/case/control/asset and evidence metadata.

## 3. Primary flows (text)
### 3.1 CI/CD flow (supply chain)
1) CI produces build + artifacts
2) Generate SBOM + provenance attestation
3) Sign artifacts
4) Run Gate (Policy-as-Code)
5) Evidence Engine ingests: CI logs, SBOM, attestations, signature, GateResult
6) On fail: create/link a case/ticket within ≤ 24h (REQ-TRI-008)

### 3.2 Risk flow
1) Create Risk (owner)
2) Link controls/evidence
3) Decision (approve) with expiry when accept (REQ-TRI-003)
4) EvidencePackage exportable (REQ-TRI-004)

### 3.3 Incident flow
1) SIEM alert
2) Case created (D14)
3) Orchestrator runs playbook (D13)
4) Evidence capture + chain-of-custody
5) Export audit pack when required

## 4. Security model (summary)
- AuthN via IdP (OIDC/SAML) + MFA for privileged roles.
- AuthZ RBAC + SoD.
- Audit trails: sensitive actions logged (REQ-TRI-006).
- Keys in KMS/HSM; rotation (baseline ≥ yearly, regulated ≤ 6 months).
- Evidence immutability in regulated mode (REQ-TRI-005).

## 5. NFR (summary)
- Target availability (to define), EvidencePackage search performance < 5s.
- Backups for DB + object storage, restore tests.

## 6. Deliverables in this folder
- `diagrams/`: diagrams (Mermaid)
- `schemas/`: JSON Schemas v0
- `adr/`: architecture decisions
- `runbooks/`: operational runbooks

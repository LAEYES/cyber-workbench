# NASO Trinity Spec v1.0 (FR + EN)

**Status:** Draft v1.0  
**Owner:** {{org}} (programme)  
**Date:** {{today}}  

---

# FR — Spécification

## 0. Meta
### 0.1 Objet (normatif)
Ce document définit les exigences **normatives** de “NASO Trinity” : périmètre, définitions, exigences « en dur » (seuils/SLA, pass/fail), artefacts attendus, et règles de preuve (intégrité, rétention, export).

### 0.2 Périmètre
NASO Trinity couvre 3 briques (la “Trinity”) :
1) **Risk Engine** (risques, décisions, exceptions)  
2) **Policy-as-Code Orchestrator** (gates, playbooks, approvals)  
3) **Evidence Engine** (collecte, chain-of-custody, intégrité/WORM, rétention, exports)

Il s’aligne sur un programme cyber plus large (D01→D18) mais ne duplique pas les politiques/standards spécifiques de chaque domaine ; il fournit un cadre commun et des exigences transverses.

### 0.3 Hors périmètre (v1.0)
- Remplacement complet d’un SIEM/EDR/IdP/ITSM existant (NASO s’intègre).
- Fonctionnalités d’investigation avancées type “data lake SOC” (optionnel).
- Déploiement d’agent endpoint propriétaire (préférer intégrations).

### 0.4 Audience
- RSSI/CISO, Risk Manager, Compliance/Legal, SecOps/SOC, Cloud/Platform/DevOps, Audit interne.

### 0.5 Définitions (extraits)
- **Evidence (Preuve)** : artefact vérifiable (log, export, config, ticket, attestation, SBOM, capture) prouvant l’exécution d’un contrôle ou d’une décision.
- **Chain-of-custody** : traçabilité complète de création, accès, modification, export des preuves.
- **Gate (Policy-as-code)** : règle automatisée bloquante/non-bloquante appliquée à un flux (CI/CD, accès, déploiement).
- **Exception** : dérogation time-boxed à une exigence, approuvée et justifiée.

### 0.6 Référentiels (alignement license-safe)
NASO Trinity peut s’aligner sur ISO/NIST/CIS via **métadonnées et mappings** (identifiants, titres, relations) sans reproduire des contenus sous licence.

---

## 1. Vision “NASO Trinity”
### 1.1 Problème
- Décisions de sécurité dispersées (risques, exceptions, incidents) et peu auditables.
- Collecte de preuves manuelle, non homogène, coûteuse.
- Contrôles “papier” sans exécution ni gates mesurables.

### 1.2 Principes non négociables
- **Mesurable** : exigences exprimées en seuils/SLA et critères pass/fail.
- **Traçable** : toute action/décision/exception/incident laisse une trace exploitable (audit trails).
- **Moindre privilège** : humain et machine, avec séparation des tâches.
- **Default-deny** : refus par défaut pour les flux critiques si preuve/gate non satisfaite.
- **Evidence-first** : un contrôle sans preuve attendue est incomplet.

### 1.3 Baseline vs Régulé
- **Baseline** : exigences minimales pour un niveau de contrôle robuste.
- **Régulé** : exigences renforcées sur périmètres critiques (intégrité/WORM, two-person rule, rétentions plus longues, attestations/signatures).

---

## 2. Périmètre fonctionnel (capabilities)
### 2.1 Risk Engine
- Registre risques (id, owner, scoring, statut, échéance).
- Décisions : traiter/éviter/transférer/accepter.
- Exceptions : time-boxed, justification, plan, re-approval.
- Lien obligatoire : **risque ↔ contrôles ↔ preuves ↔ incidents/cases**.

### 2.2 Policy-as-Code Orchestrator
- Gates CI/CD (quality/security), gates d’accès et de déploiement.
- Playbooks SOAR / workflows (triage, containment, evidence capture).
- Approvals : single approver ou two-person rule selon criticité.
- Traçabilité d’exécution : input, résultat, timestamps, identités.

### 2.3 Evidence Engine
- Ingestion (exports SIEM/SOAR/IdP/CI/CD, SBOM/attestations, rapports patch/vuln).
- Normalisation (métadonnées, horodatage, hashing/signature si applicable).
- Intégrité : protection contre altération (WORM en régulé).
- Rétention/purge : règles par type d’artefact + legal hold.
- Exports audit : paquet de preuves (EvidencePackage) + manifeste.

### 2.4 UI / Navigation (minimale)
- Recherche par : risque, contrôle, incident, application, owner.
- Vue “audit pack” : exporter l’ensemble des preuves liées.

---

## 3. Acteurs & rôles (RACI + SoD)
### 3.1 Rôles humains (minimum)
- **Viewer** : lecture.
- **Analyst** : triage/cases, collecte preuves, exécutions playbooks non critiques.
- **IR Lead** : décisions opérationnelles incident, escalade, actions critiques.
- **Risk Owner** : propriétaire du risque, propose traitement/acceptation.
- **Approver** : valide exceptions/acceptations (RSSI/CISO ou délégation).
- **Admin** : configuration intégrations/policies (sous contrôle).
- **Auditor** : accès lecture + export audit packs.

### 3.2 Séparation des tâches (SoD)
- Un **Admin** ne doit pas pouvoir supprimer des preuves sans contrôle (interdit en baseline ; en régulé: impossible ou two-person rule + WORM).
- Un **Risk Owner** ne peut pas approuver sa propre acceptation de risque (two-person).

### 3.3 Two-person rule (régulé)
Obligatoire pour :
- clôture d’incident critique,
- suppression/purge de preuves,
- acceptation de risques critiques,
- désactivation de gates critiques.

---

# EN — Specification

## 0. Meta
### 0.1 Purpose (normative)
This document defines the **normative** requirements of “NASO Trinity”: scope, definitions, “hard” requirements (thresholds/SLAs, pass/fail), expected artifacts, and evidence rules (integrity, retention, exports).

### 0.2 Scope
NASO Trinity covers 3 core building blocks (the “Trinity”):
1) **Risk Engine** (risks, decisions, exceptions)  
2) **Policy-as-Code Orchestrator** (gates, playbooks, approvals)  
3) **Evidence Engine** (collection, chain-of-custody, integrity/WORM, retention, exports)

It aligns with a broader cyber program (D01→D18) but does not duplicate per-domain policies/standards; it provides a common framework and cross-cutting requirements.

### 0.3 Out of scope (v1.0)
- Full replacement of an existing SIEM/EDR/IdP/ITSM (NASO integrates with them).
- Advanced SOC data lake / hunting platform (optional).
- A proprietary endpoint agent (prefer integrations).

### 0.4 Audience
- CISO, Risk Manager, Compliance/Legal, SecOps/SOC, Cloud/Platform/DevOps, Internal Audit.

### 0.5 Definitions (extract)
- **Evidence**: verifiable artifact (log, export, config, ticket, attestation, SBOM, screenshot) proving a control execution or decision.
- **Chain-of-custody**: full traceability of evidence creation, access, modification, export.
- **Gate (policy-as-code)**: automated blocking/non-blocking rule applied to a flow (CI/CD, access, deployment).
- **Exception**: time-boxed deviation from a requirement, approved and justified.

### 0.6 Framework alignment (license-safe)
NASO Trinity can align with ISO/NIST/CIS via **metadata and mappings** (ids, titles, relations) without reproducing licensed text.

---

## 1. “NASO Trinity” vision
### 1.1 Problem
- Security decisions spread across tools (risks, exceptions, incidents) and not audit-ready.
- Manual evidence collection, inconsistent and expensive.
- “Paper controls” with no execution and no measurable gates.

### 1.2 Non-negotiable principles
- **Measurable**: requirements expressed as thresholds/SLAs and pass/fail criteria.
- **Traceable**: every action/decision/exception/incident produces usable audit trails.
- **Least privilege**: human and machine identities, with separation of duties.
- **Default-deny**: deny-by-default for critical flows when gate/evidence is missing.
- **Evidence-first**: a control without expected evidence is incomplete.

### 1.3 Baseline vs Regulated
- **Baseline**: minimal requirements for robust control.
- **Regulated**: stronger requirements on critical scope (WORM, two-person rule, longer retention, attestations/signatures).

---

## 2. Functional scope (capabilities)
### 2.1 Risk Engine
- Risk register (id, owner, scoring, status, due date).
- Decisions: treat/avoid/transfer/accept.
- Exceptions: time-boxed, rationale, plan, re-approval.
- Mandatory linkage: **risk ↔ controls ↔ evidence ↔ incidents/cases**.

### 2.2 Policy-as-Code Orchestrator
- CI/CD gates (quality/security), access and deployment gates.
- SOAR playbooks / workflows (triage, containment, evidence capture).
- Approvals: single approver or two-person rule depending on criticality.
- Execution traceability: inputs, outcome, timestamps, identities.

### 2.3 Evidence Engine
- Ingestion (SIEM/SOAR/IdP/CI exports, SBOM/attestations, patch/vuln reports).
- Normalization (metadata, timestamps, hashing/signature when applicable).
- Integrity: tamper protection (WORM in regulated mode).
- Retention/purge: per-artifact rules + legal hold.
- Audit exports: evidence package + manifest.

### 2.4 UI / Navigation (minimal)
- Search by: risk, control, incident, application, owner.
- “Audit pack” view: export all linked evidence.

---

## 3. Actors & roles (RACI + SoD)
### 3.1 Human roles (minimum)
- **Viewer**: read-only.
- **Analyst**: triage/cases, evidence collection, non-critical playbook runs.
- **IR Lead**: incident operational decisions, escalation, critical actions.
- **Risk Owner**: owns risk, proposes treatment/acceptance.
- **Approver**: validates exceptions/acceptances (CISO or delegated).
- **Admin**: config integrations/policies (under controls).
- **Auditor**: read-only + audit pack export.

### 3.2 Separation of duties (SoD)
- **Admins** must not be able to delete evidence without control (prohibited in baseline; in regulated: impossible or two-person + WORM).
- **Risk Owners** cannot approve their own risk acceptance (two-person).

### 3.3 Two-person rule (regulated)
Mandatory for:
- closing critical incidents,
- evidence deletion/purge,
- accepting critical risks,
- disabling critical gates.

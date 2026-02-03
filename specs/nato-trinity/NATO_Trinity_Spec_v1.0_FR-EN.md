# NATO Trinity Spec v1.0.1 (FR + EN)

**Status:** Draft v1.0.1  
**Owner:** {{org}} (programme)  
**Date:** {{today}}  

---

# FR — Spécification

## 0. Meta
### 0.0 Terminologie normative
Les mots-clés **MUST / SHOULD / MAY** sont à interpréter selon RFC 2119.

### 0.0.1 Identifiants d’exigences
Les exigences normatives sont identifiées sous la forme `REQ-TRI-XXX`.

### 0.1 Objet (normatif)
Ce document définit les exigences **normatives** de “NATO Trinity” : périmètre, définitions, exigences « en dur » (seuils/SLA, pass/fail), artefacts attendus, et règles de preuve (intégrité, rétention, export).

### 0.2 Périmètre
NATO Trinity couvre 3 briques (la “Trinity”) :
1) **Risk Engine** (risques, décisions, exceptions)  
2) **Policy-as-Code Orchestrator** (gates, playbooks, approvals)  
3) **Evidence Engine** (collecte, chain-of-custody, intégrité/WORM, rétention, exports)

Il s’aligne sur un programme cyber plus large (D01→D18) mais ne duplique pas les politiques/standards spécifiques de chaque domaine ; il fournit un cadre commun et des exigences transverses.

### 0.3 Hors périmètre (v1.0)
- Remplacement complet d’un SIEM/EDR/IdP/ITSM existant (NATO s’intègre).
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
NATO Trinity peut s’aligner sur ISO/NIST/CIS via **métadonnées et mappings** (identifiants, titres, relations) sans reproduire des contenus sous licence.

---

## 1. Vision “NATO Trinity”
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

## 4. Modèle de données (normatif)
### 4.1 Exigences transverses
- Tous les objets MUST avoir : `id`, `type`, `createdAt`, `createdBy`, `updatedAt` (si modifiable).
- Tous les objets MUST être **versionnés** (au minimum `version` incrémentée à chaque changement).
- Tous les liens MUST être explicites (IDs) et auditables (qui a lié, quand).

### 4.2 Objets — Risk Engine
#### 4.2.1 Risk
- Champs minimum : `riskId`, `title`, `description`, `owner`, `likelihood(1-5)`, `impact(1-5)`, `score(1-25)`, `status`, `dueDate`, `treatment`.
- `score` MUST = `likelihood * impact`.

#### 4.2.2 Decision
- Types : `treat | avoid | transfer | accept`.
- Champs minimum : `decisionId`, `riskId`, `decisionType`, `rationale`, `approvedBy`, `approvedAt`, `expiryDate` (si accept).

#### 4.2.3 Exception
- Champs minimum : `exceptionId`, `requirementRef`, `scope`, `rationale`, `approvedBy`, `approvedAt`, `expiryDate`, `remediationPlan`.
- `expiryDate` MUST être défini et ≤ 30 jours par défaut (modifiable via politique).

### 4.3 Objets — Policy-as-Code Orchestrator
#### 4.3.1 Gate
- Champs minimum : `gateId`, `name`, `scope`, `mode(blocking|advisory)`, `severity`, `policyRef`, `enabled`.

#### 4.3.2 GateResult
- Champs minimum : `gateResultId`, `gateId`, `targetRef` (build/deploy/access), `status(pass|fail|warn)`, `executedAt`, `evidenceRefs[]`.

#### 4.3.3 Playbook
- Champs minimum : `playbookId`, `name`, `trigger`, `steps[]`, `approvalsRequired`.

#### 4.3.4 ExecutionTrace
- Champs minimum : `executionId`, `playbookId|gateId`, `triggerEventId`, `inputs`, `outputs`, `startedAt`, `endedAt`, `runAs`, `logsRef`.

### 4.4 Objets — Evidence Engine
#### 4.4.1 Evidence
- Types : `logExport | configSnapshot | ticket | report | sbom | vex | attestation | signature | screenshot`.
- Champs minimum : `evidenceId`, `type`, `sourceSystem`, `collectedAt`, `collectorId`, `hash`, `storageRef`, `retentionClass`.

#### 4.4.2 ChainOfCustodyEvent
- Champs : `eventId`, `evidenceId`, `action(create|access|export|legalHold|purge)`, `actor`, `timestamp`, `details`.

#### 4.4.3 EvidencePackage
- Champs minimum : `packageId`, `scopeRef` (risk/case/control), `evidenceRefs[]`, `manifestHash`, `exportedAt`, `exportedBy`.

### 4.5 Objets — Case/Incident (liaison)
#### 4.5.1 Case
- Champs minimum : `caseId`, `severity`, `status`, `owner`, `createdAt`, `triagedAt`, `containedAt`, `closedAt`, `timelineRefs[]`, `evidenceRefs[]`, `riskRefs[]`.

### 4.6 Liens obligatoires (pass/fail)
- Tout **Risk** MUST avoir ≥ 1 `controlRef` OU justification explicite "no control".
- Tout **Decision accept** MUST avoir `expiryDate` + `approvedBy` ≠ `risk.owner`.
- Tout **GateResult fail** MUST créer ou lier un `Case` (ou ticket) sous 24h.
- Tout **EvidencePackage** MUST inclure un manifeste (hash) et lister précisément les preuves.

---

## 5. Exigences “en dur” (pass/fail)
### 5.1 Logging & traçabilité (baseline)
- Les actions Admin/Approver/IR Lead MUST être journalisées.
- Les journaux MUST inclure : actor, action, objet, horodatage, résultat.

### 5.2 Rétention (baseline vs régulé)
- Baseline : logs critiques ≥ 180j ; preuves incidents ≥ 1 an.
- Régulé : logs critiques ≥ 1 an ; preuves incidents/décisions ≥ 3 ans ; WORM pour preuves critiques.

### 5.3 SLA par défaut (baseline)
- Triage incident critique ≤ 1h.
- Vuln critique corrigée/mitigée ≤ 7j.
- Patch critique ≤ 7j.

### 5.4 SLA par défaut (régulé)
- Triage incident critique ≤ 1h (inchangé) + containment initial ≤ 4h.
- Vuln critique corrigée/mitigée ≤ 72h.
- Patch critique ≤ 72h.

### 5.5 Exceptions
- Toute exception MUST être time-boxed, approuvée, justifiée et liée à une preuve.

---

## 6. Interfaces & intégrations (normatives)
### 6.1 Entrées minimales
- IdP (auth/MFA/RBAC exports)
- SIEM (exports logs + alertes)
- CI/CD (logs build, artefacts, results gates)
- Supply chain (SBOM, attestations, signatures)

### 6.2 Formats
- JSON/YAML recommandés.
- Schémas versionnés ; validation automatique en CI.

---

## 7. Workflows end-to-end
### 7.1 Flux Risk → Decision → Evidence
1) Créer Risk
2) Lier contrôles et preuves
3) Produire Decision (accept/treat…)
4) Générer EvidencePackage pour audit

### 7.2 Flux CI/CD Gate → Release
1) Build
2) Générer SBOM
3) Signer artefact
4) Exécuter Gate (pass/fail)
5) Stocker preuves + attestation

### 7.3 Flux Incident → Case → Containment → Evidence
1) Alert
2) Case (D14)
3) Orchestration actions (D13)
4) Capture preuves (D08)
5) Clôture + post-mortem

---

## 8. Sécurité de la plateforme
### 8.1 Exigences d’authentification & autorisation
- Authentification MUST être basée sur un IdP (OIDC/SAML) avec MFA pour rôles à privilèges.
- Autorisation MUST être RBAC avec séparation des tâches (SoD) et journalisation.

### 8.2 Journalisation & non-répudiation
- Toutes les actions sensibles (approvals, désactivation gates, exports, purge) MUST générer un audit event.
- Les exports audit MUST être signés et/ou hashés avec manifeste.

### 8.3 Cryptographie & clés
- Les secrets/clé de signature MUST être stockés via KMS/HSM.
- Rotation clés : ≥ annuelle (baseline), ≤ 6 mois (régulé) ou sur incident.

### 8.4 Confidentialité & minimisation
- Les preuves MUST être classifiées (au minimum: public/interne/sensible).
- Les exports MUST supporter redaction (masquage) quand requis.

---

## 9. Observabilité & conformité
### 9.1 KPIs minimum
- Couverture logs critiques (cible = 100%).
- Conformité SLA (triage, patch/vuln).
- Complétude evidence (risque/case avec EvidencePackage).

### 9.2 Audit packs
- MUST pouvoir exporter un EvidencePackage par : risque, case, contrôle, période.
- MUST inclure un manifeste (hash) + liste exhaustive des preuves.

### 9.3 Rétention, purge, legal hold
- Purge MUST être contrôlée (baseline: approver; régulé: two-person + WORM/immutabilité selon classe).
- Legal hold MUST bloquer purge/export non autorisé.

---

## 10. Exigences non-fonctionnelles (NFR)
- **Disponibilité** : définir cible (ex. 99.9%) pour composants critiques.
- **Performance** : recherche EvidencePackage < 5s sur périmètre nominal.
- **Scalabilité** : ingestion logs/exports extensible.
- **Souveraineté/portabilité** : déploiement possible on-prem ou cloud contrôlé.

---

## 11. Critères d’acceptation (Definition of Done)
### 11.1 DoD Baseline
- Risk Engine opérationnel (registre + décisions + exceptions time-boxed).
- Gates CI/CD minimales + traçabilité d’exécution.
- Evidence Engine : ingestion + hashing/manifeste + exports audit.
- Pass/fail : 0 item critique en échec sur CHK_MASTER_AuditReadiness (ou équivalent).

### 11.2 DoD Régulé
- Two-person rule sur actions critiques.
- WORM / immutabilité pour preuves critiques.
- Rétentions renforcées appliquées et vérifiables.

---

## 12. Annexes
- A) Glossaire étendu
- B) Tables de valeurs par défaut (SLA/rétention) — format liste (pas de tables)
- C) Mapping capability → domaines D01..D18

---

## 13. Annexes (FR)
### Annexe A — Exigences (liste REQ-TRI)
- **REQ-TRI-001** : NATO Trinity MUST couvrir Risk Engine, Policy-as-Code Orchestrator, Evidence Engine.
- **REQ-TRI-002** : Toute exception MUST être time-boxed et approuvée.
- **REQ-TRI-003** : Toute acceptation de risque MUST avoir une date d’expiration.
- **REQ-TRI-004** : Les preuves critiques MUST être exportables avec manifeste (hash).
- **REQ-TRI-005** : En mode régulé, les preuves critiques MUST être immuables (WORM) ou équivalent.
- **REQ-TRI-006** : Les actions sensibles MUST être journalisées (actor, action, objet, timestamp, résultat).
- **REQ-TRI-007** : Un Risk Owner MUST NOT approuver sa propre acceptation de risque.
- **REQ-TRI-008** : Tout GateResult=fail MUST créer ou lier un case/ticket ≤ 24h.

### Annexe B — Valeurs par défaut (SLA & rétention)
- **Triage incident critique** : ≤ 1h (baseline), ≤ 1h + containment initial ≤ 4h (régulé)
- **Patch critique** : ≤ 7j (baseline), ≤ 72h (régulé)
- **Vuln critique** : ≤ 7j (baseline), ≤ 72h (régulé)
- **Logs critiques (SIEM/SOAR/IdP/ZTNA)** : ≥ 180j (baseline), ≥ 1 an (régulé)
- **Preuves incidents/décisions** : ≥ 1 an (baseline), ≥ 3 ans (régulé)
- **Releases/SBOM/attestations** : ≥ 1 an (baseline), ≥ 3 ans (régulé)
- **Tests DR/restore** : ≥ 3 ans

### Annexe C — Mapping capability → D01..D18
- **Risk Engine** : D01, D15, D08
- **Policy-as-Code Orchestrator** : D04, D06, D10, D13, D16, D18
- **Evidence Engine** : D08, D10, D13, D14, D16, D12

### Annexe D — Scénarios de test (Given/When/Then)
- **TEST-TRI-01 (Risk acceptance expiry)**
  - Given un risque en statut "accept"
  - When une décision d’acceptation est créée
  - Then `expiryDate` est obligatoire et `approvedBy` ≠ owner
- **TEST-TRI-02 (Gate fail creates case)**
  - Given un gate bloquant
  - When le résultat est "fail"
  - Then un case/ticket est créé/lien ≤ 24h et une preuve (GateResult) est liée
- **TEST-TRI-03 (Audit package integrity)**
  - Given un EvidencePackage exporté
  - When le manifeste est vérifié
  - Then les hashes correspondent et la liste des preuves est exhaustive

---

# EN — Specification

## 0. Meta
### 0.0 Normative terminology
The keywords **MUST / SHOULD / MAY** are to be interpreted per RFC 2119.

### 0.0.1 Requirement identifiers
Normative requirements are identified as `REQ-TRI-XXX`.

### 0.1 Purpose (normative)
This document defines the **normative** requirements of “NATO Trinity”: scope, definitions, “hard” requirements (thresholds/SLAs, pass/fail), expected artifacts, and evidence rules (integrity, retention, exports).

### 0.2 Scope
NATO Trinity covers 3 core building blocks (the “Trinity”):
1) **Risk Engine** (risks, decisions, exceptions)  
2) **Policy-as-Code Orchestrator** (gates, playbooks, approvals)  
3) **Evidence Engine** (collection, chain-of-custody, integrity/WORM, retention, exports)

It aligns with a broader cyber program (D01→D18) but does not duplicate per-domain policies/standards; it provides a common framework and cross-cutting requirements.

### 0.3 Out of scope (v1.0)
- Full replacement of an existing SIEM/EDR/IdP/ITSM (NATO integrates with them).
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
NATO Trinity can align with ISO/NIST/CIS via **metadata and mappings** (ids, titles, relations) without reproducing licensed text.

---

## 1. “NATO Trinity” vision
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

---

## 4. Data model (normative)
### 4.1 Cross-cutting requirements
- All objects MUST have: `id`, `type`, `createdAt`, `createdBy`, `updatedAt` (if mutable).
- All objects MUST be versioned (at least `version` incremented on change).
- All links MUST be explicit (IDs) and auditable (who linked, when).

### 4.2 Objects — Risk Engine
#### 4.2.1 Risk
- Minimum fields: `riskId`, `title`, `description`, `owner`, `likelihood(1-5)`, `impact(1-5)`, `score(1-25)`, `status`, `dueDate`, `treatment`.
- `score` MUST equal `likelihood * impact`.

#### 4.2.2 Decision
- Types: `treat | avoid | transfer | accept`.
- Minimum fields: `decisionId`, `riskId`, `decisionType`, `rationale`, `approvedBy`, `approvedAt`, `expiryDate` (if accept).

#### 4.2.3 Exception
- Minimum fields: `exceptionId`, `requirementRef`, `scope`, `rationale`, `approvedBy`, `approvedAt`, `expiryDate`, `remediationPlan`.
- `expiryDate` MUST be set and ≤ 30 days by default (policy-driven).

### 4.3 Objects — Policy-as-Code Orchestrator
#### 4.3.1 Gate
- Minimum fields: `gateId`, `name`, `scope`, `mode(blocking|advisory)`, `severity`, `policyRef`, `enabled`.

#### 4.3.2 GateResult
- Minimum fields: `gateResultId`, `gateId`, `targetRef` (build/deploy/access), `status(pass|fail|warn)`, `executedAt`, `evidenceRefs[]`.

#### 4.3.3 Playbook
- Minimum fields: `playbookId`, `name`, `trigger`, `steps[]`, `approvalsRequired`.

#### 4.3.4 ExecutionTrace
- Minimum fields: `executionId`, `playbookId|gateId`, `triggerEventId`, `inputs`, `outputs`, `startedAt`, `endedAt`, `runAs`, `logsRef`.

### 4.4 Objects — Evidence Engine
#### 4.4.1 Evidence
- Types: `logExport | configSnapshot | ticket | report | sbom | vex | attestation | signature | screenshot`.
- Minimum fields: `evidenceId`, `type`, `sourceSystem`, `collectedAt`, `collectorId`, `hash`, `storageRef`, `retentionClass`.

#### 4.4.2 ChainOfCustodyEvent
- Fields: `eventId`, `evidenceId`, `action(create|access|export|legalHold|purge)`, `actor`, `timestamp`, `details`.

#### 4.4.3 EvidencePackage
- Minimum fields: `packageId`, `scopeRef` (risk/case/control), `evidenceRefs[]`, `manifestHash`, `exportedAt`, `exportedBy`.

### 4.5 Case/Incident objects (linking)
#### 4.5.1 Case
- Minimum fields: `caseId`, `severity`, `status`, `owner`, `createdAt`, `triagedAt`, `containedAt`, `closedAt`, `timelineRefs[]`, `evidenceRefs[]`, `riskRefs[]`.

### 4.6 Mandatory link rules (pass/fail)
- Every **Risk** MUST have ≥ 1 `controlRef` OR explicit "no control" rationale.
- Every **accept Decision** MUST have `expiryDate` + `approvedBy` ≠ `risk.owner`.
- Every **failed GateResult** MUST create or link to a `Case` (or ticket) within 24h.
- Every **EvidencePackage** MUST include a manifest (hash) and list evidence precisely.

---

## 5. “Hard” requirements (pass/fail)
### 5.1 Logging & traceability (baseline)
- Admin/Approver/IR Lead actions MUST be logged.
- Logs MUST include: actor, action, object, timestamp, outcome.

### 5.2 Retention (baseline vs regulated)
- Baseline: critical logs ≥ 180d; incident evidence ≥ 1y.
- Regulated: critical logs ≥ 1y; incident/decision evidence ≥ 3y; WORM for critical evidence.

### 5.3 Default SLAs (baseline)
- Critical incident triage ≤ 1h.
- Critical vuln fixed/mitigated ≤ 7d.
- Critical patch ≤ 7d.

### 5.4 Default SLAs (regulated)
- Critical triage ≤ 1h (unchanged) + initial containment ≤ 4h.
- Critical vuln fixed/mitigated ≤ 72h.
- Critical patch ≤ 72h.

### 5.5 Exceptions
- Every exception MUST be time-boxed, approved, justified, and linked to evidence.

---

## 6. Interfaces & integrations (normative)
### 6.1 Minimum inputs
- IdP (auth/MFA/RBAC exports)
- SIEM (log exports + alerts)
- CI/CD (build logs, artifacts, gate results)
- Supply chain (SBOM, attestations, signatures)

### 6.2 Formats
- JSON/YAML recommended.
- Versioned schemas; automated validation in CI.

---

## 7. End-to-end workflows
### 7.1 Risk → Decision → Evidence
1) Create Risk
2) Link controls and evidence
3) Produce Decision (accept/treat…)
4) Generate EvidencePackage for audit

### 7.2 CI/CD Gate → Release
1) Build
2) Generate SBOM
3) Sign artifact
4) Run Gate (pass/fail)
5) Store evidence + attestation

### 7.3 Incident → Case → Containment → Evidence
1) Alert
2) Case (D14)
3) Orchestrate actions (D13)
4) Capture evidence (D08)
5) Close + post-mortem

---

## 8. Platform security
### 8.1 Authentication & authorization requirements
- Authentication MUST rely on an IdP (OIDC/SAML) with MFA for privileged roles.
- Authorization MUST be RBAC with separation of duties (SoD) and full audit logging.

### 8.2 Logging & non-repudiation
- All sensitive actions (approvals, disabling gates, exports, purges) MUST generate an audit event.
- Audit exports MUST be signed and/or hashed with a manifest.

### 8.3 Cryptography & key management
- Secrets/signing keys MUST be stored in KMS/HSM.
- Key rotation: ≥ yearly (baseline), ≤ 6 months (regulated) or upon incident.

### 8.4 Confidentiality & minimization
- Evidence MUST be classified (at least: public/internal/sensitive).
- Exports MUST support redaction when required.

---

## 9. Observability & compliance
### 9.1 Minimum KPIs
- Critical log coverage (target = 100%).
- SLA compliance (triage, patch/vuln).
- Evidence completeness (risks/cases with EvidencePackages).

### 9.2 Audit packs
- MUST export an EvidencePackage by: risk, case, control, time window.
- MUST include a manifest (hash) + exhaustive evidence listing.

### 9.3 Retention, purge, legal hold
- Purge MUST be controlled (baseline: approver; regulated: two-person + WORM/immutability by class).
- Legal hold MUST block purge and unauthorized exports.

---

## 10. Non-functional requirements (NFR)
- **Availability**: define target (e.g., 99.9%) for critical components.
- **Performance**: EvidencePackage search < 5s on nominal scope.
- **Scalability**: extensible ingestion for logs/exports.
- **Sovereignty/portability**: deployable on-prem or controlled cloud.

---

## 11. Acceptance criteria (Definition of Done)
### 11.1 Baseline DoD
- Operational Risk Engine (register + decisions + time-boxed exceptions).
- Minimal CI/CD gates + execution traceability.
- Evidence Engine: ingestion + hashing/manifest + audit exports.
- Pass/fail: 0 failed critical items in CHK_MASTER_AuditReadiness (or equivalent).

### 11.2 Regulated DoD
- Two-person rule on critical actions.
- WORM / immutability for critical evidence.
- Stronger retention enforced and verifiable.

---

## 12. Annexes
- A) Extended glossary
- B) Default values (SLA/retention) — list format (no tables)
- C) Capability → D01..D18 mapping
- D) Minimal test scenarios (Given/When/Then)

## 13. Annexes (EN)
### Annex A — Requirements (REQ-TRI list)
- **REQ-TRI-001**: NATO Trinity MUST cover Risk Engine, Policy-as-Code Orchestrator, Evidence Engine.
- **REQ-TRI-002**: Every exception MUST be time-boxed and approved.
- **REQ-TRI-003**: Every risk acceptance MUST include an expiry date.
- **REQ-TRI-004**: Critical evidence MUST be exportable with a manifest (hash).
- **REQ-TRI-005**: In regulated mode, critical evidence MUST be immutable (WORM) or equivalent.
- **REQ-TRI-006**: Sensitive actions MUST be logged (actor, action, object, timestamp, outcome).
- **REQ-TRI-007**: A Risk Owner MUST NOT approve their own risk acceptance.
- **REQ-TRI-008**: Any GateResult=fail MUST create/link a case/ticket within ≤ 24h.

### Annex B — Default values (SLA & retention)
- **Critical incident triage**: ≤ 1h (baseline), ≤ 1h + initial containment ≤ 4h (regulated)
- **Critical patch**: ≤ 7d (baseline), ≤ 72h (regulated)
- **Critical vulnerability**: ≤ 7d (baseline), ≤ 72h (regulated)
- **Critical logs (SIEM/SOAR/IdP/ZTNA)**: ≥ 180d (baseline), ≥ 1y (regulated)
- **Incident/decision evidence**: ≥ 1y (baseline), ≥ 3y (regulated)
- **Releases/SBOM/attestations**: ≥ 1y (baseline), ≥ 3y (regulated)
- **DR/restore tests**: ≥ 3y

### Annex C — Capability → D01..D18 mapping
- **Risk Engine**: D01, D15, D08
- **Policy-as-Code Orchestrator**: D04, D06, D10, D13, D16, D18
- **Evidence Engine**: D08, D10, D13, D14, D16, D12

### Annex D — Test scenarios (Given/When/Then)
- **TEST-TRI-01 (Risk acceptance expiry)**
  - Given a risk in "accept" status
  - When an acceptance decision is created
  - Then `expiryDate` is mandatory and `approvedBy` ≠ owner
- **TEST-TRI-02 (Gate fail creates case)**
  - Given a blocking gate
  - When the result is "fail"
  - Then a case/ticket is created/linked within ≤ 24h and GateResult evidence is linked
- **TEST-TRI-03 (Audit package integrity)**
  - Given an exported EvidencePackage
  - When verifying the manifest
  - Then hashes match and the evidence listing is exhaustive


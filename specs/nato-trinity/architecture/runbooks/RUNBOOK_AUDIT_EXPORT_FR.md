# RUNBOOK — Export Audit (FR)

## But
Exporter un **EvidencePackage** pour un risque ou un incident, avec manifeste (hash) et chaîne de preuve.

## Pré-requis
- Droits `Auditor` ou `Approver`.
- Scope connu : `riskId` ou `caseId`.

## Procédure (checklist)
1) Identifier le scope (`riskId`/`caseId`).
2) Vérifier que toutes les preuves nécessaires sont liées (logs SIEM, tickets, GateResult, SBOM/attestations si applicable).
3) Lancer l’export : `POST /api/v1/evidence-packages` avec `scopeRef`.
4) Vérifier le manifeste : hashes cohérents, liste exhaustive.
5) En mode régulé : vérifier WORM/immutabilité et approvals (si requis).
6) Stocker l’export selon la politique (rétention ≥ 1 an, régulé ≥ 3 ans).

## Sorties attendues
- Bundle (zip) ou `bundleRef` + manifeste.
- AuditEvent correspondant.

# RUNBOOK — Audit Export (EN)

## Goal
Export an **EvidencePackage** for a risk or incident, with a manifest (hash) and chain-of-custody.

## Prerequisites
- `Auditor` or `Approver` permissions.
- Known scope: `riskId` or `caseId`.

## Procedure (checklist)
1) Identify the scope (`riskId`/`caseId`).
2) Ensure all required evidence is linked (SIEM logs, tickets, GateResult, SBOM/attestations when applicable).
3) Trigger export: `POST /api/v1/evidence-packages` with `scopeRef`.
4) Verify the manifest: hashes consistent, listing exhaustive.
5) In regulated mode: verify WORM/immutability and approvals (if required).
6) Store the export per policy (retention ≥ 1y, regulated ≥ 3y).

## Expected outputs
- Bundle (zip) or `bundleRef` + manifest.
- Corresponding AuditEvent.

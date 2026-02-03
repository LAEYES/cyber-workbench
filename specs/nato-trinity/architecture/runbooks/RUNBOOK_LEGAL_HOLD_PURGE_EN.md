# RUNBOOK — Legal hold & purge (EN)

## Goal
Apply a **legal hold** and perform a **controlled purge** per ADR-0011 and ADR-0008.

## 1) Legal hold
### When
- Legal request, audit, litigation, major incident.

### Procedure (checklist)
1) Identify the scope: `evidenceId` or `caseId` or `riskId`.
2) Create the hold (API TBD): `LegalHold.status=active` + `reason`.
3) Verify that purge is blocked for this scope.
4) Emit an AuditEvent + ChainOfCustodyEvent(action=legalHold).

## 2) Purge (baseline)
### Prereqs
- Approver role.
- No active legal hold.

### Procedure
1) Check retention policy (`retentionClass`).
2) Trigger controlled purge.
3) Verify AuditEvent + ChainOfCustodyEvent(action=purge).

## 3) Purge (regulated)
- Requires **two-person** + WORM constraints.
- No physical deletion of WORM evidence: purge = access revocation + pointer removal + event.

## Expected outputs
- Full trace (audit + chain-of-custody) + explicit final status (retained/purged/legal-hold).

# RUNBOOK — Gate fail → Case ≤ 24h (EN)

## Goal
Prove and verify compliance with **REQ-TRI-008**: any `GateResult=fail` must create or link a **case/ticket** within **24h**.

## Expected evidence
- GateResult (status=fail) with `executedAt`
- Linked case/ticket (`caseRef` or ticketId)
- Correlated AuditEvent(s) (`requestId` when available)

## Verification procedure
1) Identify a failed `gateResultId`.
2) Verify `status=fail` and `executedAt`.
3) Check `caseRef` (or ticket link in `details`).
4) Compare timestamps: `case.createdAt` - `executedAt` ≤ 24h.
5) If non-compliant: open a compliance incident, assign owner, corrective plan.

## Notes
- In regulated scope, the action may require extra approvals per policy.
- Preserve trace (EvidencePackage) for audits.

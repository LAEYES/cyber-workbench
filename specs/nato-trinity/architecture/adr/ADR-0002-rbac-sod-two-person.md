# ADR-0002 — RBAC/SoD and Two-person rule

**Status:** Accepted  
**Date:** {{today}}

## Context
The spec requires least privilege and separation of duties (SoD), plus a two-person rule in regulated scope for critical actions (closing critical incidents, disabling critical gates, evidence purge, critical risk acceptance).

## Decision
- RBAC is enforced centrally at the API Gateway or shared AuthZ layer.
- SoD constraints are implemented as policy rules (e.g., `risk.owner` cannot equal `decision.approvedBy`).
- Two-person rule is implemented as a workflow state machine (pending → approved1 → approved2 → executed).

## Consequences
- Some actions become multi-step and require an approval UI/API.
- Strong audit posture and easier compliance verification.

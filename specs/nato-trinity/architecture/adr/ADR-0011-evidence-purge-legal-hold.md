# ADR-0011 — Evidence purge, deletion & legal hold

**Status:** Proposed  
**Date:** {{today}}

## Context
The platform must support retention policies, controlled purge, and legal hold. In regulated scope, critical evidence must be immutable (WORM) and purging must be tightly controlled.

## Decision
- Implement a **LegalHold** mechanism that prevents purge/export outside authorized flows.
- Purge is never a hard-delete of regulated WORM evidence; it is:
  - a retention state transition
  - plus access revocation / pointer removal
  - plus chain-of-custody event
- Baseline: purge requires Approver role.
- Regulated: purge requires two-person workflow + WORM constraints.
- Every purge/legal-hold action emits an AuditEvent and a ChainOfCustodyEvent.

## Consequences
- Strong audit posture and recoverability.
- Requires clear UX to show retained vs purged vs legal-hold.

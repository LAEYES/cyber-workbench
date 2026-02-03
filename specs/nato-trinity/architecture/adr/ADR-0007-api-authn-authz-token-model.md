# ADR-0007 — API AuthN/AuthZ & token model

**Status:** Proposed  
**Date:** {{today}}

## Context
NATO Trinity requires strong authentication (IdP + MFA for privileged roles), RBAC with SoD, and comprehensive audit logging for sensitive actions (REQ-TRI-006). APIs are org-scoped (ADR-0005).

## Decision
- Use an external IdP (OIDC preferred) to authenticate users/services.
- Access tokens MUST carry: `sub`, `orgId`, `roles`, and optional `mfa`/`acr` signals.
- The API layer enforces:
  - `orgId` scoping
  - RBAC role checks
  - SoD rules (e.g., owner cannot self-approve)
  - two-person rule workflow for regulated critical actions
- Every sensitive endpoint MUST emit an AuditEvent.

## Consequences
- Requires token validation (JWKS) and consistent org/role propagation.
- Enables clear pass/fail verification for audit requirements.

## Notes
- Service identities should use short-lived tokens (workload identity, see D17 concepts).
- AuditEvent storage should be append-only.

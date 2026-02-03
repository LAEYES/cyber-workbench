# ADR-0015 — RBAC permissions model (API)

**Status:** Accepted  
**Date:** {{today}}

## Context
The API must enforce RBAC and SoD. We need a consistent permission model for endpoints, compatible with IdP roles and org scoping.

## Decision
- Use roles (minimum): `Viewer`, `Analyst`, `IR_Lead`, `RiskOwner`, `Approver`, `Admin`, `Auditor`.
- Define permissions by capability:
  - Risk: `risk:read`, `risk:write`, `risk:approve`
  - Policy/Gates: `gate:read`, `gate:write`, `gate:run`, `gate:disable`
  - Evidence: `evidence:read`, `evidence:ingest`, `evidence:export`, `evidence:purge`
  - Legal hold: `hold:read`, `hold:write`, `hold:release`
  - Audit: `audit:read`
- Mapping (example):
  - Viewer: read-only (risk/evidence)
  - Analyst: read + case operations + export evidence packs
  - Approver: approve decisions/exceptions, purge baseline
  - Admin: configure integrations/gates (no regulated purge bypass)
  - Auditor: audit:read + evidence:export
- SoD rule examples:
  - RiskOwner cannot self-approve accept decision.
  - Admin cannot purge regulated evidence without two-person + WORM.

## Consequences
- Easier reasoning and auditing of access controls.
- Requires role/permission mapping documentation in IdP.

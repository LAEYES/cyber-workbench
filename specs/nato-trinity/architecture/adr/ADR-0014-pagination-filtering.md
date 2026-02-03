# ADR-0014 — Pagination & filtering (list endpoints)

**Status:** Proposed  
**Date:** {{today}}

## Context
List endpoints must be usable at scale (evidence, audit events, packages, legal holds). We need deterministic pagination and server-side filtering, while keeping implementations simple.

## Decision
- Use cursor-style pagination:
  - `limit` (default 100, max 500)
  - `after` (opaque cursor)
- Support minimal, safe filters on list endpoints (e.g., `evidenceType`).

## Consequences
- Easy to implement consistently across services.
- Avoids unstable offset pagination.

## Notes
Cursor values must be treated as opaque and validated.

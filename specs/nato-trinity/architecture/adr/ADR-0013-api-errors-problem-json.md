# ADR-0013 — API error model (application/problem+json)

**Status:** Proposed  
**Date:** {{today}}

## Context
To make integrations reliable and auditable, the API needs a consistent error format. We also need to carry request IDs and stable error codes for incident handling and evidence.

## Decision
- Use RFC 7807 `application/problem+json` for errors.
- All error responses SHOULD include:
  - `requestId`
  - `errorCode` (stable, machine-readable)
- The API gateway MUST generate/propagate `requestId` into AuditEvents when relevant.

## Consequences
- Easier client implementation and troubleshooting.
- Standardized error logging and correlation.

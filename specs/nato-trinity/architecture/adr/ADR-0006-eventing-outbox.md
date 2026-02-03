# ADR-0006 — Eventing & outbox pattern

**Status:** Accepted  
**Date:** {{today}}

## Context
We need reliable propagation of changes (DB → search index, DB → audit events, DB → notifications) without losing events. We also need auditability of who changed what.

## Decision
- Use an outbox table/stream in the primary DB for domain events.
- Event consumers update:
  - search index
  - evidence packaging workflows
  - compliance notifications (optional)
- Each domain write produces an auditable event with actor identity.

## Consequences
- Strong consistency for source-of-record (DB) and eventual consistency for search.
- Adds operational components (workers/consumers).

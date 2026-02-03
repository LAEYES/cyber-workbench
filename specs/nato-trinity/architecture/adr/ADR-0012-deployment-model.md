# ADR-0012 — Deployment model (prod vs regulated)

**Status:** Proposed  
**Date:** {{today}}

## Context
NATO Trinity must support baseline and regulated scopes. Regulated scope increases requirements for evidence immutability (WORM), approvals (two-person), and longer retention.

## Decision
- Use a modular deployment:
  - API Gateway + AuthZ
  - Core services (Risk/Policy/Orchestrator/Evidence)
  - Workers (outbox consumers)
  - Storage (DB, object storage, WORM bucket, search)
- Baseline can run with object storage + DB + search.
- Regulated enables WORM bucket, stricter RBAC/SoD policies, and hardened retention configs.

## Consequences
- Clear separation between baseline and regulated features.
- Allows staged rollout without redesign.

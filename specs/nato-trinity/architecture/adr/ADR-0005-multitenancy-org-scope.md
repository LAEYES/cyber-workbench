# ADR-0005 — Multi-tenancy & org scoping

**Status:** Proposed  
**Date:** {{today}}

## Context
NATO Trinity artifacts (risks, decisions, evidence, cases) must be scoped by organization and environment. The platform must prevent cross-tenant data leaks and support audit exports per org.

## Decision
- All primary entities MUST include `orgId`.
- APIs MUST enforce `orgId` scoping at the AuthZ layer (RBAC + tenant isolation).
- Evidence storage paths MUST be partitioned by `orgId` (and optionally `env`).
- Search index MUST be partitioned or filtered by `orgId`.

## Consequences
- Simplifies audit export boundaries.
- Requires consistent org propagation through collectors.

## Notes
In regulated scope, cross-org exports are prohibited unless explicitly approved and logged.

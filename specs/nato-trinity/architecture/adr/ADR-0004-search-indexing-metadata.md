# ADR-0004 — Search, indexing & metadata model

**Status:** Proposed  
**Date:** {{today}}

## Context
NATO Trinity requires fast navigation and audit pack generation across risks, cases, controls, and evidence. Evidence is stored as blobs, but needs searchable metadata and strong referential integrity.

## Decision
- Maintain an explicit **metadata model** for Evidence and EvidencePackage in the primary DB.
- Maintain a **search index** (e.g., OpenSearch/Elastic) for:
  - Risk (title, owner, status, score)
  - Case (severity, status, owner)
  - Evidence (type, sourceSystem, collectedAt, classification, retentionClass)
  - Link fields (riskRefs, caseRefs, controlRefs)
- Index updates are event-driven from DB change events (outbox pattern).

## Consequences
- Extra infra component (search) but enables <5s evidence package lookup.
- Requires careful access control: search results must be filtered by RBAC.

## Notes
- The search index is not the system of record.
- In regulated mode, evidence integrity comes from WORM + manifests, not search.

# ADR-0008 — Evidence classification & retention classes

**Status:** Proposed  
**Date:** {{today}}

## Context
NATO Trinity requires evidence retention (baseline vs regulated) and evidence classification (public/internal/sensitive) with legal hold and controlled purge.

## Decision
- Evidence objects MUST carry:
  - `classification` = public|internal|sensitive
  - `retentionClass` = short|standard|long|legal
- Retention policies are configured per org and per evidenceType.
- Legal hold overrides purge.
- Regulated evidence may be forced to WORM storage.

## Consequences
- Simplifies audits: retention and classification are explicit and searchable.
- Requires careful access controls for sensitive evidence.

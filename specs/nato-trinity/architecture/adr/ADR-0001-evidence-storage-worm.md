# ADR-0001 — Evidence storage & WORM mode

**Status:** Accepted  
**Date:** {{today}}

## Context
NATO Trinity requires evidence integrity and, in regulated mode, immutability (REQ-TRI-005). Evidence must be exportable with a manifest (REQ-TRI-004) and support legal hold.

## Decision
- Store evidence blobs in object storage.
- In regulated mode, store critical evidence in WORM-capable storage (immutable buckets or equivalent).
- Maintain ChainOfCustody events in the primary DB (append-only semantics).

## Consequences
- Operational complexity increases (WORM lifecycle, legal hold).
- Strong audit posture; easier pass/fail verification.

## Notes
Implementation must avoid any path that allows an Admin to delete regulated evidence without two-person rule + WORM constraints.

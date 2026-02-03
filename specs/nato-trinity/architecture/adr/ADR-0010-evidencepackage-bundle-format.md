# ADR-0010 — EvidencePackage bundle format

**Status:** Proposed  
**Date:** {{today}}

## Context
EvidencePackage exports must be verifiable offline using a manifest (REQ-TRI-004) and optionally signed (ADR-0003, ADR-0009). Auditors need a predictable bundle layout.

## Decision
- EvidencePackage export is a **bundle** with the following layout:
  - `manifest.json` (hash list of every item) — conforms to `schemas/manifest.schema.json`
  - `evidence/` directory with evidence blobs or pointers
  - `README.txt` explaining verification steps
- If signing is enabled, `manifest.json` includes `signature` with `keyId`.

## Consequences
- Enables deterministic audit verification.
- Requires stable storageRefs and export pipeline.

## Verification
Auditor verifies:
1) manifest hash/signature
2) each evidence blob hash matches the manifest

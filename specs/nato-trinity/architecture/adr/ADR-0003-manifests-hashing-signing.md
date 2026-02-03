# ADR-0003 — Manifests, hashing and signing

**Status:** Accepted  
**Date:** {{today}}

## Context
Evidence integrity and non-repudiation require manifests and hashing/signing (REQ-TRI-004), and regulated mode requires immutability for critical evidence (REQ-TRI-005).

## Decision
- Every Evidence blob is hashed at ingestion (default sha256).
- EvidencePackage exports include a manifest file listing every evidenceRef + hash + metadata.
- Optionally sign the manifest with a platform key stored in KMS/HSM.

## Consequences
- Enables offline verification of exported audit packs.
- Requires key management lifecycle and signing key rotation.

# STD — D16 — Software Provenance (SLSA / Attestations)

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Baseline requirements
- Build pipeline must produce an **attestation** per release:
  - repo + commit SHA, tag/version
  - resolved dependencies (hash)
  - build environment (runner, image, toolchain versions)
  - produced artifact (digest)

## 2. Enhanced (regulated)
- Reproducible builds where feasible.
- Isolated builds (no outbound Internet except allowlist), secrets via vault.
- Attestation signing.

## 3. Pass/fail criteria
- [ ] Attestation present and bound to artifact (digest match).
- [ ] Provenance stored and retrievable.

## 4. Evidence
- Attestations, CI configuration, build logs.

# POL — D16 — Supply Chain Security (SBOM / Provenance / Signing)

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Objective
Reduce software supply-chain risk (dependencies, builds, CI/CD, artifacts, registries, provenance) by enforcing **measurable** controls, CI/CD **gates**, and auditable **evidence**.

## 2. Scope
- Source code, dependencies (direct/transitive), artifacts (packages, containers), CI/CD pipelines, registries.
- Vendors: Dev SaaS, CI, registries, CDN, signing services.

## 3. Baseline requirements
- Inventory of applications + repos + pipelines (owner, criticality).
- SBOM required for every artifact deployed to production (each release).
- Production artifacts must be signed and verified at deploy/runtime.
- Dependency policy: approved sources, version pinning, block typosquatting.

## 4. Enhanced requirements (regulated)
- Build provenance/attestations (SLSA-like) for production releases.
- Isolated build environments + vault-managed build secrets (rotation).
- Evidence retention: **≥ 1 year** (baseline), **≥ 3 years** (regulated) for production releases.

## 5. SLAs & pass/fail criteria (examples)
- SBOM: 100% of production releases publish an SBOM.
- Signing: 100% of production artifacts are signed and verified.
- Critical vulns (CVSS ≥ 9 or exploited): fix/mitigate **≤ 7 days** (baseline), **≤ 72h** (regulated).

## 6. Governance
- Owner per application/pipeline.
- Exceptions: time-boxed (max 30 days) + security approval.

## 7. Expected evidence
- SBOM (format + hash), provenance attestations, CI logs, verification policies, key rotation evidence.

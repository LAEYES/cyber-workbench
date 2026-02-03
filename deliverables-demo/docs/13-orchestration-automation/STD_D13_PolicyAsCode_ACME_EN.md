# STD — D13 — Policy-as-Code (Guardrails & Controls)

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Baseline requirements
- Version-controlled policies (Git) with PR required.
- Non-regression tests (lint/validate) before merge.
- Documented rollback.

## 2. Scope
- Cloud guardrails, network segmentation, endpoint baselines, IAM policies.

## 3. Enhanced (regulated)
- Policy/artifact signing.
- Two-person rule for critical changes.

## 4. Evidence
- PRs, pipelines, signed artifacts.

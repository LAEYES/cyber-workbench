# STD — D17 — Workload Identity Standard (OIDC / SPIFFE)

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Baseline requirements
- Unique identity per service (no shared identities).
- Bound to artifact: immutable image digest/tag.
- Token/cert issuance via IdP (no self-signed for prod).

## 2. Controls
- Strict audience/issuer.
- Minimal scopes.

## 3. Evidence
- Sample claims, policies, issuance logs.

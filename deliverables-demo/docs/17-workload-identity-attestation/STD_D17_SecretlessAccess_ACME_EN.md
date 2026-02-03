# STD — D17 — Secretless Access (Vault / STS / Just-in-time)

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Objective
Replace static secrets with on-demand short-lived credentials.

## 2. Requirements
- Credential lifetime: ≤ 24h (baseline), ≤ 1h (regulated).
- Automatic rotation, revoke on incident.
- No secrets baked into images.

## 3. Evidence
- Vault/STS config, rotation reports, secret scanning.

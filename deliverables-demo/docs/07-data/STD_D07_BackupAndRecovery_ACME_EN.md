# STD — D07 — Backup & Recovery Standard

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Baseline requirements
- RPO/RTO defined for critical systems.
- Encrypted backups.
- Restore testing: **quarterly** (critical), **semi-annual** (others).

## 2. Enhanced (regulated)
- Immutable backups (WORM) + separate account/storage.
- Restore tests: **monthly** for critical scope.
- Restoration evidence + runbooks.

## 3. Audit criteria
- [ ] RPO/RTO defined.
- [ ] Backups encrypted.
- [ ] Restore tests scheduled and evidenced.

## 4. Evidence
- Backup reports, restore test reports, runbooks.

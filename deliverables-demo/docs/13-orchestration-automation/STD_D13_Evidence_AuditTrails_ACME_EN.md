# STD — D13 — Evidence & Audit Trails

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Baseline requirements
- Each automated action records: timestamp, actor, target, justification, outcome.
- Mandatory links: alert → ticket → playbook → actions → evidence.
- Retention: **≥ 90 days**.

## 2. Enhanced (regulated)
- Retention: **≥ 180 days** + integrity/WORM.
- Approval decision log retained.

## 3. Evidence
- Log exports, sample trace chains.

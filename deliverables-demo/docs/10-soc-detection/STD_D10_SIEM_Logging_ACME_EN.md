# STD — D10 — SIEM Logging Standard

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Baseline requirements
- Minimum sources: IdP/IAM, EDR, firewall/VPN, cloud audit, DNS.
- Time sync (NTP) on sources.
- Normalized parsing + fields (user, src, action, outcome).
- Retention: **≥ 90 days**.

## 2. Enhanced (regulated)
- Retention: **≥ 180 days** + WORM for critical scope.
- Ingestion quality: > **98%** expected events.

## 3. Evidence
- Ingestion dashboard, field schema, retention proof.

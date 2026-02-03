# Endpoint & Workstations Checklist (D05)

**Organization:** ACME  
**Date:** 2026-02-03

## 1. Inventory & compliance
- [ ] Inventory is up to date (owner, OS, criticality, last check-in).
- [ ] Fleet compliance **≥ 95%** (baseline) / **≥ 98%** (regulated).

## 2. Hardening
- [ ] Version-controlled GPO/MDM baseline enforced.
- [ ] Auto-lock ≤ 10 min.
- [ ] No daily local admin; separate admin accounts.
- [ ] Host firewall enabled (inbound deny-by-default).

## 3. Patching
- [ ] Central patching tool + reporting.
- [ ] P0–P4 SLAs defined and measured.
- [ ] Offline endpoints > 14 days handled.

## 4. EDR / AV
- [ ] EDR coverage **≥ 98%**; inactive agents > 24h handled.
- [ ] Anti-tampering enabled.
- [ ] Exclusions are rare, approved and time-boxed.
- [ ] Response SLAs (critical ≤ 1h).

## 5. Data
- [ ] Laptop encryption 100%.
- [ ] Business data backup/sync.

## 6. Enhanced (regulated)
- [ ] Dedicated PAWs + segmentation.
- [ ] Application allow-listing for critical scope.
- [ ] Log retention ≥ 180 days + integrity.

---
*Template checklist: complete with evidence (MDM/EDR exports, dashboards, tickets).*

# POL — D18 — Deception / Honeypots / Canary

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Objective
Detect adversary movement early using deception assets (honeypots, honeytokens, canaries) with reliable alerting, orchestrated response (D13), and evidence (D08).

## 2. Principles
- Deception assets must not expose real data.
- Strict segmentation (D03) + isolation.
- High-confidence alerts: any interaction with deception = potential incident.

## 3. Baseline requirements
- Deploy at least:
  - 1 honeytoken (credential/token) per production environment
  - 1 canary file/share on sensitive servers
- Alerting integrated into SIEM/SOAR (D10/D13) with enrichment.
- Auto playbook: triage + initial containment (when possible) within ≤ 30 minutes.

## 4. Enhanced (regulated)
- Deception per critical segment (prod/admin/data).
- Deception logs retained ≥ 180 days + integrity.

## 5. Pass/fail
- [ ] Every trigger creates a ticket + timeline.
- [ ] Monthly deception tests.

## 6. Evidence
- Deception inventory, monthly tests, incident tickets, logs.

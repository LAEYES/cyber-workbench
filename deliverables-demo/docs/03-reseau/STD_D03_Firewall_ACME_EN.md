# STD — D03 — Firewall Standard

**Organisation:** ACME  
**Version:** 0.1 (draft)  
**Date:** 2026-02-03

## 1. Purpose
Define configuration, operational and governance requirements for firewalls/NGFW (on‑prem and cloud) to ensure consistent and auditable filtering.

## 2. Rule governance
- **Deny by default** for inter-zone policies.
- Each rule includes: owner, business justification, service/app, criticality, creation date, review/expiry date.
- Temporary rules require a mandatory **expiration date**.
- Periodic review: at least semi-annual; quarterly for critical zones.

## 3. Rule design
- Prefer **specific** rules (no any/any, no overly broad ranges).
- Use named objects/groups (IP/FQDN/tags) and application-aware services when applicable.
- Separate policies: inter‑zone, Internet egress, admin access, VPN/remote.
- Logging: log default denies and allows for sensitive flows (admin, DMZ, DATA, BACKUP).

## 4. Platform security
- Secure administration: access from ZONE-ADMIN, MFA, RBAC, named accounts.
- Hardening: disable unused services, enforce TLS, use SNMPv3 for monitoring.
- NTP sync, config backups, integrity controls.
- HA/cluster when required by impact analysis.

## 5. NGFW capabilities (context dependent)
- IPS/IDS, URL filtering, anti-malware, application control, TLS inspection where legally/contractually possible.
- Documented bypass policy (e.g., pinning, business constraints).

## 6. Cloud controls (Security Groups / NACL / managed firewall)
- Prefer policy-as-code for traceability (reviews, pull requests).
- Mandatory tagging/naming (app, env, owner, data class).
- Avoid direct exposure: prefer LB/WAF + DMZ patterns.

## 7. Enhanced requirements (regulated)
- Dual approval (network + security) for changes affecting critical scope.
- Non-regression controls (automated tests, rule simulation).
- Quarterly audit: orphan rules, shadow rules, unused objects, internet openings.
- Log retention and export of changes for evidence.

## 8. Evidence
- Policy exports + change history
- Review procedure and change tickets
- Rule audit / clean-up report

## 9. Exceptions
Only temporary exceptions with risk review and compensating controls (WAF, enhanced monitoring, segmentation).
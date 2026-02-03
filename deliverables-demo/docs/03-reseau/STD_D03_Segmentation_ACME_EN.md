# STD — D03 — Network Segmentation Standard

**Organisation:** ACME  
**Version:** 0.1 (draft)  
**Date:** 2026-02-03

## 1. Purpose
Define a technical segmentation standard (zones, flows, controls) to reduce attack surface and contain lateral movement.

## 2. Minimum zone model
- **ZONE-USER**: end-user endpoints.
- **ZONE-SRV**: application servers.
- **ZONE-DATA**: databases and storage.
- **ZONE-ADMIN**: bastions, admin tooling, admin workstations.
- **ZONE-DMZ**: internet-facing services / reverse proxy / WAF.
- **ZONE-BACKUP**: backup infrastructure.
- **ZONE-IOT/GUEST**: IoT and guest networks.

> Names can vary; logical separation and controls must remain equivalent.

## 3. Design rules
- **Deny by default** between zones; allow **explicitly** and **minimally**.
- Each zone has an **owner**, a **purpose**, and an expected **data classification**.
- Flows are described by: src, dst, protocol/port, direction, volume, encryption, justification, duration.
- Administrative flows (SSH/RDP/admin HTTPS) are restricted to **ZONE-ADMIN → targets** via bastion.

## 4. Implementation guidance
- Enforce separation via: VLAN/VRF + ACL, inter‑VLAN firewalls, micro-segmentation (agents/policies), cloud security groups.
- Use **tags/labels** (app, env, owner, criticality) to drive consistent policies.
- Avoid any-any; prefer FQDN/labels when appropriate.

## 5. Baseline requirements
- Prohibit direct **USER → DATA** connectivity.
- Prohibit **IOT/GUEST → SRV/DATA/ADMIN** access.
- Prohibit administration from the Internet; admin access only through approved solutions.
- Control egress from critical zones (ADMIN, BACKUP, DATA).

## 6. Enhanced requirements (regulated)
- Micro-segmentation for critical workloads (per application/tier) with versioned policies.
- Quarterly review of inter-zone flows for critical assets, with evidence.
- Lateral movement detection using firewall logs, NetFlow, and SIEM correlation.

## 7. Testing & validation
- Automated connectivity tests (infra CI/CD or runbooks) for allowed flows.
- Security review before introducing a new zone or cross-zone flow.

## 8. Evidence examples
- Up-to-date network diagram + flow matrix
- Exported rules/ACLs + change log
- Periodic flow review report

## 9. Exceptions
Exceptions must specify exact flows, duration, and compensating controls (WAF, IDS, monitoring, encryption).
# POL — D03 — Network & Infrastructure Security Policy

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Purpose
Define **operational and auditable** requirements for network design and operations (LAN/WAN/Wi‑Fi, DC, cloud, interconnects): segmentation, filtering, remote access, hardening, monitoring.

## 2. Scope
- On‑prem and cloud networks, DMZ, partner connectivity.
- Devices/services: routers, firewalls, switches, Wi‑Fi, VPN/remote access, DNS/DHCP/IPAM, proxies.

## 3. Baseline requirements
### 3.1 Inventory & lifecycle (mandatory)
- Maintain inventory (owner, version, end-of-support).
- EOL/EOS equipment is **prohibited** in critical scope.
- Config backups: **daily** (critical) / **weekly** (others) + restore test **quarterly**.

### 3.2 Segmentation (minimum)
- Minimum segments: USER / SRV / ADMIN / DMZ (if exposed) / GUEST-IOT / BACKUP / DATA.
- Inter-zone flow matrix reviewed:
  - critical: **quarterly**
  - others: **semi-annual**

### 3.3 Filtering
- Inter-zone: **deny-by-default**.
- Any/any prohibited unless approved exception (max **30d**).
- No internet-exposed admin services (SSH/RDP/WinRM) outside controlled solutions.

### 3.4 Remote access (VPN/ZTNA)
- MFA required.
- Separate user/admin/third-party access.
- Minimum posture (managed device, active EDR, supported OS) for sensitive access.

### 3.5 Logging & monitoring
- Centralize network logs with retention **≥ 90 days**.
- Minimum alerts: rule changes, new objects, deny spikes, anomalous connections.

## 4. Enhanced requirements (regulated)
- Pre-production security architecture review (flows, data, crypto, logs).
- Micro-segmentation for critical workloads.
- Bastion administration + session recording (critical scope).
- Log retention **≥ 180 days** + integrity.
- Dual approval (network + security) for critical changes.

## 5. Audit criteria (pass/fail)
- [ ] Inventory and EOL managed.
- [ ] Minimum segmentation + reviewed flow matrix.
- [ ] Deny-by-default and rules justified/expiring.
- [ ] Remote access MFA + separation.
- [ ] Centralized logging + retention.

---
*Template policy: complemented by segmentation/firewall/VPN standards and change procedures.*

# CHK — D03 — Network & Infrastructure Checklist

**Organisation:** ACME  
**Version:** 0.1 (draft)  
**Date:** 2026-02-03

> Goal: quickly assess network control maturity and compliance. Fill **Status** (OK / NOK / N/A), **Evidence** and **Comments**.

## 1. Governance & inventory
- [ ] Up-to-date network device inventory (Status / Evidence / Comments)
- [ ] Version/EOL tracking with refresh plan
- [ ] Configuration backups and restoration tests

## 2. Architecture & segmentation
- [ ] Up-to-date network diagrams (on‑prem + cloud)
- [ ] Inter-zone flow matrix maintained and reviewed
- [ ] Minimum segmentation in place (USER/SRV/DATA/ADMIN/DMZ/BACKUP/IOT)
- [ ] Administration from dedicated admin network / bastion

## 3. Filtering & firewalls
- [ ] Inter-zone “deny by default” policy
- [ ] Rules documented (owner, justification, expiry)
- [ ] Periodic review and clean-up (orphan/shadow rules)
- [ ] Logging enabled (deny + sensitive allow) and centralized

## 4. Remote access (VPN / ZTNA)
- [ ] MFA required for remote access
- [ ] Separation for user/admin/third parties
- [ ] Device posture checks (managed device, EDR, supported OS)
- [ ] Connection logs and anomaly alerting

## 5. Core network services (DNS/DHCP/NTP)
- [ ] Secured internal DNS (ACLs, logs, controlled transfers)
- [ ] Rogue DHCP detection / governed IPAM
- [ ] Consistent NTP sync for devices

## 6. Monitoring & response
- [ ] Network logs centralized to SIEM / central tooling
- [ ] Alerts on rule changes, spikes in denies, non-compliant tunnels
- [ ] Flow capture/NetFlow capability for investigations

## 7. Wi‑Fi (if applicable)
- [ ] Modern encryption (WPA2‑Enterprise/WPA3) and strong authentication
- [ ] Guest SSID isolated (no access to internal zones)
- [ ] Certificate/secret lifecycle managed

## 8. Cloud networking (if applicable)
- [ ] Landing zone model, segmentation (VPC/VNet), consistent SG/NACL
- [ ] Policy-as-code / change reviews
- [ ] Limited internet exposure (WAF/LB, no direct admin)

## 9. Enhanced requirements (regulated)
- [ ] Security architecture review before production
- [ ] Micro-segmentation for critical workloads
- [ ] Bastion admin session recording with evidence
- [ ] Periodic configuration audits (firewalls, VPN, DNS)

## Summary
- **Key gaps:**
  - 
- **Priority actions (30/60/90 days):**
  - 

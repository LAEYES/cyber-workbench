# Endpoint & Workstation Security Policy (D05)

**Organization:** ACME  
**Version:** 0.1 (draft)  
**Date:** 2026-02-03

## 1. Purpose
Define security requirements for workstations, laptops, managed mobile devices and endpoints (including admin workstations) to reduce compromise risk, data leakage and business disruption.

## 2. Scope
- Windows/macOS/Linux endpoints; iOS/Android (if managed).
- Internal and remote endpoints, work-from-home, BYOD (if allowed).
- Administrative endpoints (jump hosts, dedicated admin workstations).
- Profiles: SME=true, Mid=true, Regulated=true.

## 3. Principles
- **Hardened baselines** and standardized configurations.
- **Central management** (MDM/UEM, GPO, configuration management).
- **Defense-in-depth**: EDR/AV, host firewall, application control.
- **Systematic patch management** prioritized by criticality.
- **Encryption** and **backup/sync** for critical data.
- **Traceability**: security logs and alerts are collected and acted upon.

## 4. Governance & responsibilities
- **IT Ops / Workplace**: build, deployment, hardening, patching, compliance.
- **Security/CISO**: requirements, assurance, exceptions, risk ownership.
- **Managers**: approve specific needs (software), arbitrate.
- **Users**: comply with rules and report incidents.

## 5. Baseline requirements
### 5.1 Inventory & compliance
- Maintain an endpoint inventory with owner and criticality.
- Minimum compliance: supported OS, encryption, active EDR/AV, host firewall enabled.

### 5.2 Hardening
- Standard build (golden image) and secure configuration.
- Disable unnecessary services; restrict macros and scripts.
- Limit local accounts; no permanent local admin unless documented need.

### 5.3 Patching
- OS and critical application updates applied within defined timelines.
- Prioritize internet-exposed and actively exploited vulnerabilities.

### 5.4 Endpoint protection
- Centrally managed EDR/AV with real-time protection.
- Host firewall enabled; restrict unnecessary ports/flows.

### 5.5 Data
- Full-disk encryption (at least laptops); auto-lock.
- Backup/sync of business data (per operating model).

## 6. Enhanced requirements (regulated sectors)
- Dedicated admin workstations (PAW) and strong segmentation.
- Application allow-listing on critical scope.
- Enhanced hardening (benchmarks) with compliance evidence.
- Accelerated patching for critical vulns (strict SLA) + maintenance windows.
- Detection & response: EDR playbooks, proactive hunting, increased log retention.
- Peripheral restrictions: controlled USB, DLP/transfer controls where required.

## 7. Exceptions
Any exception must be documented, justified, time-bound, compensated (alternative controls) and approved by Security/CISO.

## 8. Expected evidence (examples)
- Endpoint compliance report (MDM/UEM/EDR).
- Configuration baseline and key settings.
- Patching/vulnerability report.
- Endpoint onboarding/offboarding procedures.

---
*Template document: adapt to your fleet, tooling (Intune/Jamf/SCCM, etc.) and regulatory requirements.*

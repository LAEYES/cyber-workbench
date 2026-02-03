# Endpoint & Workstation Security Policy (D05)

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Purpose
Define **operational and auditable** endpoint security requirements to reduce compromise, data leakage and disruption risks.

## 2. Scope
- Windows/macOS/Linux endpoints; iOS/Android (if managed).
- Internal and remote endpoints, WFH, BYOD (if allowed).
- Admin workstations (PAW / jump hosts).
- Profiles: SME=true, Mid=true, Regulated=true.

## 3. Baseline requirements
### 3.1 Inventory & compliance (mandatory)
- Maintain an up-to-date endpoint inventory (owner, OS, criticality, last check-in).
- Mandatory minimum compliance:
  - supported OS
  - disk encryption (laptops)
  - active EDR
  - host firewall enabled
- Fleet compliance target: **≥ 95%**.

### 3.2 Identity & access
- No shared accounts on endpoints.
- Admin access via separate accounts; no permanent local admin (unless exception).

### 3.3 Hardening
- Enforced and versioned GPO/MDM baselines.
- Auto-lock ≤ **10 minutes**.

### 3.4 Patching
- Patching SLAs enforced (see D05 PatchManagement standard).

### 3.5 Protection & response
- EDR/AV coverage and SLAs enforced (see D05 EDR standard).
- Endpoint isolation capability tested.

### 3.6 Data
- Encryption: **100%** of laptops.
- Backup/sync of business data per operating model.

## 4. Enhanced requirements (regulated sectors)
- Fleet compliance: **≥ 98%**; critical scope: **≥ 99%**.
- Dedicated PAWs and segmentation.
- Application allow-listing for critical scope.
- Endpoint/EDR log retention: **≥ 180 days** + integrity.
- Peripheral restrictions (USB) and transfer controls as needed.

## 5. Exceptions
Exceptions must be documented, time-boxed, compensated and approved by Security/CISO.

## 6. Audit criteria (pass/fail)
- [ ] Inventory and compliance measured.
- [ ] Hardening baseline enforced.
- [ ] Patching SLAs met.
- [ ] EDR compliant (coverage, exclusions, SLAs).
- [ ] Encryption proven.

## 7. Expected evidence
- Endpoint compliance report (MDM/UEM/EDR).
- Baseline exports (GPO/MDM) + versions.
- Patching reports + exceptions.

---
*Template document: adapt to fleet and tooling.*

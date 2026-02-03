# Endpoint Hardening Standard (D05)

**Organization:** ACME  
**Version:** 0.1 (draft)  
**Date:** 2026-02-03

## 1. Purpose
Define hardened baselines for endpoints to reduce attack surface and improve resilience.

## 2. Baseline requirements
### 2.1 Security configuration
- A defined configuration baseline is enforced (GPO/MDM/config management).
- Automatic screen lock (timeout) and compliant password/PIN.
- Disable/restrict high-risk features (macros, unsigned scripts, execution from temporary paths).

### 2.2 Privileges
- Least privilege: no local admin for daily use.
- Separate admin accounts for administrative operations.

### 2.3 Browser protections
- Browser hardening: block unapproved extensions, isolate sites, auto updates.
- Secure DNS (DoH/filtering) where available.

### 2.4 Encryption & boot
- Full-disk encryption enabled (BitLocker/FileVault/LUKS).
- Secure Boot enabled where applicable.

### 2.5 Attack surface
- Disable unnecessary services (RDP/SMB, etc.) based on needs.
- Host firewall configured deny-by-default for inbound flows not required.

## 3. Enhanced requirements (regulated sectors)
- Application allow-listing on critical scope.
- Advanced logging (e.g., Sysmon) + centralization and increased retention.
- Strict disablement of unused scripting engines/languages.
- Hardened admin workstations (PAW) + restrict unnecessary web browsing.

## 4. Testing & verification
- Periodic compliance reporting (MDM/GPO).
- Hardening validation when upgrading OS versions.

## 5. Expected evidence
- Baseline export (GPO/MDM) + version.
- Compliance report.

---
*Template standard: adapt per OS (Windows/macOS/Linux) and risk profile.*

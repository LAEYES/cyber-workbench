# STD — D03 — Remote Access Standard (VPN / ZTNA)

**Organisation:** ACME  
**Version:** 0.1 (draft)  
**Date:** 2026-02-03

## 1. Purpose
Define baseline requirements for remote access (users, administrators, third parties) via VPN and/or ZTNA, to reduce risk (credential theft, compromised endpoints, excessive access).

## 2. Principles
- Strong authentication (MFA) and contextual controls.
- Prefer **application/resource-level** access when possible (ZTNA); otherwise use segmented network access (VPN).
- Strict separation: users vs admins vs third parties.

## 3. Baseline requirements
### 3.1 Authentication & posture
- MFA is mandatory (phishing-resistant recommended for admins).
- Minimum posture checks: managed device, disk encryption, EDR running, supported OS.

### 3.2 Authorization
- Privileged access through a bastion (JIT/JEA when available).
- Full tunnel by default; split tunneling only with documented justification.
- Prohibit direct access to sensitive segments (DATA/BACKUP) from user VPN.

### 3.3 Cryptography & protocols
- Up-to-date TLS/IPsec (strong algorithms); prohibit deprecated protocols.
- Certificate lifecycle and automated renewal where possible.

### 3.4 Logging
- Log: authentications, connect/disconnect, accessed resources, configuration changes.
- Retain logs per ACME policy and protect integrity.

### 3.5 Third-party access
- Dedicated accounts, time-bound access, internal sponsor, post-intervention review.
- No shared accounts; session recording recommended.

## 4. Enhanced requirements (regulated)
- Prefer ZTNA for critical applications (policy based on identity + posture + risk).
- Phishing-resistant MFA (FIDO2/PKI) for admins and critical access.
- Admin session recording with immutable storage.
- Detection: SIEM correlation (impossible travel, new devices, privilege elevation, off-hours access).

## 5. Continuity & resilience
- High availability for remote access platform supporting critical activities.
- Controlled break-glass procedure (temporary, audited) in case of IdP outage.

## 6. Evidence
- Policy configuration and role/group lists
- Log exports, third-party access reports
- Onboarding/offboarding procedure

## 7. Exceptions
Documented exceptions only (duration, justification, compensating controls: enhanced monitoring, segmentation, time restrictions).
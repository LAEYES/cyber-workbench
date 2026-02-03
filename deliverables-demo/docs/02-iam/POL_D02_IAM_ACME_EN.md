# IAM Policy (Identity & Access Management)

**Organization:** ACME  
**Version:** 0.1 (draft)  
**Date:** 2026-02-03

## 1. Purpose
Define Identity & Access Management (IAM) requirements to protect ACME resources (applications, systems, data, and cloud services).

## 2. Scope
- Internal users, contractors, service accounts, technical accounts.
- Assets: on‑prem, SaaS, IaaS/PaaS, directories, admin tooling.
- Profiles: SME=true, Mid‑market=true, Regulated=true.

## 3. Principles
- **Least privilege** and **need‑to‑know**.
- **Segregation of duties** (e.g., admin vs daily user).
- **Traceability**: authentication and admin actions are logged.
- Identity as the new perimeter (Zero Trust target): risk‑based, conditional access.

## 4. Governance & roles
- **Application / Data owners**: role design and access approval.
- **IAM owner**: identity source of truth, workflows, policies.
- **IT Ops**: technical integration, directory/SSO availability.
- **CISO/Security**: requirements, oversight, exception handling.

## 5. Baseline requirements
### 5.1 Identity lifecycle (JML)
- Documented **Joiner/Mover/Leaver** process.
- Account disablement upon exit **within 24h** (or immediately when risk requires).
- Named accounts by default (no shared accounts) except documented, approved exceptions.

### 5.2 Authentication
- MFA required for: remote access, privileged access, sensitive data access.
- Passwords: minimum length + reuse protection (password manager recommended).

### 5.3 Authorization
- RBAC (roles) or equivalent; access granted via groups.
- Access reviews **at least quarterly** for sensitive roles.

### 5.4 Logging & alerting
- Log IAM events: logins, failures, privilege changes, account lifecycle changes.
- Centralize logs to SIEM/log platform when available.

### 5.5 Privileged accounts (PAM link)
- Dedicated admin accounts, separate from daily user accounts.
- Privileged access via bastion/vault when available.

## 6. Enhanced requirements (regulated environments)
- **Phishing‑resistant MFA** (FIDO2/WebAuthn) for privileged and critical environments.
- Stronger identity proofing for administrators and contractors.
- Monthly reviews for critical scope + formal recertification.
- Conditional access policies (context, device posture, geo, risk) and block legacy auth.
- Log integrity and retention controls (time sync, access control, tamper resistance).

## 7. Exceptions
Exceptions must be justified, time‑bound, include compensating controls, and be approved by Security.

## 8. Metrics (examples)
- % accounts with MFA, % admins with phishing‑resistant MFA.
- Mean time to disable leavers.
- % access reviews completed on time.

---
*Template document: adapt to your IAM/PAM architecture and applicable regulatory obligations.*

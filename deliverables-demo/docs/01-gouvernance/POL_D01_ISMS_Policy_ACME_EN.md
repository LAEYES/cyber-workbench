# Information Security Policy (ISP / ISMS Policy)

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Purpose
Define **measurable** security requirements applicable to ACME information systems and establish governance (roles, decisions, exceptions, evidence).

## 2. Scope
- Internal IT, cloud, endpoints, networks, applications, data, third parties.
- Profiles: SME=true, Mid-size=true, Regulated=true.

## 3. Governance (mandatory)
### 3.1 Roles & responsibilities
- **Executive management**: sponsor, risk/budget decisions, approve major exceptions.
- **CISO/Security**: program governance, reporting, exception management.
- **DPO** (if applicable): GDPR compliance and privacy governance.
- **Asset/Application/Data owners**: classification and residual risk decisions.

### 3.2 Minimum KPIs/KRIs
Monthly (or quarterly for small orgs):
- MFA coverage (users, admins)
- Endpoint/server patch compliance
- EDR coverage and agent health
- Access reviews completed on time
- Incidents: # critical, MTTD/MTTR

## 4. Guiding principles
- **Risk-based** approach (ISO 27005 / EBIOS) with documented treatment.
- Least privilege, separation of duties, deny-by-default.
- Security by design/by default.
- Traceability: centralized, usable logs.

## 5. Baseline requirements
### 5.1 Identity & access
- MFA required for remote access, admin access and sensitive data.
- Access reviews:
  - sensitive scope: **monthly**
  - rest of IS: **quarterly**
- Separate admin accounts.

### 5.2 Network & infrastructure
- Minimum segmentation: users / servers / admin / DMZ (if exposed).
- Inbound/outbound filtering; any/any rules prohibited unless documented exception.
- Centralized logging for critical components; time sync (NTP) required.

### 5.3 Endpoints & servers
- Version-controlled hardening baselines enforced.
- Disk encryption: **100%** of laptops.
- EDR/AV: **≥ 98%** coverage; inactive agent > 24h handled.

### 5.4 Patching & vulnerabilities
- Minimum SLAs (max): P0 exploited/internet ≤ **72h**, critical ≤ **7d**, high ≤ **14d**, medium ≤ **30d**.
- Time-boxed exceptions with compensating controls.

### 5.5 Data protection
- Minimum classification: Public / Internal / Confidential / Highly sensitive.
- Encryption: TLS in transit; at-rest for sensitive data.
- Backups: RPO/RTO defined for critical systems.

### 5.6 Incident management
- Documented process: detect → triage → contain → remediate → lessons learned.
- Forensic readiness for critical scope.

### 5.7 Third-party risk
- Security assessment prior to onboarding (TPRM) + clauses: incident notification, subprocessors, exit.

## 6. Enhanced requirements (regulated sectors)
- Phishing-resistant MFA (FIDO2/WebAuthn) for administrators.
- Logs: **≥ 180 days** retention (or per obligations) + integrity/immutability for critical scope.
- Monthly access reviews for critical scope + formal recertification.
- Incident response exercises at least yearly.
- Customer-managed keys (KMS/HSM) for critical scope where applicable.

## 7. Exceptions
All exceptions must be documented, time-bound, approved (Security/CISO; Executive for major exceptions) and periodically reviewed.

## 8. Audit criteria (pass/fail)
- [ ] KPIs/KRIs defined and tracked.
- [ ] MFA/patching/EDR/logging measured.
- [ ] Incident process + exercise evidence.
- [ ] TPRM and contractual clauses in place.
- [ ] Exception management evidenced.

## 9. Lifecycle
- Review at least annually or after major changes.

---
*Template: to be complemented by domain standards/procedures (IAM, network, endpoints, cloud, AppSec, etc.).*

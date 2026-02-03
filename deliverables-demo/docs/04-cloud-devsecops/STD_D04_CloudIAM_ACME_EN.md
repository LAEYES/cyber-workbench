# Cloud IAM Standard

**Organization:** ACME  
**Version:** 0.1 (draft)  
**Date:** 2026-02-03

## 1. Purpose
Define identity and access management rules for cloud environments (console, APIs, workloads) to reduce compromise risk and limit blast radius.

## 2. Principles
- **Named accounts** for users; shared accounts are prohibited (unless exception).
- **MFA required** for interactive access.
- **Least privilege**: role/group-based access, time-bound elevation, separation of duties.
- **Break-glass**: controlled emergency accounts, monitored and tested.

## 3. Baseline requirements
### 3.1 Identity organization
- Use a central IdP (SSO) when possible; federation is recommended.
- Avoid long-lived local users in critical accounts/projects.

### 3.2 Authentication
- MFA required for console access and sensitive operations.
- Disable legacy/high-risk mechanisms (non-MFA flows, unmanaged long-lived access keys).

### 3.3 Authorization
- RBAC: standardized roles (reader/operator/admin) and prod/non-prod separation.
- Temporary elevation (JIT) for admin tasks.
- Deny-by-default posture and removal of unused permissions.

### 3.4 API keys & machine identities
- Prohibit long-lived user keys; prefer short-lived roles (STS/OIDC).
- Rotate secrets/tokens; store them in a vault.
- Apply least privilege to workload identities.

### 3.5 Logging & alerting
- Log: authentications, IAM changes, key creation, policy attachments.
- Alert on: admin grants, MFA disabled, key creation, policy changes, anomalous usage.

## 4. Enhanced requirements (regulated sectors)
- **Phishing-resistant** MFA (FIDO2/WebAuthn) for administrators.
- Conditional access (context, device posture, geolocation) and network restrictions.
- Access reviews: monthly for critical scope + formal recertification.
- Break-glass: offline storage, two-person control, usage evidence and immediate rotation after use.
- Strong separation of duties: IAM admin ≠ network admin ≠ data admin.

## 5. Expected evidence (examples)
- SSO/federation diagram.
- IAM extracts: roles, policies, groups.
- Rotation history (tokens/credentials) + vault.
- Access review report.

---
*Template document: adapt to the cloud provider and IAM/PAM architecture.*

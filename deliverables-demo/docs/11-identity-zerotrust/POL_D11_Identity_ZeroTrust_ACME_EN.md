# POL — D11 — Identity / Zero Trust (IAM | ZTNA | PAM)

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Mission
Implement an identity-centric **Zero Trust** model: continuous authentication, conditional access, least privilege, and resource-level access (ZTNA), with SOC traceability.

## 2. Baseline requirements
### 2.1 Identity as perimeter
- Central SSO/IdP for critical applications.
- MFA: **100% admins**, **≥ 95% users**.
- Leavers: disable **≤ 24h** (≤ 4h for sensitive accounts).

### 2.2 Conditional access
- Block legacy authentication.
- Controls for sensitive access: device compliance, risk, geo (where available).

### 2.3 ZTNA
- Prefer app/resource ZTNA over full-tunnel VPN.
- Separate user/admin/third-party access.

### 2.4 PAM
- Privileged accounts vaulted with rotation.
- JIT elevation recommended.

### 2.5 Logging
- Centralize IdP/ZTNA/PAM logs; retention **≥ 90 days**.

## 3. Enhanced requirements (regulated)
- Phishing-resistant MFA for admins.
- Session recording for critical admin access.
- Log retention **≥ 180 days** + integrity.
- Two-person rule for critical PAM operations.

## 4. Audit criteria (pass/fail)
- [ ] MFA/SSO in place and measured.
- [ ] Conditional access enabled.
- [ ] ZTNA deployed for critical apps.
- [ ] PAM vault + rotation + (regulated) recording.
- [ ] Logs centralized.

## 5. Evidence
- IdP/CA configuration exports.
- ZTNA reports (protected apps).
- PAM inventory + rotation.
- Log samples.

---
*Template policy: complements D02 (IAM/PAM) and D03 (ZTNA/VPN).*

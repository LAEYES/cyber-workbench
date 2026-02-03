# CHK — D11 — Identity / Zero Trust Checklist

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

- [ ] Central SSO/IdP for critical apps.
- [ ] MFA 100% admins, ≥ 95% users.
- [ ] Legacy auth blocked.
- [ ] Conditional access (device compliant, risk, geo) for sensitive access.
- [ ] ZTNA deployed (app-level) + separate user/admin/third-party access.
- [ ] PAM: vault + rotation + alerting.
- [ ] Centralized IdP/ZTNA/PAM logs; retention ≥ 90d/180d regulated.

## Enhanced (regulated)
- [ ] Phishing-resistant admin MFA.
- [ ] Session recording for admin access.
- [ ] Two-person rule for critical PAM.

---
*Checklist: complete with evidence (exports, dashboards, tickets).*

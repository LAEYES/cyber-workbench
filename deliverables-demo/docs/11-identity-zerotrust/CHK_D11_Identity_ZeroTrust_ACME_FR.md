# CHK — D11 — Checklist Identity / Zero Trust

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

- [ ] SSO/IdP central pour apps critiques.
- [ ] MFA 100% admins, ≥ 95% users.
- [ ] Legacy auth bloqué.
- [ ] Conditional access (device compliant, risk, geo) sur accès sensibles.
- [ ] ZTNA déployé (accès par app) + séparation user/admin/tiers.
- [ ] PAM : vault + rotation + alerting.
- [ ] Logs IdP/ZTNA/PAM centralisés ; rétention ≥ 90j/180j régulé.

## Renforcé (régulé)
- [ ] MFA phishing-resistant admins.
- [ ] Session recording accès admin.
- [ ] Two-person rule PAM critique.

---
*Checklist : compléter avec preuves (exports, dashboards, tickets).* 

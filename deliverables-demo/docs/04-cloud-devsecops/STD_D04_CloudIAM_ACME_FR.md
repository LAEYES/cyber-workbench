# Standard IAM Cloud

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Exigences minimales (baseline)
- SSO/fédération recommandé ; utilisateurs locaux permanents interdits sur périmètre critique.
- MFA : **100% admins**.
- Clés long-lived utilisateurs : interdites ; préférer STS/OIDC.
- Revues accès : périmètre critique **mensuel**.
- Logs IAM centralisés ; rétention **≥ 90 jours**.

## 2. Renforcé (régulé)
- MFA phishing-resistant pour admins.
- Break-glass : double-contrôle + test trimestriel + rotation après usage.
- Rétention logs **≥ 180 jours** + intégrité.

## 3. Preuves
- Export IAM, dashboard MFA, rapports revues.

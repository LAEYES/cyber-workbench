# Checklist Cloud & DevSecOps (D04)

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Landing zone
- [ ] Séparation dev/test/prod.
- [ ] Guardrails (pas de stockage public non approuvé, pas d’admin Internet).

## 2. IAM Cloud
- [ ] MFA 100% admins.
- [ ] Pas de clés long-lived users.
- [ ] Revue accès mensuelle (critique).

## 3. Logs
- [ ] Logs audit centralisés ; rétention ≥ 90j/180j.

## 4. IaC
- [ ] PR obligatoires + scans IaC/secrets.
- [ ] State chiffré + locking.

## 5. Secrets
- [ ] Vault obligatoire ; rotation ≤ 90j.
- [ ] Secret scanning avec blocage.

## 6. Renforcé (régulé)
- [ ] Logs immuables + intégrité.
- [ ] Two-person rule sur changements critiques.

---
*Checklist : compléter avec preuves.*

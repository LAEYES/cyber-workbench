# CHK — D02 — Checklist IAM/PAM

**Organisation :** ACME  
**Date :** 2026-02-03

## IAM
- [ ] Inventaire des identités (humains / services) à jour
- [ ] Process JML (joiner/mover/leaver) documenté + SLA appliqués
- [ ] MFA activé sur SSO/IdP et consoles cloud
- [ ] Accès tiers : comptes dédiés + expiration
- [ ] Revues d’habilitations réalisées (preuves)

## PAM
- [ ] Liste des comptes à privilèges + propriétaires
- [ ] Coffre-fort secrets admin en place
- [ ] Rotation des secrets
- [ ] Session recording / bastion (si régulé)
- [ ] Break-glass testé

## Logs & preuves
- [ ] Logs d’authentification centralisés
- [ ] Alertes sur anomalies (impossible travel, MFA fatigue, etc.)

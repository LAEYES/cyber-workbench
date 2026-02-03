# STD — D11 — Standard ZTNA (Accès par application)

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Exigences minimales (baseline)
- MFA obligatoire.
- Accès par application/ressource (pas de routage réseau large).
- Posture minimale : appareil géré + EDR actif + OS supporté pour accès sensible.
- Accès tiers : comptes dédiés + durée limitée + sponsor.
- Logs ZTNA (auth, ressources, policy changes) centralisés ; rétention ≥ 90j.

## 2. Renforcé (régulé)
- MFA phishing-resistant pour admins.
- Session recording pour accès admin via bastion.
- Rétention logs ≥ 180j + intégrité.

## 3. Preuves
- Export policies ZTNA, liste apps protégées, logs.

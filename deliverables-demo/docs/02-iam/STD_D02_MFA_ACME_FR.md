# STD — D02 — Standard MFA

**Organisation :** ACME  
**Date :** 2026-02-03

## 1. Objectif
Imposer l’authentification multifacteur sur les accès sensibles.

## 2. Portée
- SSO/IdP, VPN/ZTNA, consoles cloud, messagerie, outils d’admin, PAM.

## 3. Exigences
- MFA requis pour :
  - comptes à privilèges
  - accès distant
  - accès aux données sensibles
  - accès administrateur aux SaaS/Cloud
- Facteurs acceptés : FIDO2/WebAuthn, TOTP, push (avec protections anti-fatigue).
- Interdits (sauf exception) : SMS (faible).

## 4. Renforcé (régulé)
- Phishing-resistant MFA (FIDO2) pour admins.
- Policies d’accès conditionnel (device compliant, geo, risque, impossible travel).

## 5. Exceptions
- Dérogation limitée dans le temps + contrôle compensatoire.

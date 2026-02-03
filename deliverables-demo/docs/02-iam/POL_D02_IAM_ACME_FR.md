# POL — D02 — Politique IAM (Identity & Access Management)

**Organisation :** ACME  
**Version :** 0.1 (draft)  
**Date :** 2026-02-03

## 1. Objet
Définir les exigences de gouvernance et de contrôle des identités, des authentifications et des accès aux SI de ACME.

## 2. Périmètre
- Comptes humains, comptes techniques/service, comptes à privilèges.
- Accès internes, distants, cloud/SaaS, API.

## 3. Principes
- Moindre privilège, séparation des tâches, traçabilité.
- MFA par défaut, gestion du cycle de vie (JML: Joiner/Mover/Leaver).
- Zéro Trust (cible) : vérification continue, accès conditionnels.

## 4. Règles minimales (baseline)
### 4.1 Cycle de vie des identités
- Toute identité est unique, nominative (sauf comptes techniques documentés).
- Provisioning/déprovisioning sous SLA (ex: départ < 24h).

### 4.2 Authentification
- MFA obligatoire pour accès distants, VPN/SSO, consoles cloud, et privilèges.
- Mots de passe : longueur min 14, blocage après tentatives, bannissement de mots de passe faibles.

### 4.3 Autorisations
- RBAC (rôles) + exceptions tracées et temporisées.
- Revue d’habilitations : trimestrielle (actifs critiques) / semestrielle (autres).

### 4.4 Journalisation
- Journaliser authentifications, élévations de privilèges, accès admin, changements IAM.
- Conservation et protection des logs (intégrité).

## 5. Exigences renforcées (régulé)
- IGA (Identity Governance) avec campagnes d’attestation, SoD, preuves.
- PAM obligatoire : coffre, enregistrement des sessions, comptes break-glass, rotation.
- Accès tiers : ZTNA, comptes dédiés, JIT/JEA, interdiction de comptes partagés.

## 6. Exceptions
- Exceptions formalisées : justification, analyse de risque, durée, compensations.

## 7. Indicateurs
- % comptes à privilèges sous PAM
- % MFA sur accès sensibles
- Délai moyen de déprovisionnement

## 8. Révision
- Revue annuelle ou après incident majeur/changement d’architecture.

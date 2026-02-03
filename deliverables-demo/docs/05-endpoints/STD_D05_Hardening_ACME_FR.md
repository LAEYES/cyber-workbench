# Standard Durcissement Endpoints (D05)

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Objet
Décrire une baseline de durcissement **prescriptive et vérifiable** des endpoints pour réduire la surface d’attaque et améliorer la résistance aux attaques.

## 2. Exigences minimales (baseline)
### 2.1 Baseline et conformité (obligatoire)
- Baseline appliquée via GPO/MDM/config management, versionnée.
- Taux de conformité baseline : **≥ 95%** (fleet global), mesuré mensuellement.

### 2.2 Contrôles session & identité
- Verrouillage automatique : **≤ 10 min** d’inactivité.
- MFA obligatoire pour accès distants et opérations sensibles (conforme politique IAM).

### 2.3 Réduction surface d’attaque (minimum)
- Désactiver services inutiles (selon besoin) ; interdire services d’admin non justifiés.
- Pare-feu hôte : **activé** ; inbound deny-by-default sauf exceptions documentées.
- Désactiver/limiter macros ; restreindre scripts non signés.

### 2.4 Privilèges
- Pas d’admin local pour usage courant.
- Comptes admin dédiés ; élévation JIT quand possible.

### 2.5 Chiffrement & boot
- Chiffrement disque : **100%** des laptops et endpoints contenant données sensibles.
- Secure Boot activé quand applicable.

### 2.6 Navigateur
- Mises à jour automatiques.
- Extensions : allow-list (au minimum sur périmètre sensible).

## 3. Exigences renforcées (secteurs régulés)
- Conformité baseline : **≥ 98%**.
- Allow-list applicative sur périmètre critique.
- Journaux avancés (ex. Sysmon/équivalent) + centralisation ; rétention **≥ 180 jours**.
- PAW : interdiction navigation web non nécessaire, séparation forte (admin vs bureautique).
- Désactivation stricte des script engines non requis.

## 4. Tests & vérifications
- Contrôle de conformité mensuel (MDM/GPO) + plan de remédiation.
- Validation lors des montées de version OS (pilot) + rollback.

## 5. Critères d’audit (pass/fail)
- [ ] Baseline versionnée + appliquée.
- [ ] Conformité mesurée et suivie.
- [ ] Pare-feu hôte activé + exceptions tracées.
- [ ] Chiffrement disque prouvé.
- [ ] Contrôle privilèges (pas d’admin local).

## 6. Preuves attendues
- Export baseline (GPO/MDM) + version.
- Rapport conformité.
- Politique firewall hôte.
- Rapport chiffrement (BitLocker/FileVault/LUKS).

---
*Standard modèle : à adapter par OS et par profil de risque.*

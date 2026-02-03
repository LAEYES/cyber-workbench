# Standard Développement Sécurisé (D06)

**Organisation :** ACME  
**Version :** 0.1 (draft)  
**Date :** 2026-02-03

## 1. Objet
Définir les exigences de développement sécurisé (secure coding, revues, CI) applicables aux applications et APIs.

## 2. Exigences minimales (baseline)
### 2.1 Revue de code
- PR obligatoires avec revue par pair.
- Revue sécurité requise pour composants sensibles (auth, crypto, paiement, accès admin).

### 2.2 Standards de codage
- Validation/normalisation des entrées ; encodage sorties.
- AuthN/AuthZ robustes (RBAC/ABAC), protections anti-CSRF si applicable.
- Gestion des erreurs sans fuite d’info ; logs pertinents.

### 2.3 Sécurité des APIs
- Authentification forte (OIDC/OAuth2), scopes et permissions.
- Limitation de débit (rate limiting) et protection contre abus.

### 2.4 CI/CD
- Pipelines reproductibles ; dépendances figées/contrôlées.
- Séparation des secrets et variables.

## 3. Exigences renforcées (secteurs régulés)
- Revue AppSec formelle pour applications critiques.
- Tests de sécurité automatisés bloquants sur seuils (SAST/SCA) + exceptions contrôlées.
- Guidelines cryptographiques (algo approuvés, rotation clés, HSM si besoin).

## 4. Preuves attendues
- Politiques de protection branches et règles PR.
- Exemples de revues et checklists.

---
*Standard modèle : à adapter aux langages, frameworks et outils CI/CD.*

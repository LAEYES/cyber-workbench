# Standard Patch Management Endpoints (D05)

**Organisation :** ACME  
**Version :** 0.1 (draft)  
**Date :** 2026-02-03

## 1. Objet
Définir les règles de mise à jour et de gestion des correctifs (OS, navigateurs, suites bureautiques, outils distants) pour les endpoints.

## 2. Exigences minimales (baseline)
### 2.1 Cadre & responsabilités
- Outil de gestion des mises à jour (WSUS/Intune/Jamf/Autre) et reporting.
- Fenêtres de maintenance définies ; communication aux utilisateurs.

### 2.2 Délais (SLA indicatifs)
- Critique exploité / exposition Internet : **7 jours**.
- Critique : **14 jours**.
- Important : **30 jours**.
- Autres : cycle régulier.

### 2.3 Couverture
- OS + applications critiques (navigateurs, PDF, VPN, agents sécurité).
- Inventaire logiciels pour identifier les versions obsolètes.

### 2.4 Exceptions
- Exceptions documentées avec mesure compensatoire (isolement, restriction accès, monitoring).

## 3. Exigences renforcées (secteurs régulés)
- SLA plus strict sur périmètre critique (ex. 72h/7j selon contexte).
- Validation pré-déploiement (pilote) + traçabilité complète.
- Indicateurs et revues régulières (comité) ; escalade en cas de dérive.

## 4. Preuves attendues
- Rapport de conformité patching.
- Procédure de gestion des vulnérabilités.

---
*Standard modèle : à adapter au parc et aux contraintes de production.*

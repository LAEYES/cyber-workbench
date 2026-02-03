# Politique de Sécurité des Systèmes d’Information (PSSI)

**Organisation :** ACME  
**Version :** 0.1 (draft)  
**Date :** 2026-02-03

## 1. Objet
Définir les principes, rôles et exigences de sécurité applicables aux systèmes d’information de ACME.

## 2. Périmètre
- SI internes, cloud, postes de travail, réseaux, applications, données, tiers.
- Profils : PME=true, ETI=true, Régulé=true.

## 3. Gouvernance & responsabilités
- Direction : sponsor, arbitrages, budget.
- RSSI/CISO : pilotage sécurité, reporting.
- DPO (si applicable) : conformité RGPD.
- Propriétaires d’actifs : classification, risque.

## 4. Principes directeurs
- Approche par les risques (ISO 27005 / EBIOS).
- Défense en profondeur, moindre privilège, Zero Trust (cible).
- Sécurité by design & by default.

## 5. Exigences minimales (baseline)
### 5.1 Identités & accès
- MFA obligatoire pour accès distants et comptes à privilèges.
- RBAC, revues d’habilitations trimestrielles.

### 5.2 Réseau & infrastructure
- Segmentation (prod/admin/utilisateurs), filtrage entrant/sortant.
- Journalisation centralisée (syslog/agent) des composants critiques.

### 5.3 Postes & serveurs
- Hardening, patch management, EDR/XDR selon criticité.
- Chiffrement disque sur postes nomades.

### 5.4 Données
- Classification : Public / Interne / Confidentiel / Très sensible.
- Chiffrement en transit (TLS) et au repos quand applicable.

## 6. Conformité & référentiels
- ISO 27001/27002, NIST CSF (cartographie), RGPD.
- Selon contexte : NIS2 / DORA / PCI DSS (à qualifier).

## 7. Gestion des incidents
- Détection, qualification, réponse, communication.
- Conservation des preuves (forensic readiness).

## 8. Gestion des tiers
- Évaluation des risques fournisseurs (TPRM).
- Clauses sécurité : exigences, auditabilité, notification incident.

## 9. Cycle de vie
- Revue annuelle ou à chaque changement majeur.

---
## Annexes (à générer ensuite)
- RACI, SoA, catalogue de contrôles, playbooks, indicateurs (KPI/KRI).

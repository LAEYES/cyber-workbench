# Standard Gestion des Secrets

**Organisation :** ACME  
**Version :** 0.1 (draft)  
**Date :** 2026-02-03

## 1. Objet
Définir les exigences de gestion des secrets (mots de passe, clés API, certificats, tokens, clés KMS, secrets applicatifs) pour réduire le risque de fuite, de fraude et d’accès non autorisé.

## 2. Exigences minimales (baseline)
### 2.1 Stockage
- Secrets stockés dans un **coffre** (vault) ou service managé (ex. KMS/Secrets Manager/Key Vault).
- Interdiction de stockage dans le code, tickets, documents partagés, variables non protégées.

### 2.2 Accès
- Accès via RBAC et moindre privilège.
- Séparation lecture/écriture/administration.

### 2.3 Rotation & cycle de vie
- Rotation régulière des secrets sensibles (fréquence selon criticité).
- Révocation immédiate en cas d’incident ou départ.
- Inventaire des secrets et propriétaires.

### 2.4 Distribution
- Injection à l’exécution (runtime) via identités workload ; éviter les secrets statiques.
- Journaux d’accès au coffre activés.

## 3. Exigences renforcées (secteurs régulés)
- Secrets chiffrés avec clés dédiées ; séparation des environnements.
- Politique de rotation stricte (ex. < 90 jours) sur périmètre critique.
- Détection de fuite (scans secrets) sur dépôts et CI, avec blocage.
- Double-contrôle pour secrets de production critique (approbation).

## 4. Preuves attendues (exemples)
- Configuration du coffre + RBAC.
- Historique de rotation/révocation.
- Inventaire des secrets (sans valeur des secrets).
- Rapports de scans secrets.

---
*Document modèle : à adapter à l’outillage et au niveau de maturité DevSecOps.*

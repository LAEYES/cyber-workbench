# Standard PAM (Privileged Access Management)

**Organisation :** ACME  
**Version :** 0.1 (draft)  
**Date :** 2026-02-03

## 1. Objet
Définir les exigences de gestion des accès à privilèges (PAM) afin de réduire le risque lié aux comptes et secrets à haute criticité.

## 2. Périmètre
- Comptes admin (systèmes, réseau, base de données, cloud), comptes de service à privilèges, clés/API tokens.
- Systèmes critiques : annuaires, hyperviseurs, équipements réseau, CI/CD, production.

## 3. Exigences minimales (baseline)
### 3.1 Comptes et séparation
- Comptes admin **dédiés** (pas de privilèges sur comptes bureautiques).
- Interdiction des comptes partagés ; si inévitable : traçabilité nominative.

### 3.2 Coffre‑fort et gestion des secrets
- Stockage centralisé des secrets (vault) quand disponible.
- Rotation périodique des mots de passe admin et secrets (API keys) ; rotation immédiate après incident.
- Service accounts : inventaire + propriétaires + justification.

### 3.3 Accès à privilèges
- Accès admin via bastion / jump server quand possible.
- MFA obligatoire pour accès admin.
- Principe **Just‑Enough‑Administration** (JEA) : droits minimaux par tâche.

### 3.4 Journalisation & supervision
- Journaliser : connexions admin, commandes/actions sensibles, élévations, changements de secrets.
- Revue régulière des logs sur périmètre critique.

### 3.5 Comptes d’urgence (break‑glass)
- Nombre limité, usage exceptionnel, contrôlé et tracé.
- Secrets protégés (double contrôle si possible) et rotation après usage.

## 4. Exigences renforcées (secteurs régulés)
- Accès **Just‑In‑Time** (JIT) : élévation temporaire avec approbation.
- Enregistrement de session (session recording) pour administrations critiques.
- Poste d’administration dédié (PAW/SAW) pour actions à haut risque.
- Ségrégation des tâches (ex. création compte ≠ attribution privilèges ≠ validation).
- Protection de l’intégrité des logs (horodatage, rétention, accès restreint).

## 5. Contrôles et indicateurs (exemples)
- % comptes admin séparés, % secrets dans un vault.
- Âge moyen des secrets ; délai de rotation après départ.
- Nombre d’élévations JIT vs privilèges permanents.

---
*Document modèle : à adapter selon l’outillage (PAM, vault, bastion) et les environnements.*

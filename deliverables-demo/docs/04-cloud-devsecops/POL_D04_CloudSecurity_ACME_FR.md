# Politique Sécurité Cloud

**Organisation :** ACME  
**Version :** 0.1 (draft)  
**Date :** 2026-02-03

## 1. Objet
Définir les exigences minimales et renforcées de sécurité pour l’usage des services cloud (IaaS/PaaS/SaaS) et des pratiques DevSecOps associées, afin de protéger les données, les identités, les workloads et la chaîne de livraison logicielle.

## 2. Périmètre
- Fournisseurs cloud et services managés (IaaS/PaaS/SaaS).
- Comptes/projets/tenants, workloads (VM, conteneurs, serverless), stockage, réseau, clés/secrets.
- Outils DevSecOps : IaC, CI/CD, registry, scanning, observabilité.
- Profils : PME=true, ETI=true, Régulé=true.

## 3. Principes
- **Responsabilité partagée** : clarifier ce qui relève du fournisseur vs de ACME.
- **Security-by-default** : configuration sécurisée, durcissement et suppression des accès implicites.
- **Moindre privilège** et **Zero Trust** : identité + contexte + segmentation.
- **Traçabilité** : logs centralisés, horodatés, protégés contre l’altération.
- **Automatisation** : contrôles as-code (policy-as-code), détection et remédiation.

## 4. Gouvernance & responsabilités
- **Cloud Owner / Platform Team** : conception landing zone, guardrails, standards et outillage.
- **Owners applicatifs** : respect des standards, classification des données, preuves.
- **RSSI/CISO** : exigences, contrôles, arbitrage des exceptions.
- **IT Ops/SRE** : exploitation, sauvegardes, supervision, réponse à incident.

## 5. Exigences minimales (baseline)
### 5.1 Landing zone & garde-fous
- Segmentation par **environnements** (dev/test/prod) et séparation des comptes/projets quand possible.
- **Politiques** (SCP/Policies) interdisant les configurations critiques (ex. stockage public non approuvé).
- Catalogue de services autorisés (liste blanche) et gestion du shadow IT.

### 5.2 Données & chiffrement
- Classification des données (au moins : public/interne/confidentiel).
- Chiffrement en transit (TLS) et au repos (KMS) pour données sensibles.
- Gestion de cycle de vie : rétention, suppression, accès.

### 5.3 Journalisation & monitoring
- Activation des logs d’audit (ex. CloudTrail/Activity Log) et logs de sécurité.
- Centralisation vers un SIEM/stockage dédié ; alertes sur événements à risque.
- Rétention adaptée aux besoins (ex. 90 jours mini) et revue régulière.

### 5.4 Sécurité des workloads
- Images durcies + scanning des vulnérabilités.
- Gestion des correctifs et configuration.
- Restriction des accès sortants/entrants (security groups/NSG) et micro-segmentation si possible.

### 5.5 Tiers & SaaS
- Évaluation sécurité des fournisseurs (TPRM) avant souscription.
- Exigences contractuelles : incidents, localisation, sous-traitants, réversibilité.

## 6. Exigences renforcées (secteurs régulés)
- **Séparation stricte** prod/non-prod (comptes distincts), contrôle de changements renforcé.
- Chiffrement avec **clés gérées par le client** (BYOK/HYOK) pour périmètres critiques.
- Journalisation **immuable** (WORM) + intégrité (hash/chain) + horodatage.
- Surveillance continue : posture (CSPM), conformité (policy-as-code) et remédiation automatisée.
- Revue périodique des accès cloud (mensuelle sur périmètre critique) et recertification.
- Plan de réponse à incident cloud testé (table-top + exercices techniques) et procédures d’escalade fournisseur.

## 7. Exceptions
Toute exception est : documentée, justifiée, limitée dans le temps, compensée (contrôles alternatifs), approuvée par le RSSI/CISO.

## 8. Preuves attendues (exemples)
- Diagramme landing zone + séparation environnements.
- Extraits de policies/guardrails.
- Extraits de logs/alertes + preuve de centralisation.
- Inventaire des services cloud utilisés + propriétaires.

---
*Document modèle : à adapter au fournisseur (AWS/Azure/GCP) et au contexte réglementaire.*

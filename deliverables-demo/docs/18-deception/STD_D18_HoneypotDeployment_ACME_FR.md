# STD — D18 — Déploiement Honeypots (réseau / host)

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Placement
- Hors prod, segment isolé, mais accessible depuis chemins d’attaque plausibles.
- Aucun accès sortant Internet (sauf vers SIEM/SOAR allowlist).

## 2. Collecte
- Logs : authent, commandes, connexions, fichiers.
- Horodatage synchronisé (NTP).

## 3. Sécurité
- Pas de credentials réels.
- Rotation images/instances trimestrielle.

## 4. Preuves
- Diagramme réseau, config, logs de test.

# STD — D12 — Sauvegardes Immuables (WORM)

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Exigences minimales (baseline)
- Copie de sauvegarde séparée (compte/tenant distinct) recommandée.
- MFA sur comptes backup admins.
- Logs opérations backup centralisés ; rétention ≥ 180j (critique).

## 2. Renforcé (régulé)
- WORM/immutabilité activée sur backups critiques.
- Air-gap logique (accès restreint, réseau séparé si possible).

## 3. Preuves
- Config WORM, logs, preuves séparation compte.

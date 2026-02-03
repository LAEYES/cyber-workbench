# STD — D13 — Evidence & Audit Trails

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Exigences minimales (baseline)
- Chaque action automatisée génère : timestamp, actor, cible, justification, résultat.
- Liens obligatoires : alerte → ticket → playbook → actions → preuves.
- Rétention : **≥ 90 jours** (baseline).

## 2. Renforcé (régulé)
- Rétention : **≥ 180 jours** + intégrité/WORM.
- Journal de décision (approvals) conservé.

## 3. Preuves
- Exports logs, exemples chaînes de traçabilité.

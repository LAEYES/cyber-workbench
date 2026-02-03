# STD — D14 — Contrôle d’accès UI (RBAC / Sessions / Audit)

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. RBAC (minimum)
- Viewer : lecture
- Analyst : triage, assign, commentaires
- IR Lead : changement sévérité, containment actions
- Admin : config intégrations (hors suppression preuves)

## 2. Sessions
- Timeout d’inactivité ≤ 30 min.
- Re-auth sur actions sensibles.

## 3. Audit
- Toute action loggée + exportable.
- Rétention ≥ 90j (baseline), ≥ 180j (régulé) + intégrité.

## 4. Preuves
- Matrice rôles/permissions, exports logs.

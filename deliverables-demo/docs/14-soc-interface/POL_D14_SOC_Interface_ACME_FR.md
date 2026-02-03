# POL — D14 — Interface SOC (Console / Dashboards / Views)

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Mission
Fournir une interface SOC exploitable et **audit-safe** : supervision, triage, case management, vues exécutives, et traçabilité complète (actions opérateurs, décisions, preuves).

## 2. Exigences minimales (baseline)
- Authentification forte via IdP + MFA.
- RBAC : rôles minimum (Viewer / Analyst / IR Lead / Admin) + séparation des tâches.
- Journaliser toute action (ack, assign, close, change severity, add IOC) avec horodatage.
- Sessions : timeouts, protection contre reuse.

## 3. Exigences renforcées (régulé)
- Two-person rule pour actions critiques (close incident critique, suppression preuves, export massif).
- Rétention logs UI : **≥ 180 jours** + intégrité.
- Export preuves immuable (WORM) pour incidents critiques.

## 4. Critères d’audit (pass/fail)
- [ ] MFA + RBAC en place.
- [ ] Audit trail complet des actions.
- [ ] Workflow de case management défini.

## 5. Preuves
- Exports RBAC, logs UI, exemples de tickets.

# STD — D11 — Authentification Continue & Accès Conditionnel

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Exigences minimales (baseline)
- Legacy auth bloqué.
- Politiques conditionnelles sur accès sensibles :
  - appareil conforme (MDM)
  - risque élevé → blocage
  - impossible travel → challenge/blocage
- Revues politiques : trimestriel.

## 2. Renforcé (régulé)
- Policies strictes sur périmètre critique (admin, prod).
- Alerting SOC sur changements policies.

## 3. Preuves
- Export policies + journal changements.

# STD — D14 — Case Management & Workflows

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Champs obligatoires (par incident)
- ID, sévérité, owner, statut, horodatages (créé/trié/contain/clos)
- Liens : alertes → tickets → actions (D13) → preuves (D08)

## 2. Workflow (minimum)
- New → Triage → Investigate → Contain → Eradicate → Recover → Post-mortem

## 3. SLA (référence)
- Triage : critique ≤ 1h, élevé ≤ 4h, moyen ≤ 24h

## 4. Renforcé (régulé)
- Two-person approval pour clôture incidents critiques.
- Conservation des versions de communications.

## 5. Preuves
- Modèle de ticket + exemples.

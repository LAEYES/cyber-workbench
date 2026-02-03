# Checklist Conformité (RGPD / NIS2 / DORA / PCI DSS) — D01

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

> Checklist **license-safe** : exigences résumées (sans texte normatif). À adapter au statut/périmètre.

## RGPD (minimum)
- [ ] Registre des traitements à jour (owner, finalités, sous-traitants) — **preuve :** export registre
- [ ] Base légale documentée pour chaque traitement — **preuve :** fiche traitement
- [ ] DPIA réalisés pour traitements à risque — **preuve :** DPIA + validation
- [ ] Procédure violation données (notification ≤ 72h) testée — **preuve :** procédure + exercice

## NIS2 (minimum)
- [ ] Gouvernance sécurité (rôles, reporting) — **preuve :** PSSI + RACI
- [ ] Gestion des risques formalisée — **preuve :** registre risques + revues
- [ ] Gestion incidents + notification — **preuve :** playbook + tickets
- [ ] Sécurité supply chain — **preuve :** TPRM + clauses + inventaire tiers

## DORA (minimum, si applicable)
- [ ] ICT risk management framework — **preuve :** politiques + standards
- [ ] Tests de résilience (au moins annuels sur périmètre critique) — **preuve :** rapport tests
- [ ] Gestion prestataires ICT critiques — **preuve :** classification fournisseurs + audits
- [ ] Reporting incidents majeurs — **preuve :** procédure + RACI

## PCI DSS (minimum, si applicable)
- [ ] Périmètre CDE identifié et isolé — **preuve :** diagramme + règles réseau
- [ ] Gestion vulnérabilités/patching sur CDE — **preuve :** SLA + rapports
- [ ] Logging/audit trails centralisés — **preuve :** SIEM + rétention
- [ ] Tests réguliers (scan, pentest selon périmètre) — **preuve :** rapports

## Critères d’audit (pass/fail)
- [ ] Statut réglementaire déterminé (RGPD/NIS2/DORA/PCI).
- [ ] RACI + procédures documentées.
- [ ] Preuves collectées et accessibles (liens).

---
*Checklist modèle : compléter par liens, preuves et owners.*

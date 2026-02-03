# CHK — MASTER — Audit Readiness (transverse)

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Gouvernance & risques
- [ ] D01 : politiques en vigueur, revues périodiques.
- [ ] D15 : registre risques à jour + acceptations time-boxed.

## 2. Identité (humain + machine)
- [ ] D02/D11 : MFA + RBAC/SoD + revues accès.
- [ ] D17 : workload identity + pas de secrets statiques en prod.

## 3. Détection & réponse
- [ ] D10 : logs critiques ingérés, use cases prioritaires actifs.
- [ ] D13 : playbooks + audit trails + approvals.
- [ ] D14 : case management + SLA triage.

## 4. Durcissement & vulnérabilités
- [ ] D05 : patching conforme SLA, EDR coverage.
- [ ] D06 : gates SDLC + vuln mgmt.

## 5. Données & crypto
- [ ] D07 : classification + sauvegardes + tests.
- [ ] D09 : gestion clés, rotation, PKI.

## 6. Supply chain
- [ ] D16 : SBOM 100% prod + signing + provenance (si requis).

## 7. Résilience
- [ ] D12 : RPO/RTO définis + tests DR/restore prouvés.

## 8. Conformité & preuves
- [ ] D08 : chaîne de preuve + rétention conforme.
- [ ] Preuves immuables pour incidents/décisions critiques (régulé).

---
*Pass/fail : si une case critique est « non », déclencher plan d’action + échéance + owner.*

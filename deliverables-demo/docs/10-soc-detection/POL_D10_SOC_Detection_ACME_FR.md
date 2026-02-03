# POL — D10 — SOC / Détection & Réponse (SIEM, XDR, IR, CTI)

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Mission
Mettre en place un « système nerveux cyber » : détection (SIEM/XDR), réponse (IR/SOAR), renseignement (CTI), et gestion des incidents, avec exigences **mesurables** (MTTD/MTTR, couverture logs, qualité des alertes).

## 2. Exigences minimales (baseline)
### 2.1 Couverture logs (obligatoire)
- Centraliser au minimum : IdP/IAM, EDR, firewalls/VPN, cloud audit, DNS.
- Rétention : **≥ 90 jours** (baseline).

### 2.2 Détection & triage
- Catalogue de cas d’usage (use cases) priorisé (phishing, admin abuse, malware, lateral movement).
- SLA triage alertes :
  - Critique : **≤ 1h**
  - Élevé : **≤ 4h**
  - Moyen : **≤ 24h**

### 2.3 Réponse à incident
- Runbooks IR documentés (containment, eradication, recovery).
- Exercices : **annuel**.

## 3. Exigences renforcées (régulé)
- Rétention logs : **≥ 180 jours** + intégrité.
- SOAR/playbooks automatisés (isolation endpoint, blocage IOC, disable account).
- CTI intégrée (feeds) + validation.
- Exercices : **semestriel** sur périmètre critique.

## 4. Critères d’audit (pass/fail)
- [ ] Sources logs minimum intégrées.
- [ ] SLA triage définis et mesurés.
- [ ] Runbooks IR + exercices.
- [ ] Rétention et intégrité des logs.

## 5. Preuves
- Liste sources log + taux d’ingestion.
- Tickets d’alertes avec délais.
- Rapports d’exercices IR.

---
*Politique modèle : à décliner en standards SIEM logging, playbooks IR, use cases, CTI.*

# CHK — D03 — Checklist réseau & infrastructure

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Inventaire & MCO
- [ ] Inventaire à jour (owner, version, EOL).
- [ ] Backups config (daily critique / weekly autre) + restore test trimestriel.

## 2. Segmentation
- [ ] Segments minimum (USER/SRV/ADMIN/DMZ/BACKUP/DATA/IOT).
- [ ] Matrice flux revue (trimestriel critique / semestriel autre).
- [ ] USER→DATA interdit.

## 3. Firewall
- [ ] Deny-by-default inter‑zones.
- [ ] Règles avec owner/justif/revue/expiration.
- [ ] Règles temporaires ≤ 30j.
- [ ] Logs deny + allow sensible ; rétention ≥ 90j/180j.

## 4. Accès distant
- [ ] MFA obligatoire.
- [ ] Posture minimale pour accès sensible.
- [ ] Split tunneling interdit (exceptions time-boxed).
- [ ] Logs centralisés.

## 5. Renforcé (régulé)
- [ ] Micro-seg workloads critiques.
- [ ] Bastion + session recording.
- [ ] Double validation sur périmètre critique.

---
*Checklist : compléter avec preuves (exports, tickets, dashboards).* 

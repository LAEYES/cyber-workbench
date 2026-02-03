# STD — D07 — Sauvegarde & Reprise (Backup/Recovery)

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Exigences minimales (baseline)
- RPO/RTO définis pour systèmes critiques.
- Sauvegardes chiffrées.
- Tests de restauration : **trimestriel** (critique), **semestriel** (autre).

## 2. Renforcé (régulé)
- Backups immuables (WORM) + compte/stockage séparé.
- Tests de restauration : **mensuel** sur périmètre critique.
- Preuves des restaurations + runbooks.

## 3. Critères d’audit
- [ ] RPO/RTO définis.
- [ ] Backups chiffrés.
- [ ] Tests restauration planifiés et prouvés.

## 4. Preuves
- Rapports sauvegarde, rapports tests restauration, runbooks.

# STD — D03 — Standard pare-feu (firewall)

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Objet
Définir une gouvernance **auditable** des règles firewall/NGFW (on‑prem + cloud).

## 2. Règles (obligatoires)
- Deny-by-default inter‑zones.
- Toute règle a : owner, justification, app/service, date création, date revue, expiration.
- Règles temporaires : expiration obligatoire (max **30 jours**).

## 3. Journalisation (minimum)
- Log deny par défaut.
- Log allow sur flux sensibles (ADMIN/DMZ/DATA/BACKUP).
- Rétention logs : **≥ 90 jours** (baseline) / **≥ 180 jours** (régulé).

## 4. Revue & clean-up
- Revue règles : **semestriel** (baseline) / **trimestriel** (critique ou régulé).
- Nettoyage : règles orphelines/shadow/objets non utilisés.

## 5. Sécurité plateforme
- Admin depuis zone ADMIN, MFA, RBAC.
- Backups config + test restauration.

## 6. Renforcé (régulé)
- Double validation (réseau + sécurité) sur périmètre critique.
- Tests de non‑régression (simulation) pour changements majeurs.

## 7. Preuves attendues
- Exports politiques + changelog.
- Tickets de change + revues.

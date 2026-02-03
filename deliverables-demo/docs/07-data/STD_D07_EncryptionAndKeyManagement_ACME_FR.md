# STD — D07 — Chiffrement & Gestion des Clés

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Exigences minimales (baseline)
- TLS 1.2+ en transit.
- Chiffrement au repos pour Confidentiel+.
- Rotation clés/secrets critiques : **≤ 12 mois** (ou selon outil).

## 2. Renforcé (régulé)
- KMS/HSM/BYOK sur périmètre critique.
- Séparation des rôles : admin clés ≠ admin données.
- Journalisation des opérations KMS ; rétention **≥ 180 jours**.

## 3. Critères d’audit
- [ ] TLS en place.
- [ ] At-rest encryption Confidentiel+.
- [ ] Rotation et logs KMS.

## 4. Preuves
- Config TLS/KMS + historique rotation + logs.

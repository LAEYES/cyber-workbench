# Checklist Postes & Endpoints (D05)

**Organisation :** ACME  
**Date :** 2026-02-03

## 1. Inventaire & conformité
- [ ] Inventaire endpoints à jour (propriétaire, OS, criticité).
- [ ] OS supporté et versions à jour.
- [ ] Chiffrement disque activé (au moins laptops).

## 2. Durcissement
- [ ] Baseline GPO/MDM appliquée (verrouillage, restrictions macros/scripts).
- [ ] Pas d’admin local pour usage quotidien ; comptes admin dédiés.
- [ ] Pare-feu hôte actif et configuré.

## 3. Patching
- [ ] Outil de patching central + reporting.
- [ ] SLA patching défini ; suivi des écarts.
- [ ] Applications critiques couvertes (navigateurs, PDF, VPN, agents).

## 4. EDR / AV
- [ ] Couverture EDR/AV ~100%.
- [ ] Exclusions minimales et revues.
- [ ] Procédure d’isolation/quarantaine.

## 5. Données & périphériques
- [ ] Verrouillage automatique + protection session.
- [ ] Politique USB/BYOD (si applicable) et contrôles.

## 6. Renforcé (régulé)
- [ ] Postes admin dédiés (PAW) + segmentation.
- [ ] Allow-list applicative sur périmètre critique.
- [ ] Logs renforcés + rétention + intégrité.
- [ ] Tests EDR et exercices réguliers.

---
*Checklist modèle : à compléter avec preuves et liens vers les politiques/standards.*

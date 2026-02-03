# Inventaire & cartographie des actifs — D01

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Modèle d’inventaire (obligatoire)

| ID | Type | Nom | Owner | Criticité (C/I/D) | Données | Localisation | Fournisseur | Exposition | Dernière revue | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| A-001 | Application | CRM | DSI | Élevée/Élevée/Moy | Client | Cloud | … | Internet/Interne | 2026-03-31 | … |

## 2. Règles de qualité (pass/fail)
- [ ] Owner obligatoire pour 100% des actifs.
- [ ] Criticité C/I/D renseignée pour 100% des actifs.
- [ ] Classification des données renseignée pour 100% des actifs.
- [ ] Exposition (Internet/Interne) renseignée.

## 3. Cadence de revue (minimum)
- Actifs critiques : revue **trimestrielle**.
- Actifs non critiques : revue **annuelle**.

## 4. Classification des données
- Public / Interne / Confidentiel / Très sensible

## 5. Preuves attendues
- Export inventaire (CSV/YAML) + historique des revues.

---
*Template : à maintenir en continu ; sert de base à la gestion des risques et aux décisions d’architecture.*

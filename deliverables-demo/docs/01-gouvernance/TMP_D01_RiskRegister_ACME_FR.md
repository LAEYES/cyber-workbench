# Registre des risques SI (ISO 27005 / EBIOS light)

**Organisation :** ACME  
**Date :** 2026-02-03

## Échelle (exemple)
- **Vraisemblance**: 1 (rare) → 5 (très probable)
- **Impact**: 1 (faible) → 5 (critique)
- **Niveau** = V × I (seuils à définir)

## Registre (modèle)

| ID | Actif/Process | Scénario | Menace | Vulnérabilité | V | I | Niveau | Traitement | Contrôles (ISO/NIST) | Proprio | Échéance | Statut |
|---|---|---|---|---|---:|---:|---:|---|---|---|---|---|
| R-001 | Identités | Compromission compte admin | Phishing / vol creds | MFA absent, revue droits inexistante | 4 | 5 | 20 | Réduire | A.5/A.8 / PR.AA | RSSI | 2026-03-31 | Ouvert |
| R-002 | Données clients | Exfiltration via SaaS | Mauvaise conf | DLP absent, partage public | 3 | 5 | 15 | Réduire | A.8 / PR.DS | DPO | 2026-04-30 | Ouvert |

## Notes
- Lier chaque risque à la **cartographie d’actifs** et au **plan de traitement**.
- Formaliser l’**acceptation** (qui, pourquoi, durée).

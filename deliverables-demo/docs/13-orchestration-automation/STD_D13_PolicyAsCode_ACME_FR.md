# STD — D13 — Policy-as-Code (Guardrails & Controls)

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Exigences minimales (baseline)
- Policies versionnées (Git) avec PR obligatoires.
- Tests de non-régression (lint/validate) avant merge.
- Rollback documenté.

## 2. Périmètre
- Cloud guardrails, segmentation réseau, baselines endpoints, IAM policies.

## 3. Renforcé (régulé)
- Signature des policies/artefacts.
- Two-person rule sur changements critiques.

## 4. Preuves
- PRs, pipelines, artefacts signés.

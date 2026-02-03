# Checklist Sécurité Applicative & SDLC (D06)

**Organisation :** ACME  
**Date :** 2026-02-03

## 1. Gouvernance
- [ ] Owner applicatif identifié ; périmètre et criticité.
- [ ] Exigences sécurité documentées.
- [ ] Threat modeling réalisé pour applis exposées / données sensibles.

## 2. Développement sécurisé
- [ ] PR + revue de code systématique.
- [ ] Règles secure coding appliquées (validation entrées, authz, gestion erreurs).
- [ ] Sécurité API : OIDC/OAuth2, scopes, rate limit.

## 3. CI/CD & supply chain
- [ ] SAST + SCA intégrés en CI.
- [ ] Secrets absents des dépôts ; vault.
- [ ] Traçabilité PR → build → déploiement.

## 4. Vulnérabilités
- [ ] Processus triage/correction avec SLA.
- [ ] Re-test après correction.

## 5. Renforcé (régulé)
- [ ] SBOM + provenance / signature d’artefacts.
- [ ] Pentest avant prod et périodique sur périmètre critique.
- [ ] Gouvernance formalisée (reporting, risk acceptance).

---
*Checklist modèle : à compléter avec preuves et liens vers pipelines/rapports.*

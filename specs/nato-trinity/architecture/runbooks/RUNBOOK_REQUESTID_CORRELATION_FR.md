# RUNBOOK — Corrélation RequestId (FR)

## Objectif
Utiliser le `requestId` pour corréler erreurs API (problem+json), AuditEvents et opérations de preuve.

## Procédure
1) En cas d’erreur client, récupérer le `requestId` dans la réponse `application/problem+json`.
2) Rechercher les AuditEvents (API ou stockage) filtrés sur `requestId`.
3) Identifier l’objet impacté (risk/case/evidencePackage) et l’acteur.
4) Si nécessaire, exporter un EvidencePackage sur le scope impacté.

## Notes
- Le `requestId` doit être généré par l’API gateway et propagé bout-en-bout (ADR-0013).
- En périmètre régulé, conserver les artefacts de corrélation selon la rétention.

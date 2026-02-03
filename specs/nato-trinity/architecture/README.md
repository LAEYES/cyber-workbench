# NATO Trinity — Architecture dossier

Contenu :
- `ARCHITECTURE_FR.md` : blueprint technique (FR)
- `api/` : surface API (draft)
- `schemas/` : JSON Schemas (v0)
- `adr/` : Architecture Decision Records
- `diagrams/` : diagrammes Mermaid
- `runbooks/` : procédures opérationnelles

Règle : le **DB** est la source-of-record. Search est dérivé (ADR-0004). Les preuves sont vérifiées via manifests + hashing/signing (ADR-0003) et WORM en régulé (ADR-0001).

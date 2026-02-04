# NATO Trinity — Architecture dossier

Contenu :
- `ARCHITECTURE_FR.md` : blueprint technique (FR)
- `api/` : surface API (draft)
- `schemas/` : JSON Schemas (v0)
- `adr/` : Architecture Decision Records
- `diagrams/` : diagrammes Mermaid
- `runbooks/` : procédures opérationnelles

Règle : le **DB** est la source-of-record. Search est dérivé (ADR-0004). Les preuves sont vérifiées via manifests + hashing/signing (ADR-0003) et WORM en régulé (ADR-0001).

## MVP — Evidence Engine (CLI + WinForms)

### Store layout (local MVP)
Per org:
- `nato-mvp-store/<orgId>/evidence.json` : Evidence metadata DB (keyed by `evidenceId`)
- `nato-mvp-store/<orgId>/evidence-blobs/<evidenceId>_<filename>` : immutable-ish blob copy
- `nato-mvp-store/<orgId>/chain-of-custody/<evidenceId>.jsonl` : hash-chained chain-of-custody events

### EvidencePackage export
- `cyberwb nato:mvp-export-from-store --scope risk:<id>`
- `cyberwb nato:mvp-export-from-store --scope case:<id>`

Exports include:
- metadata snapshots (risk/case/decisions)
- referenced evidence blobs (preserving original `evidenceId`)
- a chain-of-custody `accessed` event is appended on export

### Verify
- Bundle: `nato:mvp-verify-bundle` + `nato:mvp-verify-manifest`
- Chain-of-custody: `nato:mvp-chain-verify`

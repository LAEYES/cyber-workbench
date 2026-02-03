# NATO Trinity — Specs

## Contents
- `NATO_Trinity_Spec_v1.0_FR-EN.md` — normative specification (FR+EN)
- `architecture/` — technical blueprint (ADRs, schemas, OpenAPI, runbooks)
- `CHANGELOG.md` — change history

## Validation
From repo root:
- Validate OpenAPI + JSON schemas:
  - `npm run nato:validate`
- Validate a bundle manifest (EvidencePackage):
  - `npm run nato:bundle-check -- <path-to-manifest.json>`

## ADR status
ADRs are marked **Proposed** by default. When we freeze decisions for implementation, we can flip selected ADRs to **Accepted**.

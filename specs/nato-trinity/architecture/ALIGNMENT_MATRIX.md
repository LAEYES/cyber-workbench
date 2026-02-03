# NATO Trinity — Alignment Matrix (Spec ↔ Architecture ↔ OpenAPI ↔ Schemas)

Purpose: make divergences explicit and drive audit-ready consistency across:
- **Spec** (`specs/nato-trinity/NATO_Trinity_Spec_v1.0_FR-EN.md`)
- **Architecture blueprint** (`specs/nato-trinity/architecture/ARCHITECTURE_*.md`)
- **ADRs** (`specs/nato-trinity/architecture/adr/`)
- **JSON Schemas** (`specs/nato-trinity/architecture/schemas/*.schema.json`)
- **OpenAPI** (`specs/nato-trinity/architecture/openapi/openapi.yaml`)

Legend: **OK** (aligned) / **PARTIAL** (present but diverges) / **GAP** (missing)

## 1) Core entities

### Risk
- Spec: **OK** (Risk register + lifecycle)
- ADR: **OK** (see ADR set for governance, evidence, SoD)
- JSON Schema: **OK** (`risk.schema.json`)
- OpenAPI: **PARTIAL** (`components.schemas.Risk` exists but does **not** include envelope fields like `id,type,version,createdAt,createdBy,updatedAt`)
- Notes/TODO:
  - Decide canonical shape for API payloads: either **domain-only** objects or **enveloped** objects.

### Decision
- Spec: **OK** (accept requires expiry; SoD)
- ADR: **OK** (SoD, approvals)
- JSON Schema: **OK** (`decision.schema.json`, includes conditional `accept => expiryDate required`)
- OpenAPI: **PARTIAL** (`components.schemas.Decision` exists but lacks envelope fields and conditional constraint)
- Notes/TODO:
  - Update OpenAPI to express `accept => expiryDate required` (e.g., `oneOf` variants).

### Case
- Spec: **OK** (case / incident-like handling)
- ADR: **OK** (case handling runbooks)
- JSON Schema: **OK** (`case.schema.json`)
- OpenAPI: **GAP** (schema/endpoints missing)

### Evidence
- Spec: **OK**
- ADR: **OK** (evidence handling/retention, manifests)
- JSON Schema: **OK** (`evidence.schema.json`)
- OpenAPI: **PARTIAL** (`components.schemas.Evidence` exists but lacks envelope fields)

### EvidencePackage
- Spec: **OK**
- ADR: **OK** (bundle format ADR-0010)
- JSON Schema: **OK** (`evidencePackage.schema.json`)
- OpenAPI: **PARTIAL** (`components.schemas.EvidencePackage` exists but lacks envelope fields)

### AuditEvent
- Spec: **OK** (audit trail)
- ADR: **OK**
- JSON Schema: **OK** (`auditEvent.schema.json`)
- OpenAPI: **PARTIAL** (`components.schemas.AuditEvent` exists but lacks envelope fields)

### ChainOfCustodyEvent
- Spec: **OK**
- ADR: **OK**
- JSON Schema: **OK** (`chainOfCustodyEvent.schema.json`)
- OpenAPI: **GAP**

### Gate / GateResult
- Spec: **OK**
- ADR: **OK**
- JSON Schema: **OK** (`gate.schema.json`, `gateResult.schema.json`)
- OpenAPI: **PARTIAL** (GateResult present; Gate missing; envelope fields missing)

### Exception / LegalHold
- Spec: **OK**
- ADR: **OK**
- JSON Schema: **OK** (`exception.schema.json`, `legalHold.schema.json`)
- OpenAPI: **PARTIAL** (Exception + LegalHold present but lacks envelope fields)

### Manifest
- Spec: **OK** (hashing/signing)
- ADR: **OK** (ADR-0003/0010)
- JSON Schema: **OK** (`manifest.schema.json`)
- OpenAPI: **GAP**

### Playbook / ExecutionTrace
- Spec: **OK**
- ADR: **OK**
- JSON Schema: **OK** (`playbook.schema.json`, `executionTrace.schema.json`)
- OpenAPI: **GAP**

## 2) Immediate alignment tasks (recommended order)

1. **Decide canonical API payload shape** (domain-only vs enveloped).
2. Update `openapi.yaml` schemas to match JSON Schemas (or explicitly document deviations).
3. Add missing OpenAPI schemas/endpoints for Case + ChainOfCustodyEvent + Gate + Manifest (at least schemas).
4. Add CI checks to detect drift (see `scripts/validate-nato-trinity.mjs`).

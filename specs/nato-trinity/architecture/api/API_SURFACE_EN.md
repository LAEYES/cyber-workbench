# NATO Trinity — API Surface (EN) (Draft)

## Principles
- All routes are **org-scoped** (`orgId`) and RBAC-filtered.
- Sensitive actions emit an AuditEvent (REQ-TRI-006).

## Endpoints (proposal)
### Risk Engine
- `GET /api/v1/risks`
- `POST /api/v1/risks`
- `POST /api/v1/risks/{riskId}/decisions`
- `POST /api/v1/exceptions`

### Policy-as-Code
- `GET /api/v1/gates`
- `POST /api/v1/gates`
- `POST /api/v1/gates/{gateId}/run` (creates GateResult + ExecutionTrace)
- `GET /api/v1/playbooks`
- `POST /api/v1/playbooks/{playbookId}/run`

### Evidence Engine
- `GET /api/v1/evidence`
- `POST /api/v1/evidence/ingest` (collectors)
- `POST /api/v1/evidence-packages` (export)
- `GET /api/v1/evidence-packages/{packageId}`

### Audit / Admin
- `GET /api/v1/audit-events`
- `POST /api/v1/admin/retention` (regulated: two-person)

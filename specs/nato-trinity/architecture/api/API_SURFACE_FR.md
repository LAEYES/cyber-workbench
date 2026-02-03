# NATO Trinity — Surface API (FR) (Draft)

## Principes
- Toutes les routes sont **scopées org** (`orgId`) et filtrées RBAC.
- Les actions sensibles créent un audit event (REQ-TRI-006).

## Endpoints (proposition)
### Risk Engine
- `GET /api/v1/risks`
- `POST /api/v1/risks`
- `POST /api/v1/risks/{riskId}/decisions`
- `POST /api/v1/exceptions`

### Policy-as-Code
- `GET /api/v1/gates`
- `POST /api/v1/gates`
- `POST /api/v1/gates/{gateId}/run` (crée GateResult + ExecutionTrace)
- `GET /api/v1/playbooks`
- `POST /api/v1/playbooks/{playbookId}/run`

### Evidence Engine
- `GET /api/v1/evidence`
- `POST /api/v1/evidence/ingest` (collectors)
- `POST /api/v1/evidence-packages` (export)
- `GET /api/v1/evidence-packages/{packageId}`

### Audit / Admin
- `GET /api/v1/audit-events`
- `POST /api/v1/admin/retention` (régulé: two-person)

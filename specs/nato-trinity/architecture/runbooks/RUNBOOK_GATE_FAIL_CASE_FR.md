# RUNBOOK — Gate fail → Case ≤ 24h (FR)

## Objectif
Démontrer et vérifier la conformité à **REQ-TRI-008** : tout `GateResult=fail` doit créer ou lier un **case/ticket** dans les **24h**.

## Preuves attendues
- GateResult (status=fail) avec `executedAt`
- Case/ticket lié (`caseRef` ou ticketId)
- AuditEvent(s) corrélés (`requestId` si disponible)

## Procédure de vérification
1) Identifier un `gateResultId` en échec.
2) Vérifier `status=fail` et `executedAt`.
3) Vérifier présence de `caseRef` (ou lien ticket dans `details`).
4) Comparer timestamps : `case.createdAt` - `executedAt` ≤ 24h.
5) Si non conforme : ouvrir incident de conformité, assigner owner, plan correctif.

## Notes
- En régulé, l’action peut nécessiter approvals supplémentaires selon policy.
- Conserver la trace (EvidencePackage) si audit.

# RUNBOOK — Signing key rotation (EN)

## Goal
Rotate signing keys (manifests / EvidencePackages) per policy (baseline yearly, regulated ≤ 6 months) and support revocation upon incident.

## Prerequisites
- KMS/HSM access (Admin + Approver / two-person in regulated).
- Inventory of active `keyId` values and signed manifests.

## Procedure (checklist)
1) Create a new key in KMS/HSM (new `keyId`).
2) Mark the new `keyId` as **active**.
3) Switch signing of new manifests to the active `keyId`.
4) Mark the previous key as **retired** (kept for verification).
5) Validate: export an EvidencePackage and verify signature OK.
6) Record: AuditEvent + rotation evidence.

## Incident (compromise)
- Mark the key as **revoked**.
- Generate a new key.
- Keep full trace (AuditEvent) and assess impact.

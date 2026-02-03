# ADR-0009 — KMS/HSM and signing keys

**Status:** Proposed  
**Date:** {{today}}

## Context
Manifests and, optionally, evidence packages may be signed (ADR-0003). The platform must protect signing keys and rotate them (baseline yearly, regulated ≤ 6 months).

## Decision
- Store platform signing keys in **KMS/HSM**.
- Signing operations are performed via KMS/HSM APIs; private keys never leave the service boundary.
- Maintain key metadata: `keyId`, `createdAt`, `rotationSchedule`, `status(active|retired|revoked)`.
- EvidencePackage manifests include `keyId` (when signed) to enable verification.

## Consequences
- Stronger non-repudiation and audit posture.
- Requires operational processes for rotation and incident revocation.

## Notes
- Workload/service identities should use short-lived tokens (D17 concepts).
- In regulated mode, signing key operations should require additional approvals (policy-driven).

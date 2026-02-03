# IaC (Infrastructure as Code) Security Standard

**Organization:** ACME  
**Version:** 0.1 (draft)  
**Date:** 2026-02-03

## 1. Purpose
Define security requirements for Infrastructure as Code (Terraform, Bicep, CloudFormation, Pulumi, Kubernetes manifests) to reduce misconfigurations and secure the delivery pipeline.

## 2. Baseline requirements
### 2.1 Code management
- IaC must be versioned in a repository (Git) with protected branches (PR required).
- Peer review and approval before merge.

### 2.2 Templates & modules
- Use validated modules (golden modules); limit ad-hoc resources.
- Parameterize via variables; secrets are prohibited in code.

### 2.3 Scanning & policy-as-code
- IaC scanning in CI (misconfig + secrets; and image vulns when applicable).
- Policy-as-code: minimum rules (no unapproved public storage, encryption required, logging required).

### 2.4 Separation & promotion
- Separate environments (dev/test/prod) with controlled promotion.
- Plans/applies executed by a dedicated automation identity.

### 2.5 State & artifacts
- Encrypted state backend + locking + strict access control.
- Signed artifacts where feasible (e.g., build provenance).

## 3. Enhanced requirements (regulated sectors)
- Strong approvals (two-person rule) for changes on critical scope.
- End-to-end traceability: PR → plan → apply → resources.
- Drift detection and remediation.
- Hardened and isolated runners; network restrictions.

## 4. Expected evidence (examples)
- Branch protection policy.
- IaC scan reports.
- Sample policy-as-code rules.
- State backend configuration.

---
*Template document: adapt to the IaC tooling and cloud provider.*

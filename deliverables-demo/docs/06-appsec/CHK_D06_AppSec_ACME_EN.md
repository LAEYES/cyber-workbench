# Application Security & SDLC Checklist (D06)

**Organization:** ACME  
**Date:** 2026-02-03

## 1. Governance
- [ ] Application owner identified; scope and criticality.
- [ ] Security requirements documented.
- [ ] Threat modeling performed for internet-facing apps / sensitive data.

## 2. Secure development
- [ ] PR + systematic code review.
- [ ] Secure coding rules applied (input validation, authz, error handling).
- [ ] API security: OIDC/OAuth2, scopes, rate limiting.

## 3. CI/CD & supply chain
- [ ] SAST + SCA in CI.
- [ ] No secrets in repos; use a vault.
- [ ] Traceability PR → build → deployment.

## 4. Vulnerabilities
- [ ] Triage/remediation process with SLAs.
- [ ] Re-test after fixes.

## 5. Enhanced (regulated)
- [ ] SBOM + provenance / artifact signing.
- [ ] Pre-prod and periodic pentests for critical scope.
- [ ] Formal governance (reporting, risk acceptances).

---
*Template checklist: complete with evidence and links to pipelines/reports.*

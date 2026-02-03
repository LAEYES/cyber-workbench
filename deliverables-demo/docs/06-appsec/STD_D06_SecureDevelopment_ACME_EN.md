# Secure Development Standard (D06)

**Organization:** ACME  
**Version:** 0.1 (draft)  
**Date:** 2026-02-03

## 1. Purpose
Define secure development requirements (secure coding, reviews, CI) for applications and APIs.

## 2. Baseline requirements
### 2.1 Code review
- PRs are required with peer review.
- Security review required for sensitive components (auth, crypto, payments, admin access).

### 2.2 Coding standards
- Input validation/normalization; output encoding.
- Strong AuthN/AuthZ (RBAC/ABAC), anti-CSRF where applicable.
- Error handling without info leakage; meaningful logging.

### 2.3 API security
- Strong authentication (OIDC/OAuth2), scopes/permissions.
- Rate limiting and abuse protection.

### 2.4 CI/CD
- Reproducible builds; pinned/controlled dependencies.
- Separate secrets from config.

## 3. Enhanced requirements (regulated sectors)
- Formal AppSec review for critical applications.
- Blocking automated security tests with thresholds (SAST/SCA) + controlled exceptions.
- Cryptography guidelines (approved algorithms, key rotation, HSM where required).

## 4. Expected evidence
- Branch protection and PR rules.
- Examples of reviews and checklists.

---
*Template standard: adapt to languages, frameworks and CI/CD tooling.*

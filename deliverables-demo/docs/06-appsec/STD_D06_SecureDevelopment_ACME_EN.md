# Secure Development Standard (D06)

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Purpose
Define **prescriptive and auditable** secure development requirements (secure coding, reviews, CI) for applications and APIs.

## 2. Baseline requirements
### 2.1 Code management (mandatory)
- Git repository with **protected branches**.
- **PR required** for changes to release branches.
- At least **1 reviewer**; **2 reviewers** recommended for sensitive components.

### 2.2 Merge gates
- CI build **passes**.
- Unit tests **pass**.
- SAST/SCA executed (see §2.4); critical findings fixed or approved exception.

### 2.3 Secure coding rules (minimum)
- **Input validation/normalization** (format, size, encoding) with explicit rejection.
- **Output encoding** (XSS) appropriate to context (HTML/JS/URL/SQL).
- **Error handling**: no stack traces/secrets; generic client messages.
- **AuthN/AuthZ**: server-side enforcement, RBAC/ABAC; separate admin roles.
- **CSRF** protections where sessions/cookies are used.
- **API security**: OAuth2/OIDC, scopes, rate limiting, brute-force protections.

### 2.4 Automated security testing (minimum)
- **SCA** (dependencies): each PR + nightly.
- **SAST**: each PR (or at least nightly).
- **Secret scanning**: each PR + history.
- Minimum thresholds:
  - Block on **critical** vulnerabilities unless exception.
  - Block on detected secrets.

### 2.5 CI/CD security
- Dedicated CI identities with least privilege.
- Prefer **short-lived tokens** (OIDC); avoid long-lived plaintext tokens.
- CI artifacts stored in an artifact repository/registry with access control.

## 3. Enhanced requirements (regulated sectors)
- Formal AppSec review for critical applications and major changes.
- Stronger blocking thresholds:
  - No **critical** in production; **high** limited with tracked exceptions.
- Crypto governance: approved algorithms, key rotation, HSM/KMS where required.
- Artifact signing + verification during deployment.

## 4. Recommended settings (examples)
- Branch protection: PR required + required status checks + no direct pushes.
- Reviewers: min 1 (baseline), min 2 for sensitive paths (regulated).
- Secrets: vault + runtime injection; rotate CI tokens.

## 5. Audit criteria (pass/fail)
- [ ] Protected branches + PR required.
- [ ] CI gates in place (build/tests + SAST/SCA + secret scanning).
- [ ] Secure coding rules documented and applied.
- [ ] Dedicated CI identities and least privilege.
- [ ] Exceptions tracked, approved, and time-boxed.

## 6. Expected evidence
- Branch protection rules.
- Sample PRs showing gates.
- SAST/SCA/secret scan reports.
- CI/CD permissions matrix.

---
*Template standard: adapt to languages, frameworks and CI/CD tooling.*

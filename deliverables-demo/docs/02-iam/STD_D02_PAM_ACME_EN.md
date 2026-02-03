# PAM Standard (Privileged Access Management)

**Organization:** ACME  
**Version:** 0.1 (draft)  
**Date:** 2026-02-03

## 1. Purpose
Define Privileged Access Management (PAM) requirements to reduce risk from high‑impact privileged accounts and secrets.

## 2. Scope
- Admin accounts (systems, network, databases, cloud), privileged service accounts, keys/API tokens.
- Critical systems: directories, hypervisors, network devices, CI/CD, production.

## 3. Baseline requirements
### 3.1 Accounts and separation
- Dedicated admin accounts (no admin rights on daily user accounts).
- No shared privileged accounts; if unavoidable: named traceability and compensating controls.

### 3.2 Vaulting and secret management
- Central vault for secrets when available.
- Periodic rotation of admin passwords and secrets; immediate rotation after an incident.
- Service accounts: inventory + owners + justification.

### 3.3 Privileged access
- Use a bastion/jump server for admin access when possible.
- MFA required for privileged access.
- **Just‑Enough Administration**: minimum rights per task.

### 3.4 Logging and monitoring
- Log: privileged logons, sensitive commands/actions, elevation, secret changes.
- Regular review of logs for critical scope.

### 3.5 Emergency (break‑glass) accounts
- Very limited, exceptional use only, monitored.
- Protected secrets (dual control when possible) and rotation after use.

## 4. Enhanced requirements (regulated environments)
- **Just‑In‑Time** elevation with approvals and time limits.
- Session recording for critical administration.
- Privileged admin workstation (PAW/SAW) for high‑risk actions.
- Segregation of duties (e.g., account creation ≠ privilege assignment ≠ approval).
- Log integrity and retention controls.

## 5. Controls and metrics (examples)
- % dedicated admin accounts, % secrets vaulted.
- Mean secret age; time to rotate after leavers.
- # JIT elevations vs standing privileges.

---
*Template document: adapt to your tooling (PAM, vault, bastion) and environments.*

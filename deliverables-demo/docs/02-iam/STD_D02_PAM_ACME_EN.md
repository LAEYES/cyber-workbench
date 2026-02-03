# STD — D02 — PAM Standard (Privileged Access Management)

**Organization:** ACME  
**Date:** 2026-02-03

## 1. Goal
Reduce risks associated with privileged accounts and sessions.

## 2. Scope
- AD/Entra admins, root, sudoers, cloud admins, DB admins, CI/CD, secrets.

## 3. Baseline requirements
- Separate admin accounts from standard user accounts.
- Vault privileged secrets/passwords.
- Rotate secrets on a defined schedule.
- Log and alert on privileged actions.

## 4. Regulated / enhanced
- Session recording (bastion/PAM proxy) with approvals.
- JIT elevation.
- Break-glass accounts with controls and periodic tests.

## 5. Evidence
- Privileged account inventory, rotation policies, session logs.

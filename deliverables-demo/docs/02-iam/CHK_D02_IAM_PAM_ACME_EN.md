# CHK — D02 — IAM/PAM Checklist

**Organization:** ACME  
**Date:** 2026-02-03

## IAM
- [ ] Identity inventory (human/service) up to date
- [ ] JML process documented + SLAs enforced
- [ ] MFA enabled on SSO/IdP and cloud consoles
- [ ] Third-party access: dedicated accounts + expiry
- [ ] Access reviews completed (evidence)

## PAM
- [ ] Privileged account list + owners
- [ ] Vault for privileged secrets in place
- [ ] Secret rotation
- [ ] Session recording / bastion (regulated)
- [ ] Break-glass tested

## Logs & evidence
- [ ] Authentication logs centralized
- [ ] Alerts on anomalies (impossible travel, MFA fatigue, etc.)

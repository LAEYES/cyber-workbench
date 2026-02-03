# IAM / PAM Checklist

**Organization:** ACME  
**Date:** 2026-02-03

> Usage: self‑assessment, audit readiness, remediation tracking.

## 1. IAM (baseline)
| Control | Expected | Evidence (examples) | Status |
|---|---|---|---|
| JML process | Joiner/Mover/Leaver defined | Procedure, tickets, workflow | ☐ OK ☐ KO ☐ N/A |
| Leavers < 24h | Disable on exit | HR/IT export, IdP logs | ☐ OK ☐ KO ☐ N/A |
| Named accounts | No shared accounts | Inventory, exceptions | ☐ OK ☐ KO ☐ N/A |
| MFA remote access | VPN/VDI/portals | IdP policies | ☐ OK ☐ KO ☐ N/A |
| Access reviews | Periodic (>= quarterly) | Minutes, group exports | ☐ OK ☐ KO ☐ N/A |
| IAM logging | Auth, failures, changes | SIEM, IdP logs | ☐ OK ☐ KO ☐ N/A |

## 2. PAM (baseline)
| Control | Expected | Evidence (examples) | Status |
|---|---|---|---|
| Dedicated admin accounts | Separate admin vs user | Directory/groups | ☐ OK ☐ KO ☐ N/A |
| MFA for privileged access | MFA enforced | IdP policies | ☐ OK ☐ KO ☐ N/A |
| Secret vault | Central vault when possible | Vault config, procedures | ☐ OK ☐ KO ☐ N/A |
| Secret rotation | Periodic + after incident | Rotation reports | ☐ OK ☐ KO ☐ N/A |
| Break‑glass accounts | Controlled, monitored | Procedure, logs | ☐ OK ☐ KO ☐ N/A |
| Admin activity logs | Sensitive actions logged | SIEM, system logs | ☐ OK ☐ KO ☐ N/A |

## 3. Enhanced requirements (regulated environments)
| Control | Expected | Evidence (examples) | Status |
|---|---|---|---|
| Phishing‑resistant MFA | FIDO2/WebAuthn for admins/critical | IdP config, factor inventory | ☐ OK ☐ KO ☐ N/A |
| JIT / approvals | Time‑bound elevation with approval | PAM/JIT logs | ☐ OK ☐ KO ☐ N/A |
| Session recording | Record critical admin sessions | PAM tooling, replays | ☐ OK ☐ KO ☐ N/A |
| PAW/SAW | Dedicated admin workstation | Inventory, endpoint policies | ☐ OK ☐ KO ☐ N/A |
| Log integrity | Retention + tamper resistance | SIEM/WORM, access controls | ☐ OK ☐ KO ☐ N/A |

## 4. Action plan (optional)
| Action | Priority | Owner | Due date |
|---|---|---|---|
|  |  |  |  |

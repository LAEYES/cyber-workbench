# Information Security Risk Register (ISO 27005 / EBIOS-light)

**Organization:** ACME  
**Date:** 2026-02-03

## Scale (example)
- **Likelihood**: 1 (rare) → 5 (very likely)
- **Impact**: 1 (low) → 5 (critical)
- **Risk** = L × I (define thresholds)

## Register (template)

| ID | Asset/Process | Scenario | Threat | Vulnerability | L | I | Risk | Treatment | Controls (ISO/NIST) | Owner | Due date | Status |
|---|---|---|---|---|---:|---:|---:|---|---|---|---|---|
| R-001 | Identities | Privileged account compromise | Phishing / credential theft | No MFA, no access reviews | 4 | 5 | 20 | Reduce | A.5/A.8 / PR.AA | CISO | 2026-03-31 | Open |
| R-002 | Customer data | SaaS data exfiltration | Misconfiguration | No DLP, public sharing | 3 | 5 | 15 | Reduce | A.8 / PR.DS | DPO | 2026-04-30 | Open |

## Notes
- Link each risk to the **asset inventory** and the **risk treatment plan**.
- Formalize **risk acceptance** (who, why, duration).

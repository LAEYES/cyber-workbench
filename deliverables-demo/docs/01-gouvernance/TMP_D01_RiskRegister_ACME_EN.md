# Information Security Risk Register (ISO 27005 / EBIOS-light)

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Scoring rules (mandatory)
- **Likelihood (L)**: 1 (rare) → 5 (very likely)
- **Impact (I)**: 1 (low) → 5 (critical)
- **Score** = L × I

## 2. Thresholds & treatment (example to validate)
- **1–5**: Acceptable (monitor)
- **6–10**: Planned reduction
- **11–15**: Priority reduction
- **16–25**: Immediate reduction / avoid (executive notified)

## 3. Mandatory fields (per risk)
Each risk must include:
- Unique ID (R-xxx)
- Asset/process in scope + owner
- Scenario and business consequence
- Threat + vulnerability
- L/I/Score + rationale
- Treatment (reduce/avoid/transfer/accept) + action plan
- Due date + status
- Remediation evidence / compensating control
- Risk acceptance decision (if applicable) + max duration

## 4. Register template

| ID | Asset/Process | Scenario (cause → impact) | Threat | Vulnerability | L | I | Score | Treatment | Controls / measures | Owner | Due date | Status |
|---|---|---|---|---|---:|---:|---:|---|---|---|---|---|
| R-001 | IAM | Admin compromise → takeover | Phishing | No MFA, no access reviews | 4 | 5 | 20 | Reduce immediately | Phishing-resistant MFA, PAM, monthly reviews | CISO | 2026-03-31 | Open |
| R-002 | SaaS | Data exfil → GDPR/financial | Misconfig | Public sharing, no DLP | 3 | 5 | 15 | Priority reduce | CSPM, guardrails, DLP, logging | DPO | 2026-04-30 | Open |

## 5. Review cadence (minimum)
- Scores **≥ 16**: weekly review until reduced.
- Scores **11–15**: monthly review.
- Others: quarterly review.

## 6. Risk acceptance rules
- Acceptances must be documented (rationale, compensating controls, duration, owner).
- Recommended max duration: **90 days** (baseline); **60 days** (regulated) before re-approval.

---
*Template: link to the treatment plan, asset inventory and evidence (tickets, reports, configs).*

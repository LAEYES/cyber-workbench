# ISMS Pack (ISO 27001) — D01

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Scope — mandatory
- Entities / sites: …
- Processes: …
- Assets / applications: …
- Interfaces & dependencies (third parties/cloud): …
- Exclusions (if any): … (justification)

## 2. Context & interested parties — mandatory
- Internal/external stakeholders: …
- Requirements (regulatory/contractual): …
- Key assumptions & constraints: …

## 3. Security objectives (SMART)
Define 3–10 **measurable** objectives (owner + due date).
Examples:
- Admin MFA **≥ 99%** within 90 days.
- Endpoint patch compliance **≥ 95%** (P1 ≤ 7d) within 6 months.
- Centralized logging for critical scope with retention **≥ 180d** within 6 months.

## 4. Roles & RACI (minimum)
| Activity | Exec | CISO | IT/Ops | DPO | Business |
|---|---|---|---|---|---|
| Security policy | A | R | C | C | C |
| Risk management | A | R | C | C | C |
| Access reviews | A | R | R | C | C |
| Incident management | A | R | R | C | C |

## 5. Statement of Applicability (SoA) — structure
For each control:
- Control (ID)
- Applicable (Yes/No)
- Justification (risk/constraint)
- Status (Planned/In progress/In place)
- Evidence (links)

## 6. Metrics (KPIs/KRIs) — minimum
Monthly tracking:
- MFA admins, MFA users
- Patching (endpoints/servers): compliance + MTTR
- EDR: coverage + inactive agents
- Access reviews: on-time completion
- Incidents: #, MTTD/MTTR, root causes

## 7. Risk treatment plan (RTP)
- Risk reference → actions → owner → due date → status → evidence
- Risks score ≥ 16: weekly tracking until reduced.

## 8. Audit criteria (pass/fail)
- [ ] Scope documented + exclusions justified.
- [ ] SMART objectives defined and tracked.
- [ ] SoA maintained with evidence.
- [ ] KPIs/KRIs tracked.
- [ ] RTP exists and is kept up to date.

---
*Template pack: complete with documents and evidence links and maintain continuously.*

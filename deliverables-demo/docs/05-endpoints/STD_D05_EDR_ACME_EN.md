# EDR / Antivirus Standard (D05)

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Purpose
Define **measurable** requirements for endpoint protection (EDR/AV): deployment, configuration, alerting, response, evidence.

## 2. Baseline requirements
### 2.1 Coverage & agent health (mandatory)
- EDR/AV coverage: **≥ 98%** of in-scope endpoints.
- Endpoints missing/inactive agent for > **24h**: remediate (reinstall) or **network quarantine**.
- Agent/definitions updates are automatic; endpoints lagging > **7 days** are tracked.

### 2.2 Prevention policy (minimum)
- Real-time protection enabled.
- PUA/PUP detection enabled.
- Block known malware and risky behaviors (tool-dependent).
- Anti-tampering enabled.

### 2.3 Exclusions (strict)
- Exclusions are **denied by default**.
- Any exclusion must be:
  - justified,
  - narrowly scoped (path/hash/process),
  - time-boxed (max **30 days**),
  - Security-approved,
  - reviewed monthly.

### 2.4 Alerting & response (SLAs)
- **Critical (high severity / ransomware / C2 / credential theft)**: respond **≤ 1h**.
- **High**: **≤ 4h**.
- **Medium**: **≤ 24h**.
- Endpoint **network isolation** capability enabled and tested.

### 2.5 Logging
- Centralize EDR telemetry/alerts (SIEM or centralized storage).
- Retention: **≥ 90 days** (baseline).

## 3. Enhanced requirements (regulated sectors)
- Coverage: **≥ 99.5%** for critical scope.
- EDR/SIEM retention: **≥ 180 days** (or per obligations) + log integrity.
- SOAR playbooks (when available): isolate host, kill process, block IOCs.
- Threat hunting at least monthly for critical scope.
- Regular testing: quarterly simulations (Atomic Red Team / internal tests).

## 4. Recommended settings (examples)
- Use high/strict policy for admin workstations and critical endpoints.
- Block risky scripting (unsigned PowerShell, macros) where supported.

## 5. Audit criteria (pass/fail)
- [ ] Coverage and agent health measured (dashboard).
- [ ] Prevention policy + anti-tampering enabled.
- [ ] Exclusions tracked, approved, time-boxed.
- [ ] Response SLAs defined + evidence (tickets).
- [ ] Logs centralized with retention.

## 6. Expected evidence
- Coverage dashboard + non-compliant endpoints list.
- Exported EDR policy + anti-tampering proof.
- Exclusion history with approvals.
- Sample alerts with handling timelines.

---
*Template standard: adapt to your EDR tooling and SOC organization.*

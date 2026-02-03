# EDR / Antivirus Standard (D05)

**Organization:** ACME  
**Version:** 0.1 (draft)  
**Date:** 2026-02-03

## 1. Purpose
Define minimum requirements for endpoint protection (EDR/AV): deployment, configuration, alerting and response.

## 2. Baseline requirements
### 2.1 Deployment & coverage
- EDR/AV agent deployed on **100%** of in-scope endpoints.
- Real-time protection enabled; automated signature/agent updates.

### 2.2 Configuration
- Standard policy: prevention, risky behavior blocking, script controls (tool-dependent).
- Exclusions must be limited, justified and periodically reviewed.

### 2.3 Alerting & handling
- Critical alerts handled within defined SLAs.
- Procedures for quarantine/host isolation.

### 2.4 Logging
- Centralize EDR logs; appropriate retention.

## 3. Enhanced requirements (regulated sectors)
- SIEM integration + SOAR playbooks (when available).
- Extended telemetry + increased retention.
- Proactive threat hunting on critical scope.
- Regular detection/response testing (simulations).

## 4. Expected evidence
- EDR coverage dashboard.
- EDR policy (settings) + exceptions.
- Examples of alerts and handling.

---
*Template standard: adapt to your EDR tooling and SOC organization.*

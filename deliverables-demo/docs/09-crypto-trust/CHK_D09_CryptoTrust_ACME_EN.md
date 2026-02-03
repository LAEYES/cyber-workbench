# CHK — D09 — Crypto / Trust Checklist

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

- [ ] TLS 1.2+ everywhere (TLS 1.3 recommended).
- [ ] Cert/key inventory with owners and expirations.
- [ ] Automated cert renewal + D-30 alerting.
- [ ] Revocation operational (CRL/OCSP) and tested.
- [ ] Rotate critical keys ≤ 12 months.
- [ ] Centralized KMS/PKI logs; retention ≥ 180d for critical scope.

## Enhanced (regulated)
- [ ] HSM for critical non-exportable keys.
- [ ] Two-person rule for sensitive operations.
- [ ] PQC hybrid TLS on supported critical flows.
- [ ] Immutable logs (WORM).

---
*Checklist: complete with evidence (exports, scans, logs).*

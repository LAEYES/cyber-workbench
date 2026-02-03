# STD — D09 — PKI Standard (Certificates, mTLS)

**Organization:** ACME  
**Version:** 0.2 (hardened)  
**Date:** 2026-02-03

## 1. Baseline requirements
- Certificate inventory: CN/SAN, usage, owner, CA, expiry.
- Automated renewal recommended; alert at D-30.
- Revocation operational (CRL/OCSP) and tested.
- mTLS recommended for critical service-to-service flows.

## 2. Enhanced (regulated)
- Protected CA (HSM where feasible) + separation of duties.
- Short-lived certs (e.g., ≤ 90 days) for critical scope.
- Issue/revoke logging; retention ≥ 180d.

## 3. Evidence
- Cert inventory export, renewal/revocation reports, OCSP/CRL config.

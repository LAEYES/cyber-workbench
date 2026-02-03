# CHK — D09 — Checklist Crypto / Trust

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

- [ ] TLS 1.2+ partout (TLS 1.3 recommandé).
- [ ] Inventaire certs/keys avec owners et expirations.
- [ ] Renouvellement certs automatisé + alerte J-30.
- [ ] Révocation opérationnelle (CRL/OCSP) testée.
- [ ] Rotation clés critiques ≤ 12 mois.
- [ ] Logs KMS/PKI centralisés ; rétention ≥ 180j (critique).

## Renforcé (régulé)
- [ ] HSM pour clés critiques (non exportables).
- [ ] Two-person rule sur opérations sensibles.
- [ ] Hybrid TLS PQC sur flux critiques supportés.
- [ ] Logs immuables (WORM).

---
*Checklist : compléter avec preuves (exports, scans, logs).* 

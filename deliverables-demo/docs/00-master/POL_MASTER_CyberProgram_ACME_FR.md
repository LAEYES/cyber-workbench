# POL — MASTER — Programme Cyber (Cyber Nervous System)

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Objet
Définir le cadre directeur du programme cyber (D01→D18) : architecture en couches, gouvernance, exigences « en dur » (SLA/Seuils), et preuves attendues pour l’audit.

## 2. Architecture cible (couches)
- **Gouvernance & GRC** : D01 (Gouvernance), D15 (Risk Engine)
- **Identité & Accès / ZT** : D02 (IAM/PAM), D11 (Zero Trust), D17 (Workload Identity)
- **Réseau & Plateforme** : D03 (Réseau), D04 (Cloud/DevSecOps), D14 (Interface SOC)
- **Endpoints & Apps** : D05 (Endpoints), D06 (AppSec)
- **Données & Crypto** : D07 (Data), D09 (Crypto/Trust)
- **Détection & Réponse** : D10 (SOC), D13 (Orchestration/SOAR), D18 (Deception)
- **Conformité & Preuves** : D08 (Legal/Compliance), D13 (audit trails)
- **Résilience** : D12 (BCP/DR/Backups)
- **Supply chain** : D16 (SBOM/Provenance/Signing)

## 3. Principes non négociables (baseline)
- **Mesurable** : exigences sous forme de seuils/SLA et critères pass/fail.
- **Traçable** : chaque décision/exception/incident laisse une trace (D08/D13).
- **Moindre privilège** : humain et machine (D02/D11/D17).
- **Secure-by-default** : durcissement (D05), SDLC (D06), cloud (D04).
- **Chaîne de confiance** : crypto/PKI (D09), supply chain (D16).

## 4. Exigences « régulé »
- Rétentions renforcées (≥ 180j à ≥ 3 ans selon artefact).
- Double validation (two-person rule) pour actions/decisions critiques.
- Preuves immuables (WORM) pour incidents/décisions critiques.

## 5. Gestion des exceptions
- Toute exception est **time-boxed** (par défaut ≤ 30 jours) + approuvée + justifiée + plan de remédiation.

## 6. Preuves attendues (exemples)
- Policies/standards/checklists signés, rapports de conformité, exports SIEM/SOAR, tickets, SBOM/attestations, preuves de rotation clés, journaux d’accès.

---
*Référentiels : alignement ISO/NIST/CIS via métadonnées et mappings license-safe (pas de reproduction de textes sous licence).* 

# RUNBOOK — Rotation des clés de signature (FR)

## Objectif
Assurer la rotation des clés de signature (manifests / EvidencePackages) selon la politique (baseline ≥ annuel, régulé ≤ 6 mois) et permettre la révocation en cas d’incident.

## Pré-requis
- Accès KMS/HSM (Admin + Approver / two-person en régulé).
- Inventaire des `keyId` actifs et des manifests signés.

## Procédure (checklist)
1) Créer une nouvelle clé dans KMS/HSM (nouveau `keyId`).
2) Mettre le nouveau `keyId` en **active**.
3) Basculer la signature des nouveaux manifests sur `keyId` actif.
4) Mettre l’ancienne clé en **retired** (mais conservée pour vérification).
5) Vérifier : export EvidencePackage + signature OK.
6) Documenter : AuditEvent + preuve de rotation.

## Incident (compromission)
- Mettre la clé en **revoked**.
- Générer nouvelle clé.
- Conserver trace (AuditEvent) et analyser impact.

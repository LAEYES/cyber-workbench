# RUNBOOK — Legal hold & purge (FR)

## Objectif
Appliquer un **legal hold** (gel) et réaliser une **purge contrôlée** conformément à ADR-0011 et ADR-0008.

## 1) Legal hold (gel)
### Quand
- Demande légale, audit, litige, incident majeur.

### Procédure (checklist)
1) Identifier le scope : `evidenceId` ou `caseId` ou `riskId`.
2) Créer le hold (API à définir) : `LegalHold.status=active` + `reason`.
3) Vérifier qu’aucune purge n’est possible sur ce scope.
4) Générer un AuditEvent + ChainOfCustodyEvent(action=legalHold).

## 2) Purge (baseline)
### Pré-requis
- Rôle Approver.
- Aucun legal hold actif.

### Procédure
1) Vérifier la policy de rétention (`retentionClass`).
2) Déclencher purge contrôlée.
3) Vérifier AuditEvent + ChainOfCustodyEvent(action=purge).

## 3) Purge (régulé)
- Requiert **two-person** + contraintes WORM.
- Aucune suppression physique de preuve WORM : purge = révocation accès + suppression pointeurs + event.

## Sorties attendues
- Trace complète (audit + chain-of-custody) + statut final explicite (retained/purged/legal-hold).

# Checklist IAM / PAM

**Organisation :** ACME  
**Date :** 2026-02-03

> Utilisation : auto‑évaluation, préparation audit, suivi de remédiation.

## 1. IAM (baseline)
| Contrôle | Attendu | Preuves (exemples) | Statut |
|---|---|---|---|
| JML en place | Processus Joiner/Mover/Leaver | Procédure, tickets, workflow | ☐ OK ☐ KO ☐ N/A |
| Désactivation sortie < 24h | Comptes fermés à la sortie | Export RH/IT, logs IdP | ☐ OK ☐ KO ☐ N/A |
| Comptes nominaux | Pas de comptes partagés | Inventaire, exceptions | ☐ OK ☐ KO ☐ N/A |
| MFA accès distants | VPN/VDI/portails | Config IdP, politiques | ☐ OK ☐ KO ☐ N/A |
| Revue d’habilitations | Périodique (>= trimestriel) | PV, exports groupes | ☐ OK ☐ KO ☐ N/A |
| Logs IAM | Auth, échecs, changements | SIEM, journaux IdP | ☐ OK ☐ KO ☐ N/A |

## 2. PAM (baseline)
| Contrôle | Attendu | Preuves (exemples) | Statut |
|---|---|---|---|
| Comptes admin dédiés | Séparation admin / user | AD/AAD, groupes | ☐ OK ☐ KO ☐ N/A |
| MFA admin | MFA pour accès à privilèges | Politiques IdP | ☐ OK ☐ KO ☐ N/A |
| Coffre de secrets | Secrets centralisés quand possible | Vault, procédures | ☐ OK ☐ KO ☐ N/A |
| Rotation secrets | Périodique + après incident | Rapports rotation | ☐ OK ☐ KO ☐ N/A |
| Break‑glass | Contrôlé, rare, tracé | Procédure, logs | ☐ OK ☐ KO ☐ N/A |
| Logs admin | Actions sensibles tracées | SIEM, journaux systèmes | ☐ OK ☐ KO ☐ N/A |

## 3. Exigences renforcées (secteurs régulés)
| Contrôle | Attendu | Preuves (exemples) | Statut |
|---|---|---|---|
| MFA phishing‑resistant | FIDO2/WebAuthn (admins/critique) | Config IdP, inventaire facteurs | ☐ OK ☐ KO ☐ N/A |
| JIT / approbation | Élévation temporaire approuvée | PAM/JIT logs | ☐ OK ☐ KO ☐ N/A |
| Enregistrement session | Session recording critique | Outil PAM, replays | ☐ OK ☐ KO ☐ N/A |
| PAW/SAW | Poste d’admin dédié | Inventaire, politiques poste | ☐ OK ☐ KO ☐ N/A |
| Intégrité des logs | Rétention + protection altération | SIEM/WORM, contrôle accès | ☐ OK ☐ KO ☐ N/A |

## 4. Plan d’actions (optionnel)
| Action | Priorité | Responsable | Échéance |
|---|---|---|---|
|  |  |  |  |

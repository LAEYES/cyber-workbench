# Standard EDR / Antivirus (D05)

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Objet
Définir des exigences **mesurables** pour la protection endpoint (EDR/AV) : déploiement, configuration, alerting, réponse, preuves.

## 2. Exigences minimales (baseline)
### 2.1 Couverture & santé agent (obligatoire)
- Couverture EDR/AV : **≥ 98%** des endpoints en scope.
- Endpoints sans agent ou agent inactif > **24h** : remédiation (réinstall) ou **mise en quarantaine** réseau.
- Mise à jour agent/definitions : automatique ; endpoints en retard > **7 jours** identifiés.

### 2.2 Politique de prévention (minimum)
- Protection temps réel activée.
- Détection PUA/PUP activée.
- Blocage exécution malware connu + comportements à risque (selon capacité outil).
- Anti-tampering / protection contre désactivation activée.

### 2.3 Exclusions (strict)
- Exclusions **interdites par défaut**.
- Toute exclusion est :
  - justifiée (impact),
  - limitée (chemin/hash/process),
  - time-boxed (max **30 jours**),
  - approuvée Security,
  - revue mensuellement.

### 2.4 Alerting & réponse (SLA)
- **Critique (sévérité haute / ransomware / C2 / credential theft)** : prise en charge **≤ 1h**.
- **Élevé** : **≤ 4h**.
- **Moyen** : **≤ 24h**.
- Capacité d’**isolation réseau** d’un endpoint activée et testée.

### 2.5 Journalisation
- Télémetrie/alertes EDR centralisées (SIEM ou stockage central).
- Rétention : **≥ 90 jours** (baseline).

## 3. Exigences renforcées (secteurs régulés)
- Couverture : **≥ 99.5%** sur périmètre critique.
- Rétention EDR/SIEM : **≥ 180 jours** (ou selon obligations), intégrité des logs.
- Playbooks SOAR (si dispo) : isolement, kill process, blocage IOC.
- Threat hunting : au moins mensuel sur périmètre critique.
- Tests réguliers : simulations (Atomic Red Team / tests internes) **trimestriels**.

## 4. Paramètres recommandés (exemples)
- Politique « high/strict » sur postes admin et serveurs bureautiques.
- Blocage scripts à risque (PowerShell non signé, macros) si possible.

## 5. Critères d’audit (pass/fail)
- [ ] Couverture et santé agent mesurées (dashboard).
- [ ] Politique prévention + anti-tampering en place.
- [ ] Exclusions tracées, approuvées, time-boxed.
- [ ] SLA de traitement défini + preuves (tickets).
- [ ] Logs centralisés avec rétention.

## 6. Preuves attendues
- Dashboard couverture + liste endpoints non conformes.
- Export policy EDR + preuve anti-tampering.
- Historique exclusions (avec approvals).
- Exemples d’alertes traitées + délais.

---
*Standard modèle : à adapter à l’outil EDR et à l’organisation SOC.*

# POL — D03 — Politique de sécurité réseau & infrastructure

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Objet
Définir des exigences **opérationnelles et auditées** pour la conception et l’exploitation des réseaux (LAN/WAN/Wi‑Fi, DC, cloud, interconnexions) : segmentation, filtrage, accès distant, durcissement, supervision.

## 2. Périmètre
- Réseaux on‑prem et cloud, DMZ, accès partenaires.
- Équipements/services : routeurs, firewalls, switches, Wi‑Fi, VPN/accès distant, DNS/DHCP/IPAM, proxies.

## 3. Exigences minimales (baseline)
### 3.1 Inventaire & MCO (obligatoire)
- Inventaire à jour (owner, version, fin de support).
- Équipements EOL/EOS : **interdits** sur périmètre critique.
- Sauvegarde configs : **quotidienne** (critique) / **hebdo** (autre) + test restauration **trimestriel**.

### 3.2 Segmentation (minimum)
- Segments minimum : USER / SRV / ADMIN / DMZ (si exposé) / GUEST-IOT / BACKUP / DATA.
- Matrice de flux inter‑zones maintenue et revue :
  - critique : **trimestriel**
  - autre : **semestriel**

### 3.3 Filtrage
- Inter‑zones : **deny-by-default**.
- Any/any interdit sauf exception approuvée (durée max **30j**).
- Administration jamais exposée Internet (SSH/RDP/WinRM) hors solution contrôlée.

### 3.4 Accès distant (VPN/ZTNA)
- MFA obligatoire.
- Séparation user/admin/tiers.
- Posture minimale (appareil géré, EDR actif, OS supporté) pour accès sensible.

### 3.5 Logs & supervision
- Centralisation logs (firewall, VPN, DNS, équipements clés) avec rétention **≥ 90 jours**.
- Alertes minimum : changements règles, nouveaux objets, pics de denies, connexions anormales.

## 4. Exigences renforcées (régulé)
- Revue d’architecture sécurité avant mise en prod (flux, données, chiffrement, logs).
- Micro-segmentation workloads critiques.
- Administration via bastion + session recording (périmètre critique).
- Rétention logs **≥ 180 jours** + intégrité.
- Double validation (réseau + sécurité) pour changements périmètre critique.

## 5. Critères d’audit (pass/fail)
- [ ] Inventaire et EOL gérés.
- [ ] Segmentation minimale + matrice flux revue.
- [ ] Deny-by-default et règles justifiées/expirées.
- [ ] Accès distant MFA + séparation.
- [ ] Logs centralisés + rétention.

---
*Politique modèle : à décliner en standards segmentation/firewall/VPN et procédures de change.*

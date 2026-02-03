# Standard MFA (Multi‑Factor Authentication)

**Organisation :** ACME  
**Version :** 0.1 (draft)  
**Date :** 2026-02-03

## 1. Objet
Définir le standard MFA de ACME : où, quand et comment appliquer l’authentification multi‑facteurs.

## 2. Définitions
- **MFA** : au moins 2 facteurs parmi *connaissance* (mot de passe), *possession* (token), *inhérence* (biométrie).
- **Phishing‑resistant** : facteurs basés sur clé (FIDO2/WebAuthn), résistants au proxy/phishing.

## 3. Exigences (baseline)
### 3.1 Cas d’usage MFA obligatoire
- Accès distants (VPN, accès web externe, VDI).
- Accès aux environnements d’administration (cloud console, hyperviseurs, annuaires).
- Accès aux applications manipulant des données sensibles.

### 3.2 Facteurs autorisés
- Recommandé : application d’authentification (TOTP) ou push avec code.
- Accepté si maîtrisé : SMS uniquement en **dernier recours** (risque SIM‑swap).
- Biometrie : possible si couplée à un facteur de possession (ex. passkey sur appareil géré).

### 3.3 Enrôlement & récupération
- Enrôlement initial contrôlé (validation identité, mail/phone pro, appareil géré si possible).
- Procédure de récupération documentée ; limitation des réinitialisations.
- Codes de secours : stockés dans un coffre (password manager) et renouvelés.

### 3.4 Exceptions et comptes d’urgence
- Comptes « break‑glass » : nombre limité, accès restreint, usage journalisé, secrets rotés.
- Toute exception MFA : approuvée, justifiée, compensée et temporaire.

### 3.5 Journalisation
- Journaliser : enrôlements, suppressions de facteur, bypass, échecs MFA.
- Alertes sur : tentatives répétées, bypass, changements de facteurs.

## 4. Exigences renforcées (secteurs régulés)
- MFA **phishing‑resistant** obligatoire pour comptes à privilèges et environnements critiques.
- Step‑up MFA (ré-auth) pour actions sensibles (élévation, changements IAM, export de données).
- Interdiction des protocoles d’authentification hérités (IMAP/POP/SMTP basic auth, etc.).
- Contrôles de posture poste (device compliance) pour accès critique.

## 5. Vérifications (exemples)
- % comptes couverts MFA (global / admins / tiers).
- Délai de suppression MFA à la sortie.

---
*Document modèle : compléter selon l’IdP (Entra ID/Okta/etc.) et les contraintes métiers.*

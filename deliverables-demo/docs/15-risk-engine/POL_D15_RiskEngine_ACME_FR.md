# POL — D15 — Risk Engine (GRC / Scoring / IA assistée)

**Organisation :** ACME  
**Version :** 0.2 (durci)  
**Date :** 2026-02-03

## 1. Mission
Industrialiser la gestion du risque cyber : inventaire des risques, scoring, décisions (traiter/éviter/transférer/accepter), liens vers contrôles et preuves, et boucle d’amélioration continue.

## 2. Exigences minimales (baseline)
- Modèle de scoring défini (V×I) + seuils.
- Chaque risque a owner, échéance, statut, preuves.
- Acceptation de risque time-boxed (max **90 jours**) avec revalidation.
- Lien obligatoire : risque ↔ contrôles ↔ preuves ↔ incidents.

## 3. IA assistée (guardrails)
- L’IA **ne décide pas** : elle propose, l’humain approuve.
- Traçabilité : prompt/inputs/outputs conservés (si autorisé) + justification.
- Protection données : pas de données sensibles dans prompts non maîtrisés.

## 4. Renforcé (régulé)
- Revue risques critiques : mensuelle.
- Acceptation max **60 jours**.
- Exports immuables des décisions critiques.

## 5. Critères d’audit (pass/fail)
- [ ] Scoring et seuils définis.
- [ ] Risks owners + échéances.
- [ ] Risk acceptances time-boxed et revues.
- [ ] Evidence linkage complet.
- [ ] Guardrails IA appliqués.

## 6. Preuves
- Registre risques, décisions, liens preuves, exports.

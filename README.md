# cyber-workbench

Boîte à outils (docs + code) pour structurer un programme cybersécurité (ETI/PME/secteurs régulés), bilingue **FR/EN**.

## Conventions
- Les livrables sont **générés** (non versionnés) dans `./deliverables/` (recommandé).
- Conventions de nommage : voir [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md).

## Pré-requis
- Node.js 18+ (idéalement 20+)

## Installation
```bash
npm install
npm run build
```

## Utilisation (CLI)
### 1) Initialiser un workspace de livrables
```bash
npx tsx src/cli.ts init --org "ACME" --lang both --out ./deliverables
```

### 2) Générer des documents
```bash
# D01 - Gouvernance
npx tsx src/cli.ts gen pssi --out ./deliverables
npx tsx src/cli.ts gen risk-register --out ./deliverables

# D02 - IAM / PAM
npx tsx src/cli.ts gen iam-policy --out ./deliverables
npx tsx src/cli.ts gen mfa-standard --out ./deliverables
npx tsx src/cli.ts gen pam-standard --out ./deliverables
npx tsx src/cli.ts gen iam-pam-checklist --out ./deliverables

# Alias acceptés (conventions de nommage)
npx tsx src/cli.ts gen POL_D02_IAM --out ./deliverables
```

## Roadmap (MVP)
- Domaine 1 Gouvernance : PSSI, ISMS pack, registre des risques (ISO 27005 + EBIOS light), plan d'audit, cartographie des actifs.
- Domaine 2 IAM/PAM : politique IAM, standard MFA, standard PAM, checklist IAM/PAM.
- Catalogue : ISO + NIST + CIS (données structurées + mappings).

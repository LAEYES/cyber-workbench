# cyber-workbench — Setup & Launch (Windows)

This repo contains:
- **cyberwb CLI** (Node/TypeScript)
- **NATO Trinity specs/architecture** (Markdown/OpenAPI/JSON schemas)
- **WinForms NATO Trinity MVP UI** (`ui/winforms/NatoTrinityMvp`)

## Prerequisites
- Node.js (recommended: 20+)
- .NET SDK (9.x works)
- Git

## One-time setup

### Option A — PowerShell
From repo root:

```powershell
# installs node deps + restores/builds winforms
./setup.ps1
```

### Option B — CMD
From repo root:

```bat
setup.cmd
```

## Launch

### WinForms UI
PowerShell:
```powershell
./run-winforms.ps1
```

CMD:
```bat
run-winforms.cmd
```

### cyberwb CLI (dev)
```powershell
npm run dev -- --help
```

### Build CLI
```powershell
npm run build
```

## Happy path — Evidence Engine (CLI)

Assumption: you use `./deliverables` as working directory for store + bundles.

1) Create a Risk + Case
```powershell
node dist/cli.js nato:mvp-risk-create --out ./deliverables --org ORG --actor user --risk-id R-001 --title "Test" --owner alice --likelihood 3 --impact 3 --due 2099-01-01
node dist/cli.js nato:mvp-case-create --out ./deliverables --org ORG --actor user --case-id C-001 --severity medium --owner soclead
node dist/cli.js nato:mvp-case-link-risk --out ./deliverables --org ORG --actor user --case-id C-001 --risk-id R-001
```

2) Ingest evidence into the store
```powershell
node dist/cli.js nato:mvp-evidence-ingest --out ./deliverables --org ORG --actor user --in ./some-proof.txt --evidence-id EV-001 --evidence-type report --source mvp-local --classification internal --retention short
```

3) Link evidence to the Risk and/or Case
```powershell
node dist/cli.js nato:mvp-risk-link-evidence --out ./deliverables --org ORG --actor user --risk-id R-001 --evidence-id EV-001
node dist/cli.js nato:mvp-case-link-evidence --out ./deliverables --org ORG --actor user --case-id C-001 --evidence-id EV-001
```

4) Verify chain-of-custody integrity
```powershell
node dist/cli.js nato:mvp-chain-verify --out ./deliverables --org ORG --evidence-id EV-001
```

5) Export from store (risk or case scope)
```powershell
node dist/cli.js nato:mvp-export-from-store --store ./deliverables --out ./deliverables --org ORG --actor user --scope risk:R-001
node dist/cli.js nato:mvp-export-from-store --store ./deliverables --out ./deliverables --org ORG --actor user --scope case:C-001
```

6) Verify exported bundle
```powershell
# use the printed bundle path, or point to the folder under ./deliverables/nato-mvp/
node dist/cli.js nato:mvp-verify-bundle --manifest <bundleDir>\manifest.json
node dist/cli.js nato:mvp-verify-manifest --bundle <bundleDir>
```

## Happy path — Evidence Engine (WinForms)

In the WinForms UI (Store tab):
- Create Risk / Create Case
- Link Risk (Case)
- Evidence (store): Browse → Ingest → Link to Risk/Case → Verify chain → Export from store

## Validations
- NATO Trinity validation (OpenAPI + schemas + alignment lints):
```powershell
npm run nato:validate
```

## Troubleshooting
- If WinForms fails with a SplitContainer/SplitterDistance error: pull latest and re-run `run-winforms.*`.
- If npm install fails: delete `node_modules/` and re-run setup.

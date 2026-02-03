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

## Validations
- NATO Trinity validation (OpenAPI + schemas + alignment lints):
```powershell
npm run nato:validate
```

## Troubleshooting
- If WinForms fails with a SplitContainer/SplitterDistance error: pull latest and re-run `run-winforms.*`.
- If npm install fails: delete `node_modules/` and re-run setup.

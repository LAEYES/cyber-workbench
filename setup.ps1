$ErrorActionPreference = 'Stop'

Write-Host "[setup] cyber-workbench" -ForegroundColor Cyan

function Assert-Command($name) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    throw "Missing required command: $name"
  }
}

Assert-Command node
Assert-Command npm
Assert-Command dotnet

Write-Host "[setup] node $(node --version)" -ForegroundColor DarkGray
Write-Host "[setup] npm  $(npm --version)" -ForegroundColor DarkGray
Write-Host "[setup] dotnet $(dotnet --version)" -ForegroundColor DarkGray

Write-Host "[setup] npm ci" -ForegroundColor Cyan
npm ci

Write-Host "[setup] build cyberwb" -ForegroundColor Cyan
npm run build

$proj = Join-Path $PSScriptRoot 'ui\winforms\NatoTrinityMvp\NatoTrinityMvp.csproj'
Write-Host "[setup] dotnet restore winforms" -ForegroundColor Cyan
& dotnet restore $proj

Write-Host "[setup] dotnet build winforms (Release)" -ForegroundColor Cyan
& dotnet build $proj -c Release

Write-Host "[setup] done" -ForegroundColor Green

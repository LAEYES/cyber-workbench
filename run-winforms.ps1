$ErrorActionPreference = 'Stop'

$proj = Join-Path $PSScriptRoot 'ui\winforms\NatoTrinityMvp\NatoTrinityMvp.csproj'

Write-Host "[run] WinForms NATO Trinity MVP" -ForegroundColor Cyan
& dotnet run --project $proj

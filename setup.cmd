@echo off
setlocal enabledelayedexpansion

echo [setup] cyber-workbench

where node >nul 2>nul || (echo Missing node & exit /b 1)
where npm >nul 2>nul || (echo Missing npm & exit /b 1)
where dotnet >nul 2>nul || (echo Missing dotnet & exit /b 1)

echo [setup] npm ci
call npm ci || exit /b 1

echo [setup] npm run build
call npm run build || exit /b 1

echo [setup] dotnet restore winforms
call dotnet restore ui\winforms\NatoTrinityMvp\NatoTrinityMvp.csproj || exit /b 1

echo [setup] dotnet build winforms (Release)
call dotnet build ui\winforms\NatoTrinityMvp\NatoTrinityMvp.csproj -c Release || exit /b 1

echo [setup] done
endlocal

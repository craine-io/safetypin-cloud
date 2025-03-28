@echo off
echo SafetyPin Release Creation Utility
echo ================================

if "%1"=="" (
  echo Error: Version number is required.
  echo Usage: create-release.bat ^<version^>
  echo Example: create-release.bat 0.1.0-alpha.1
  exit /b 1
)

node scripts/create-release.js %1

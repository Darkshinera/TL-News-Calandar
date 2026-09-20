@echo off
set "msg=%~1"
if "%msg%"=="" set "msg=feat: icones des boss en local assets/ et mise a jour Discord"

git add .
git commit -m "%msg%"

echo.
echo [*] Synchronisation avec GitHub (recuperation des nouveautes distantes)...
git pull --rebase origin main

echo.
echo [*] Envoi des modifications vers GitHub...
git push origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo =======================================================
    echo   [ERREUR] Le push vers GitHub a echoue.
    echo =======================================================
) else (
    echo.
    echo =======================================================
    echo   Mise a jour GitHub terminee avec succes !
    echo =======================================================
)
pause


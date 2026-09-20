@echo off
set "msg=%~1"
if "%msg%"=="" set "msg=feat: icones des boss en local assets/ et mise a jour Discord"

git add .
git commit -m "%msg%"
git push origin main
echo.
echo =======================================================
echo   Mise a jour GitHub terminee avec succes !
echo =======================================================
pause

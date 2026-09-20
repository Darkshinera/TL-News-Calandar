@echo off
set "msg=%~1"
if "%msg%"=="" set "msg=fix: publication planning 4 prochains jours Archboss depuis la date selectionnee"

git add .
git commit -m "%msg%"
git push origin main
echo Mise a jour GitHub terminee avec succes !

@echo off
setlocal enabledelayedexpansion
title Telechargement des icones Throne & Liberty en local

echo ==============================================================
echo    Recuperation de toutes les icones (PNG) en local
echo ==============================================================
echo.

where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [Node.js detecte] Lancement du script de telechargement...
    echo.
    node download_icons.js
) else (
    echo [Node.js non detecte] Utilisation de curl...
    echo.
    mkdir assets\icons\bosses 2>nul
    mkdir assets\icons\events 2>nul
    mkdir assets\ui 2>nul

    for %%F in (
        "assets/icons/bosses/adentus-asc.png"
        "assets/icons/bosses/ahzreil-asc.png"
        "assets/icons/bosses/aridus.png"
        "assets/icons/bosses/aridus-asc.png"
        "assets/icons/bosses/chernobog-asc.png"
        "assets/icons/bosses/cornelius-asc.png"
        "assets/icons/bosses/daigon-asc.png"
        "assets/icons/bosses/deluzhnoa-asc.png"
        "assets/icons/bosses/excavator9-asc.png"
        "assets/icons/bosses/grand-aelon-asc.png"
        "assets/icons/bosses/junobote-asc.png"
        "assets/icons/bosses/kowazan-asc.png"
        "assets/icons/bosses/leviathan-asc.png"
        "assets/icons/bosses/malakar-asc.png"
        "assets/icons/bosses/manticus-asc.png"
        "assets/icons/bosses/minezerok-asc.png"
        "assets/icons/bosses/morokai-asc.png"
        "assets/icons/bosses/nirma-asc.png"
        "assets/icons/bosses/pakilo-naru-asc.png"
        "assets/icons/bosses/porfos.png"
        "assets/icons/bosses/talus-asc.png"
        "assets/icons/bosses/thuban.png"
        "assets/icons/bosses/grimturg.png"
        "assets/icons/bosses/exodus.png"
        "assets/icons/bosses/giant-cordy-asc.png"
        "assets/icons/bosses/queen-bellandir-asc.png"
        "assets/icons/bosses/tevent-asc.png"
        "assets/icons/bosses/ramux.png"
        "assets/icons/events/gigantrite.png"
        "assets/icons/events/whale.png"
        "assets/icons/events/riftstone.png"
        "assets/icons/events/boonstone.png"
        "assets/icons/events/siege.png"
        "assets/icons/events/tax.png"
        "assets/icons/events/best-way-to-prevent-the-worst.png"
        "assets/icons/events/peipor-harvest-festival.png"
        "assets/icons/events/passage-ceremony-of-the-great-tree.png"
        "assets/icons/events/obsidian-acquisition-operation.png"
        "assets/icons/events/blizzard-seal.png"
        "assets/icons/events/festival-of-fire.svg"
        "assets/icons/events/blood-mushroom-gathering.svg"
        "assets/icons/events/inter-server-boonstone.png"
        "assets/icons/events/inter-server-riftstone.png"
        "assets/ui/favicon.png"
    ) do (
        echo Telechargement de %%~F...
        curl -s -f --create-dirs -o "%%~F" "https://thronewatch.app/%%~F"
    )
    echo.
    echo Telechargement termine via curl !
)

echo.
echo ==============================================================
echo  Toutes les icones sont maintenant stockees dans assets/
echo ==============================================================
echo.
pause

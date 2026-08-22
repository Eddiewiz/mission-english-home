@echo off
setlocal
set "APPDIR=%~dp0"
set "TARGET=%APPDIR%index.html"
set "ICON=%APPDIR%MissionEnglishHome.ico"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$desktop=[Environment]::GetFolderPath('Desktop');" ^
  "$old=Join-Path $desktop 'Mission English World.lnk'; if(Test-Path $old){Remove-Item $old -Force};" ^
  "$shell=New-Object -ComObject WScript.Shell;" ^
  "$shortcut=$shell.CreateShortcut((Join-Path $desktop 'Mission English Home.lnk'));" ^
  "$shortcut.TargetPath='%TARGET%';" ^
  "$shortcut.WorkingDirectory='%APPDIR%';" ^
  "$shortcut.IconLocation='%ICON%,0';" ^
  "$shortcut.Description='Mission English Home';" ^
  "$shortcut.Save()"

if errorlevel 1 (
  echo No se pudo crear el acceso directo.
  pause
  exit /b 1
)

echo.
echo Acceso directo Mission English Home creado correctamente en el escritorio.
echo Si existia el acceso directo anterior Mission English World, fue eliminado.
echo Ya puedes cerrar esta ventana.
pause

@echo off
REM Arranca MySQL (si no esta ya como servicio o proceso), el backend Node y
REM el frontend React, cada uno en su propia ventana.
REM Solo necesitas correr este archivo (doble clic o "start-all.bat" en terminal).

set MYSQLD="C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe"
set MYSQLADMIN="C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqladmin.exe"
set MYSQL_INI="C:\ProgramData\MySQL\MySQL Server 8.4\my.ini"

sc query MySQL84 | find "RUNNING" >nul
if %errorlevel%==0 (
    echo MySQL ya esta corriendo como servicio de Windows.
    goto backend
)

tasklist /fi "imagename eq mysqld.exe" | find /i "mysqld.exe" >nul
if %errorlevel%==0 (
    echo MySQL ya esta corriendo como proceso.
    goto backend
)

echo Iniciando MySQL...
start "MySQL - Finca La Primavera" cmd /k %MYSQLD% --defaults-file=%MYSQL_INI%

echo Esperando a que MySQL acepte conexiones...
:waitmysql
%MYSQLADMIN% ping -u root -pchangeme --silent >nul 2>&1
if errorlevel 1 (
    timeout /t 2 /nobreak >nul
    goto waitmysql
)
echo MySQL listo.

:backend
echo Iniciando backend Node...
start "Backend Node - Finca La Primavera" cmd /k "%~dp0backend-node\dev.bat"

echo Iniciando frontend React...
start "Frontend - Finca La Primavera" cmd /k "%~dp0frontend\dev.bat"

echo Listo. Se abrieron ventanas de Backend y Frontend (y MySQL si no estaba corriendo).

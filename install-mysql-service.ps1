# Correr UNA sola vez, desde PowerShell como Administrador.
# Instala MySQL como servicio de Windows para que arranque solo (con el sistema)
# y no dependa de que alguien lo inicie a mano.

$mysqld = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe"
$ini = "C:\ProgramData\MySQL\MySQL Server 8.4\my.ini"

# Si ya quedo un mysqld.exe suelto corriendo como proceso normal, lo cerramos
# para que no choque de puerto con el servicio.
Get-Process mysqld -ErrorAction SilentlyContinue | Stop-Process -Force

& $mysqld --install MySQL84 --defaults-file=$ini
Set-Service -Name MySQL84 -StartupType Automatic
Start-Service -Name MySQL84

Write-Host ""
Write-Host "Listo. Servicio MySQL84 instalado y arrancado." -ForegroundColor Green
Get-Service MySQL84

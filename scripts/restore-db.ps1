<#
.SYNOPSIS
    Restaura una copia de seguridad creada por backup-db.ps1.

.DESCRIPTION
    Verifica la huella SHA-256 (si existe el .sha256), descomprime el .zip y carga el .sql en MySQL.
    Reemplaza los datos actuales de la base destino, por eso pide confirmacion escribiendo su nombre
    (salvo que se use -Force). Para probar sin riesgo, restaure en otra base con -Database.

.EXAMPLE
    .\scripts\restore-db.ps1 -BackupFile .\backups\finca_finca_la_primavera_20261023_021500.zip
.EXAMPLE
    .\scripts\restore-db.ps1 -BackupFile .\backups\ultimo.zip -Database finca_prueba_restore
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$BackupFile,
    [string]$EnvFile,
    [string]$Database,
    [string]$MysqlBin,
    [switch]$Force
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot '_common.ps1')

if (-not $EnvFile) { $EnvFile = Join-Path $RepoRoot 'backend-node\.env' }
$cnf = $null
$tmpDir = $null

try {
    if (-not (Test-Path -LiteralPath $BackupFile)) { throw "No existe el archivo: $BackupFile" }
    $BackupFile = (Resolve-Path -LiteralPath $BackupFile).Path

    $cfg = Read-DotEnv -Path $EnvFile
    if (-not $Database) { $Database = $cfg['DB_NAME'] }
    if ($Database -notmatch '^[A-Za-z0-9_]+$') { throw 'Nombre de base invalido (solo letras, numeros y guion bajo).' }

    $hashFile = "$BackupFile.sha256"
    if (Test-Path -LiteralPath $hashFile) {
        $esperado = ((Get-Content -LiteralPath $hashFile -Raw).Trim() -split '\s+')[0]
        $real = (Get-FileHash -LiteralPath $BackupFile -Algorithm SHA256).Hash
        if ($esperado -ne $real) { throw 'La huella SHA-256 no coincide: el respaldo esta danado o fue modificado.' }
        Write-Host 'Integridad verificada (SHA-256 correcto).'
    } else {
        Write-Warning 'No hay archivo .sha256 junto al respaldo; no se pudo verificar la integridad.'
    }

    if (-not $Force) {
        Write-Host "ATENCION: se reemplazaran los datos de la base '$Database' con el contenido del respaldo." -ForegroundColor Yellow
        $resp = Read-Host "Escriba el nombre de la base ($Database) para continuar"
        if ($resp -ne $Database) { throw 'Confirmacion incorrecta. No se hizo ningun cambio.' }
    }

    $mysql = Find-MysqlTool -Name 'mysql' -MysqlBin $MysqlBin
    $cnf = New-MysqlDefaultsFile -Env $cfg

    $tmpDir = Join-Path ([System.IO.Path]::GetTempPath()) ('finca_restore_' + [guid]::NewGuid().ToString('N'))
    New-Item -ItemType Directory -Path $tmpDir | Out-Null
    Expand-Archive -LiteralPath $BackupFile -DestinationPath $tmpDir
    $sql = Get-ChildItem -LiteralPath $tmpDir -Filter '*.sql' | Select-Object -First 1
    if (-not $sql) { throw 'El .zip no contiene ningun archivo .sql.' }

    & $mysql "--defaults-extra-file=$cnf" --default-character-set=utf8mb4 -e "CREATE DATABASE IF NOT EXISTS ``$Database`` CHARACTER SET utf8mb4;"
    if ($LASTEXITCODE -ne 0) { throw "No se pudo crear/verificar la base (codigo $LASTEXITCODE)." }

    $errFile = Join-Path $tmpDir 'mysql.err'
    $p = Start-Process -FilePath $mysql -ArgumentList @("--defaults-extra-file=`"$cnf`"", '--default-character-set=utf8mb4', $Database) `
        -RedirectStandardInput $sql.FullName -RedirectStandardError $errFile -NoNewWindow -Wait -PassThru
    if ($p.ExitCode -ne 0) { throw "mysql fallo al restaurar: $((Get-Content -LiteralPath $errFile -Raw))" }

    Write-Host "Restauracion completada en la base '$Database'." -ForegroundColor Green
    exit 0
}
catch {
    Write-Host "FALLO la restauracion: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
finally {
    if ($cnf -and (Test-Path $cnf)) { Remove-Item -LiteralPath $cnf -Force }
    if ($tmpDir -and (Test-Path $tmpDir)) { Remove-Item -LiteralPath $tmpDir -Recurse -Force }
}

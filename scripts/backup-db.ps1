<#
.SYNOPSIS
    Copia de seguridad de la base de datos MySQL de Finca La Primavera.

.DESCRIPTION
    Genera un volcado con mysqldump (consistente, sin bloquear las tablas), lo comprime en .zip,
    guarda su huella SHA-256 para verificar integridad y elimina las copias mas viejas que
    -RetentionDays. Lee las credenciales de backend-node\.env, asi que no hay claves en el script.
    La clave se pasa a mysqldump por un archivo temporal protegido, nunca por la linea de comandos.

.PARAMETER OutputDir
    Carpeta destino. Por defecto: <proyecto>\backups  (excluida de git).
.PARAMETER RetentionDays
    Dias que se conservan las copias. Por defecto 14. Use 0 para no borrar nunca.
.PARAMETER Database
    Base a respaldar. Por defecto la de DB_NAME en .env.
.PARAMETER MysqlBin
    Carpeta de mysqldump.exe si no esta en el PATH ni en 'C:\Program Files\MySQL'.

.EXAMPLE
    .\scripts\backup-db.ps1
.EXAMPLE
    .\scripts\backup-db.ps1 -OutputDir D:\Respaldos -RetentionDays 30
#>
[CmdletBinding()]
param(
    [string]$OutputDir,
    [int]$RetentionDays = 14,
    [string]$EnvFile,
    [string]$Database,
    [string]$MysqlBin
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot '_common.ps1')

if (-not $EnvFile)   { $EnvFile = Join-Path $RepoRoot 'backend-node\.env' }
if (-not $OutputDir) { $OutputDir = Join-Path $RepoRoot 'backups' }

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
$logFile = Join-Path $OutputDir 'backup.log'
$cnf = $null
$sqlFile = $null

try {
    # Carpeta de respaldos: solo el usuario actual y los administradores (si el sistema lo permite).
    try { & icacls.exe $OutputDir /inheritance:r /grant:r "${env:USERNAME}:(OI)(CI)F" "*S-1-5-32-544:(OI)(CI)F" | Out-Null } catch { }

    $cfg = Read-DotEnv -Path $EnvFile
    if (-not $Database) { $Database = $cfg['DB_NAME'] }
    if (-not $Database) { throw 'No se pudo determinar el nombre de la base (DB_NAME).' }

    $mysqldump = Find-MysqlTool -Name 'mysqldump' -MysqlBin $MysqlBin
    $cnf = New-MysqlDefaultsFile -Env $cfg

    $stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
    $baseName = "finca_${Database}_$stamp"
    $sqlFile = Join-Path $OutputDir "$baseName.sql"
    $zipFile = Join-Path $OutputDir "$baseName.zip"

    Write-Log "Iniciando respaldo de '$Database'..." $logFile
    & $mysqldump "--defaults-extra-file=$cnf" --single-transaction --routines --triggers --events `
        --default-character-set=utf8mb4 --no-tablespaces "--result-file=$sqlFile" $Database
    if ($LASTEXITCODE -ne 0) { throw "mysqldump termino con codigo $LASTEXITCODE." }
    if (-not (Test-Path $sqlFile) -or (Get-Item $sqlFile).Length -eq 0) { throw 'El volcado quedo vacio.' }

    Compress-Archive -LiteralPath $sqlFile -DestinationPath $zipFile -CompressionLevel Optimal
    Remove-Item -LiteralPath $sqlFile -Force
    $sqlFile = $null

    $hash = (Get-FileHash -LiteralPath $zipFile -Algorithm SHA256).Hash
    Set-Content -LiteralPath "$zipFile.sha256" -Value "$hash  $(Split-Path $zipFile -Leaf)" -Encoding ASCII

    $kb = [math]::Round((Get-Item $zipFile).Length / 1KB, 1)
    Write-Log "Respaldo creado: $zipFile ($kb KB)" $logFile

    if ($RetentionDays -gt 0) {
        $limite = (Get-Date).AddDays(-$RetentionDays)
        $viejos = @(Get-ChildItem -LiteralPath $OutputDir -Filter 'finca_*.zip' | Where-Object { $_.LastWriteTime -lt $limite })
        foreach ($f in $viejos) {
            Remove-Item -LiteralPath $f.FullName -Force
            Remove-Item -LiteralPath "$($f.FullName).sha256" -Force -ErrorAction SilentlyContinue
            Write-Log "Eliminado respaldo antiguo: $($f.Name)" $logFile
        }
    }
    exit 0
}
catch {
    Write-Log "FALLO el respaldo: $($_.Exception.Message)" $logFile 'ERROR'
    exit 1
}
finally {
    if ($cnf -and (Test-Path $cnf)) { Remove-Item -LiteralPath $cnf -Force }
    if ($sqlFile -and (Test-Path $sqlFile)) { Remove-Item -LiteralPath $sqlFile -Force }
}

# Funciones compartidas por backup-db.ps1 y restore-db.ps1.
# No se ejecuta directamente. (Solo ASCII: PowerShell 5.1 lee mal los .ps1 con tildes sin BOM.)

$script:RepoRoot = Split-Path -Parent $PSScriptRoot

function Read-DotEnv {
    param([string]$Path)
    if (-not (Test-Path $Path)) { throw "No se encontro el archivo de entorno: $Path" }
    $vars = @{}
    foreach ($line in Get-Content -LiteralPath $Path) {
        $t = $line.Trim()
        if ($t -eq '' -or $t.StartsWith('#')) { continue }
        $i = $t.IndexOf('=')
        if ($i -lt 1) { continue }
        $key = $t.Substring(0, $i).Trim()
        $val = $t.Substring($i + 1).Trim()
        if ($val.Length -ge 2 -and (($val.StartsWith('"') -and $val.EndsWith('"')) -or ($val.StartsWith("'") -and $val.EndsWith("'")))) {
            $val = $val.Substring(1, $val.Length - 2)
        }
        $vars[$key] = $val
    }
    return $vars
}

function Find-MysqlTool {
    param([string]$Name, [string]$MysqlBin)
    if ($MysqlBin) {
        $p = Join-Path $MysqlBin "$Name.exe"
        if (Test-Path $p) { return $p }
        throw "No se encontro $Name.exe en $MysqlBin"
    }
    $cmd = Get-Command "$Name.exe" -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }
    $candidates = @(Get-ChildItem "C:\Program Files\MySQL\MySQL Server *\bin\$Name.exe" -ErrorAction SilentlyContinue | Sort-Object FullName -Descending)
    if ($candidates.Count -gt 0) { return $candidates[0].FullName }
    throw "No se encontro $Name.exe. Indique la carpeta con -MysqlBin (p. ej. 'C:\Program Files\MySQL\MySQL Server 8.4\bin')."
}

# Crea un archivo de opciones temporal para que la clave NO aparezca en la linea de comandos
# (cualquier usuario del equipo podria verla con el administrador de tareas). Solo el usuario actual lo lee.
function New-MysqlDefaultsFile {
    param([hashtable]$Env)
    $file = Join-Path ([System.IO.Path]::GetTempPath()) ("finca_my_" + [guid]::NewGuid().ToString('N') + '.cnf')
    $pass = ([string]$Env['DB_PASSWORD']).Replace('\', '\\').Replace('"', '\"')
    $port = if ($Env['DB_PORT']) { $Env['DB_PORT'] } else { '3306' }
    $lines = @('[client]', "user=$($Env['DB_USER'])", "password=`"$pass`"", "host=$($Env['DB_HOST'])", "port=$port")
    Set-Content -LiteralPath $file -Value $lines -Encoding ASCII
    & icacls.exe $file /inheritance:r /grant:r "${env:USERNAME}:(R,W,D)" | Out-Null
    return $file
}

function Write-Log {
    param([string]$Message, [string]$LogFile, [string]$Level = 'INFO')
    $line = "{0} [{1}] {2}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Level, $Message
    Write-Host $line
    if ($LogFile) { Add-Content -LiteralPath $LogFile -Value $line }
}

<#
.SYNOPSIS
    Programa el respaldo automatico diario en el Programador de tareas de Windows.

.DESCRIPTION
    Crea la tarea "FincaLaPrimavera-Backup" que ejecuta backup-db.ps1 todos los dias a la hora
    indicada con el usuario actual (no requiere ser administrador). Si el equipo estaba apagado
    a esa hora, la tarea se ejecuta en cuanto vuelva a encenderse (-StartWhenAvailable).

.EXAMPLE
    .\scripts\register-backup-task.ps1               # todos los dias a las 02:00
    .\scripts\register-backup-task.ps1 -Time 23:30
    .\scripts\register-backup-task.ps1 -Unregister   # quita la tarea
#>
[CmdletBinding()]
param(
    [string]$Time = '02:00',
    [int]$RetentionDays = 14,
    [switch]$Unregister
)

$ErrorActionPreference = 'Stop'
$taskName = 'FincaLaPrimavera-Backup'

if ($Unregister) {
    Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
    Write-Host "Tarea '$taskName' eliminada."
    exit 0
}

$script = Join-Path $PSScriptRoot 'backup-db.ps1'
$argumentos = "-NoProfile -ExecutionPolicy Bypass -File `"$script`" -RetentionDays $RetentionDays"
$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument $argumentos
$trigger = New-ScheduledTaskTrigger -Daily -At $Time
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Hours 1)

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings `
    -Description 'Respaldo diario de la base de datos de Finca La Primavera' -Force | Out-Null

Write-Host "Tarea '$taskName' creada: todos los dias a las $Time (se conservan $RetentionDays dias)." -ForegroundColor Green
Write-Host 'Para probarla ahora: Start-ScheduledTask -TaskName FincaLaPrimavera-Backup'

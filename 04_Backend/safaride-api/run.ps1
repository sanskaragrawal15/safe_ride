# SafeRide OS Backend launcher.
# Uses a working Node.js from AppData to bypass the permission-restricted
# node.exe / npm files that shadow PATH at E:\
$ErrorActionPreference = "Stop"

$nodeCandidates = @(
    "$env:LOCALAPPDATA\Programs\nodejs\node.exe",
    "C:\Program Files\nodejs\node.exe",
    "E:\node.exe"
)

$nodeExe = $null
foreach ($candidate in $nodeCandidates) {
    if (Test-Path $candidate) {
        & $candidate --version *> $null
        if ($LASTEXITCODE -eq 0) {
            $nodeExe = $candidate
            break
        }
    }
}

if (-not $nodeExe) {
    Write-Error "No runnable Node.js found. Install it from https://nodejs.org"
    exit 1
}

$mode = $args[0]
if (-not $mode) { $mode = "dev" }

$nodeDir = Split-Path $nodeExe
$env:PATH = "$nodeDir;" + $env:PATH
$nodeVersion = & $nodeExe --version
Write-Host "Using Node: $nodeExe ($nodeVersion)" -ForegroundColor Cyan

if ($mode -eq "start") {
    & $nodeExe server.js
} else {
    $nodemonJs = Join-Path $PSScriptRoot "node_modules\nodemon\bin\nodemon.js"
    if (Test-Path $nodemonJs) {
        & $nodeExe $nodemonJs server.js
    } else {
        Write-Host "nodemon not found, falling back to node server.js" -ForegroundColor Yellow
        & $nodeExe server.js
    }
}
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

$nodeVersion = & $nodeExe --version
Write-Host "Using Node: $nodeExe ($nodeVersion)" -ForegroundColor Cyan

if ($mode -eq "start") {
    & $nodeExe server.js
} else {
    $nodemon = Join-Path $PSScriptRoot "node_modules\.bin\nodemon.cmd"
    if (Test-Path $nodemon) {
        & $nodeExe $nodemon server.js
    } else {
        Write-Host "nodemon not installed, falling back to node server.js" -ForegroundColor Yellow
        & $nodeExe server.js
    }
}
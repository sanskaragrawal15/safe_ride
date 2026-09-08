# SafeRide OS Command Panel Launcher
$ErrorActionPreference = "Stop"

$nodeCandidates = @(
    "$env:LOCALAPPDATA\Programs\nodejs\node.exe",
    "C:\Program Files\nodejs\node.exe"
)

$nodeExe = $null
foreach ($candidate in $nodeCandidates) {
    if (Test-Path $candidate) {
        $nodeExe = $candidate
        break
    }
}

if (-not $nodeExe) {
    Write-Error "No working Node.js executable found."
    exit 1
}

$nodeDir = Split-Path $nodeExe
$env:PATH = "$nodeDir;" + $env:PATH
$npm = Join-Path $nodeDir "npm.cmd"
$vite = Join-Path $PSScriptRoot "node_modules\.bin\vite.cmd"

Write-Host "Starting SafeRide OS Command Panel on Vite..." -ForegroundColor Cyan

if (Test-Path $vite) {
    & $nodeExe $vite
} else {
    & $npm run dev
}

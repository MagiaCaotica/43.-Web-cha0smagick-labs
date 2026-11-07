# Sincroniza el puerto real del servidor MCP de BrowserOS neo con la config
# de OpenCode. El fallo intermitente venia de que la config apuntaba al 9010
# mientras el servidor escucha en el puerto que declara config.json (9200 hoy).
# Uso: powershell -File scripts/dev/sync-browseros-port.ps1

$ErrorActionPreference = 'Stop'

$browserosConfig = Join-Path $env:LOCALAPPDATA 'BrowserOS\User Data\.browseros\config.json'
$opencodeConfig  = Join-Path $env:USERPROFILE '.config\opencode\opencode.json'

if (-not (Test-Path $browserosConfig)) {
  Write-Output "BrowserOS no esta instalado o nunca se ha abierto: falta $browserosConfig"
  exit 1
}

$state = Get-Content $browserosConfig -Raw | ConvertFrom-Json
$port = $state.ports.server
if (-not $port) {
  Write-Output "config.json de BrowserOS no declara ports.server"
  exit 1
}

$url = "http://127.0.0.1:$port/mcp"
$alive = $false
try {
  $r = Invoke-WebRequest "http://127.0.0.1:$port/mcp" -Method Get -TimeoutSec 4 -UseBasicParsing
  $alive = $r.StatusCode -eq 200
} catch { $alive = $false }

$json = Get-Content $opencodeConfig -Raw
if ($json -match '"browseros-neo"\s*:\s*\{[^}]*\}') {
  $json = [regex]::Replace($json, '("browseros-neo"\s*:\s*\{[^}]*?"url"\s*:\s*")[^"]+(")', '${1}' + $url + '${2}')
} else {
  $json = [regex]::Replace($json, '"mcp"\s*:\s*\{\s*\}', '"mcp": { "browseros-neo": { "type": "remote", "url": "' + $url + '", "enabled": true } }')
}

Set-Content -Path $opencodeConfig -Value $json -Encoding UTF8
# PowerShell 5.1 no acepta utf8NoBOM en Set-Content: se reescribe sin BOM
# con .NET para no romper el parser de OpenCode.
[System.IO.File]::WriteAllText($opencodeConfig, $json, (New-Object System.Text.UTF8Encoding($false)))
Write-Output "puerto declarado por BrowserOS: $port"
Write-Output "url en opencode.json:          $url"
Write-Output "servidor respondiendo ahora:   $alive"
if (-not $alive) {
  Write-Output "Abre BrowserOS neo (la app). El servidor se levanta con ella."
  exit 2
}


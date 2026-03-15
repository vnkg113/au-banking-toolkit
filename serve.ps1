# AuPromptKit — Static File HTTP Server
# Usage: .\serve.ps1
# Opens the app at http://localhost:9090

$basePort = 9090
$maxPort = 9099
$root = $PSScriptRoot

$mime = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.woff2'= 'font/woff2'
    '.woff' = 'font/woff'
}

$port = $basePort
$started = $false

while (-not $started -and $port -le $maxPort) {
    $listener = New-Object System.Net.HttpListener
    try {
        $listener.Prefixes.Add("http://localhost:$port/")
        $listener.Start()
        $started = $true
    } catch {
        Write-Host "⚠️ Port $port failed or is in use: $($_.Exception.Message)" -ForegroundColor Yellow
        $listener.Close()
        $port++
    }
}

if (-not $started) {
    Write-Host "❌ Failed to start server. All ports from $basePort to $maxPort are in use or require Admin privileges." -ForegroundColor Red
    Write-Host "Try running PowerShell as Administrator if you see 'Access Denied'." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "  ✅ AuPromptKit server running!" -ForegroundColor Green
Write-Host "  🌐 Open: http://localhost:$port" -ForegroundColor Cyan
Write-Host "  ⏹  Press Ctrl+C to stop." -ForegroundColor Yellow
Write-Host ""

# Auto-open browser
Start-Process "http://localhost:$port"

try {
    while ($listener.IsListening) {
        $ctx  = $listener.GetContext()
        $req  = $ctx.Request
        $resp = $ctx.Response

        $urlPath = $req.Url.LocalPath
        if ($urlPath -eq '/') { $urlPath = '/index.html' }

        $filePath = Join-Path $root ($urlPath.TrimStart('/').Replace('/', '\'))

        if (Test-Path $filePath -PathType Leaf) {
            $ext         = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
            $bytes       = [System.IO.File]::ReadAllBytes($filePath)

            $resp.ContentType   = $contentType
            $resp.ContentLength64 = $bytes.Length
            
            # Anti-caching headers for development
            $resp.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
            $resp.Headers.Add("Pragma", "no-cache")
            $resp.Headers.Add("Expires", "0")
            
            $resp.StatusCode    = 200
            $resp.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $msg   = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $resp.StatusCode    = 404
            $resp.ContentType   = 'text/plain'
            $resp.ContentLength64 = $msg.Length
            $resp.OutputStream.Write($msg, 0, $msg.Length)
        }

        $resp.OutputStream.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "Server stopped." -ForegroundColor Red
}

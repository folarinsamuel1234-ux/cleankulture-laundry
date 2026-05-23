# CleanKulture Local Server - PowerShell HTTP Server using .NET HttpListener
$port = 8080
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$baseUrl = "http://localhost:$port/"

# MIME types
$mimeTypes = @{
    '.html' = 'text/html'
    '.css'  = 'text/css'
    '.js'   = 'application/javascript'
    '.json' = 'application/json'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.gif'  = 'image/gif'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.webp' = 'image/webp'
    '.woff' = 'font/woff'
    '.woff2'= 'font/woff2'
    '.ttf'  = 'font/ttf'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($baseUrl)
$listener.Start()

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  CleanKulture Laundry Services" -ForegroundColor Green
Write-Host "  Local Server Running" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  URL: $baseUrl" -ForegroundColor Yellow
Write-Host "  Root: $root" -ForegroundColor Gray
Write-Host ""
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

# Open browser
Start-Process $baseUrl

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath
        if ($localPath -eq '/') { $localPath = '/index.html' }

        $filePath = Join-Path $root $localPath.TrimStart('/')

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }

            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)

            $statusColor = "Green"
            Write-Host "  [$($response.StatusCode)] $localPath" -ForegroundColor $statusColor
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found: $localPath")
            $response.ContentType = 'text/plain'
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)

            Write-Host "  [404] $localPath" -ForegroundColor Red
        }

        $response.OutputStream.Close()
    }
}
finally {
    $listener.Stop()
    $listener.Close()
    Write-Host "`n  Server stopped." -ForegroundColor Yellow
}

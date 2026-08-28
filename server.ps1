# High-Reliability Native HTTP Server for PomoFocus
param(
    [int]$Port = 5173
)

$rootPath = (Resolve-Path $PSScriptRoot).Path

# Whitelist of allowed public static extensions
$allowedExtensions = @(".html", ".js", ".css", ".svg", ".json", ".ico", ".png", ".jpg", ".woff2")

# Blacklist of sensitive filenames
$blockedFiles = @(
    "server.ps1", "server_https.ps1", "generate_cert.ps1", "localhost.pfx", "test_https.ps1", "test_security.ps1",
    ".gitignore", "README.md", "devcon-jumpstart-build-brief.md",
    "package.json", "package-lock.json", ".env"
)

function Handle-HttpClientConnection {
    param([System.Net.Sockets.TcpClient]$client)
    
    $netStream = $null
    try {
        $client.ReceiveTimeout = 4000
        $client.SendTimeout = 4000
        $netStream = $client.GetStream()
        
        $buffer = New-Object byte[] 8192
        $bytesRead = $netStream.Read($buffer, 0, $buffer.Length)
        if ($bytesRead -le 0) { return }
        
        $reqStr = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $bytesRead)
        $lines = $reqStr -split "`r?`n"
        if ($lines.Length -eq 0) { return }
        
        $firstLine = $lines[0].Trim()
        $parts = $firstLine -split "\s+"
        if ($parts.Length -lt 2) { return }
        
        $method = $parts[0].ToUpperInvariant()
        $rawUrl = $parts[1]
        
        # Method Restriction
        if ($method -ne "GET" -and $method -ne "HEAD") {
            $respBody = "405 Method Not Allowed"
            $hdr = "HTTP/1.1 405 Method Not Allowed`r`nContent-Type: text/plain`r`nContent-Length: $($respBody.Length)`r`nConnection: close`r`n`r`n$respBody"
            $hdrBytes = [System.Text.Encoding]::ASCII.GetBytes($hdr)
            $netStream.Write($hdrBytes, 0, $hdrBytes.Length)
            $netStream.Flush()
            return
        }
        
        # Clean Path
        $cleanPath = $rawUrl.Split('?')[0].TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($cleanPath)) {
            $cleanPath = "index.html"
        }
        
        # Path Traversal Defense
        try {
            $resolvedPath = [System.IO.Path]::GetFullPath((Join-Path $rootPath $cleanPath))
        } catch {
            $respBody = "400 Bad Request"
            $hdr = "HTTP/1.1 400 Bad Request`r`nContent-Length: $($respBody.Length)`r`nConnection: close`r`n`r`n$respBody"
            $hdrBytes = [System.Text.Encoding]::ASCII.GetBytes($hdr)
            $netStream.Write($hdrBytes, 0, $hdrBytes.Length)
            $netStream.Flush()
            return
        }
        
        if (-not $resolvedPath.StartsWith($rootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
            $respBody = "403 Forbidden"
            $hdr = "HTTP/1.1 403 Forbidden`r`nContent-Length: $($respBody.Length)`r`nConnection: close`r`n`r`n$respBody"
            $hdrBytes = [System.Text.Encoding]::ASCII.GetBytes($hdr)
            $netStream.Write($hdrBytes, 0, $hdrBytes.Length)
            $netStream.Flush()
            return
        }
        
        $fileName = [System.IO.Path]::GetFileName($resolvedPath)
        $fileExt = [System.IO.Path]::GetExtension($resolvedPath).ToLowerInvariant()
        
        # Filter Blocked Files & Extensions
        if ($fileName.StartsWith(".") -or ($blockedFiles -contains $fileName) -or ($allowedExtensions -notcontains $fileExt) -or (-not (Test-Path $resolvedPath -PathType Leaf))) {
            $respBody = "404 Not Found"
            $hdr = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($respBody.Length)`r`nConnection: close`r`n`r`n$respBody"
            $hdrBytes = [System.Text.Encoding]::ASCII.GetBytes($hdr)
            $netStream.Write($hdrBytes, 0, $hdrBytes.Length)
            $netStream.Flush()
            return
        }
        
        # Read file bytes & MIME
        $fileBytes = [System.IO.File]::ReadAllBytes($resolvedPath)
        $contentType = switch ($fileExt) {
            ".html"  { "text/html; charset=utf-8" }
            ".js"    { "application/javascript; charset=utf-8" }
            ".css"   { "text/css; charset=utf-8" }
            ".svg"   { "image/svg+xml" }
            ".json"  { "application/json; charset=utf-8" }
            ".ico"   { "image/x-icon" }
            ".png"   { "image/png" }
            ".jpg"   { "image/jpeg" }
            ".woff2" { "font/woff2" }
            default  { "application/octet-stream" }
        }
        
        $responseHeaders = @(
            "HTTP/1.1 200 OK",
            "Content-Type: $contentType",
            "Content-Length: $($fileBytes.Length)",
            "Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://esm.sh; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://esm.sh; img-src 'self' data: https:; media-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';",
            "X-Content-Type-Options: nosniff",
            "X-Frame-Options: DENY",
            "X-XSS-Protection: 1; mode=block",
            "Referrer-Policy: strict-origin-when-cross-origin",
            "Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()",
            "Cross-Origin-Opener-Policy: same-origin",
            "Cross-Origin-Resource-Policy: same-origin",
            "Server: PomoFocus-Secure-HTTP/1.0",
            "Connection: close"
        ) -join "`r`n"
        
        $fullHeaderStr = "$responseHeaders`r`n`r`n"
        $hdrBytes = [System.Text.Encoding]::ASCII.GetBytes($fullHeaderStr)
        $netStream.Write($hdrBytes, 0, $hdrBytes.Length)
        
        if ($method -eq "GET") {
            $netStream.Write($fileBytes, 0, $fileBytes.Length)
        }
        
        $netStream.Flush()
    } catch {
        # Silent handle of network disconnects
    } finally {
        try { if ($netStream) { $netStream.Dispose() } } catch {}
        try { if ($client) { $client.Close() } } catch {}
    }
}

# Bind to IPAddress Loopback / Any
$tcpListener = $null
$actualPort = $Port
for ($i = 0; $i -lt 10; $i++) {
    try {
        $actualPort = $Port + $i
        $tcpListener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $actualPort)
        $tcpListener.Start()
        break
    } catch {
        $tcpListener = $null
    }
}

if ($null -eq $tcpListener) {
    Write-Error "Could not bind to any port from $Port to $($Port + 9)"
    exit 1
}

Write-Host "========================================================"
Write-Host "  PomoFocus HTTP SERVER ACTIVE"
Write-Host "  URL: http://localhost:$actualPort/"
Write-Host "========================================================"

try {
    while ($true) {
        $client = $tcpListener.AcceptTcpClient()
        Handle-HttpClientConnection -client $client
    }
} finally {
    if ($tcpListener) { $tcpListener.Stop() }
}

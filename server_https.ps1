# High-Security Native HTTPS Web Server for PomoFocus
param(
    [int]$HttpsPort = 8443
)

$rootPath = (Resolve-Path $PSScriptRoot).Path
$certPath = Join-Path $rootPath "localhost.pfx"
$pfxPassword = "PomoFocusSecure2026"

if (-not (Test-Path $certPath)) {
    Write-Host "Creating localhost TLS Certificate..."
    $secPass = ConvertTo-SecureString -String $pfxPassword -Force -AsPlainText
    $cert = New-SelfSignedCertificate -DnsName "localhost", "127.0.0.1" -CertStoreLocation "Cert:\CurrentUser\My" -NotAfter (Get-Date).AddYears(2) -FriendlyName "PomoFocus HTTPS Dev"
    Export-PfxCertificate -Cert $cert -FilePath $certPath -Password $secPass | Out-Null
}

$serverCertificate = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($certPath, $pfxPassword)

# Whitelist of allowed public static extensions
$allowedExtensions = @(".html", ".js", ".css", ".svg", ".json", ".ico", ".png", ".jpg", ".woff2")

# Blacklist of sensitive filenames
$blockedFiles = @(
    "server.ps1", "server_https.ps1", "generate_cert.ps1", "localhost.pfx", "test_https.ps1", "test_security.ps1",
    ".gitignore", "README.md", "devcon-jumpstart-build-brief.md",
    "package.json", "package-lock.json", ".env"
)

function Handle-ClientConnection {
    param([System.Net.Sockets.TcpClient]$client)
    
    $sslStream = $null
    try {
        $client.ReceiveTimeout = 4000
        $client.SendTimeout = 4000
        $netStream = $client.GetStream()
        
        $sslStream = New-Object System.Net.Security.SslStream($netStream, $false)
        $sslStream.AuthenticateAsServer($serverCertificate, $false, [System.Security.Authentication.SslProtocols]::Tls12 -bor [System.Security.Authentication.SslProtocols]::Tls13, $false)
        
        $buffer = New-Object byte[] 8192
        $bytesRead = $sslStream.Read($buffer, 0, $buffer.Length)
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
            $sslStream.Write($hdrBytes, 0, $hdrBytes.Length)
            $sslStream.Flush()
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
            $sslStream.Write($hdrBytes, 0, $hdrBytes.Length)
            $sslStream.Flush()
            return
        }
        
        if (-not $resolvedPath.StartsWith($rootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
            $respBody = "403 Forbidden"
            $hdr = "HTTP/1.1 403 Forbidden`r`nContent-Length: $($respBody.Length)`r`nConnection: close`r`n`r`n$respBody"
            $hdrBytes = [System.Text.Encoding]::ASCII.GetBytes($hdr)
            $sslStream.Write($hdrBytes, 0, $hdrBytes.Length)
            $sslStream.Flush()
            return
        }
        
        $fileName = [System.IO.Path]::GetFileName($resolvedPath)
        $fileExt = [System.IO.Path]::GetExtension($resolvedPath).ToLowerInvariant()
        
        # Filter Blocked Files & Extensions
        if ($fileName.StartsWith(".") -or ($blockedFiles -contains $fileName) -or ($allowedExtensions -notcontains $fileExt) -or (-not (Test-Path $resolvedPath -PathType Leaf))) {
            $respBody = "404 Not Found"
            $hdr = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($respBody.Length)`r`nConnection: close`r`n`r`n$respBody"
            $hdrBytes = [System.Text.Encoding]::ASCII.GetBytes($hdr)
            $sslStream.Write($hdrBytes, 0, $hdrBytes.Length)
            $sslStream.Flush()
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
            "Strict-Transport-Security: max-age=31536000; includeSubDomains; preload",
            "Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://esm.sh; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://esm.sh; img-src 'self' data: https:; media-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;",
            "X-Content-Type-Options: nosniff",
            "X-Frame-Options: DENY",
            "X-XSS-Protection: 1; mode=block",
            "Referrer-Policy: strict-origin-when-cross-origin",
            "Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()",
            "Cross-Origin-Opener-Policy: same-origin",
            "Cross-Origin-Resource-Policy: same-origin",
            "Server: PomoFocus-Secure-HTTPS/1.0",
            "Connection: close"
        ) -join "`r`n"
        
        $fullHeaderStr = "$responseHeaders`r`n`r`n"
        $hdrBytes = [System.Text.Encoding]::ASCII.GetBytes($fullHeaderStr)
        $sslStream.Write($hdrBytes, 0, $hdrBytes.Length)
        
        if ($method -eq "GET") {
            $sslStream.Write($fileBytes, 0, $fileBytes.Length)
        }
        
        $sslStream.Flush()
    } catch {
        # Silent handle of network disconnects
    } finally {
        try { if ($sslStream) { $sslStream.Dispose() } } catch {}
        try { if ($client) { $client.Close() } } catch {}
    }
}

$tcpListener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $HttpsPort)
$tcpListener.Start()
Write-Host "========================================================"
Write-Host "  PomoFocus SECURE HTTPS SERVER ACTIVE"
Write-Host "  URL: https://localhost:$HttpsPort/"
Write-Host "  TLS: TLS 1.2 / TLS 1.3 with HSTS & Strict CSP"
Write-Host "========================================================"

try {
    while ($true) {
        $client = $tcpListener.AcceptTcpClient()
        Handle-ClientConnection -client $client
    }
} finally {
    $tcpListener.Stop()
}

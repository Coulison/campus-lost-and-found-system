$certPath = Join-Path $PSScriptRoot "localhost.pfx"
$pfxPassword = ConvertTo-SecureString -String "PomoFocusSecure2026" -Force -AsPlainText

if (-not (Test-Path $certPath)) {
    Write-Host "Generating self-signed certificate for localhost HTTPS..."
    $cert = New-SelfSignedCertificate -DnsName "localhost", "127.0.0.1" -CertStoreLocation "Cert:\CurrentUser\My" -NotAfter (Get-Date).AddYears(2) -FriendlyName "PomoFocus HTTPS Dev"
    Export-PfxCertificate -Cert $cert -FilePath $certPath -Password $pfxPassword | Out-Null
    Write-Host "Certificate created and exported to $certPath"
} else {
    Write-Host "Certificate already exists at $certPath"
}

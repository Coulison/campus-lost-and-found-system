add-type @"
    using System.Net;
    using System.Security.Cryptography.X509Certificates;
    public class TrustAllCertsPolicy : ICertificatePolicy {
        public bool CheckValidationResult(
            ServicePoint srvPoint, X509Certificate certificate,
            WebRequest request, int certificateProblem) {
            return true;
        }
    }
"@
[System.Net.ServicePointManager]::CertificatePolicy = New-Object TrustAllCertsPolicy
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12 -bor [System.Net.SecurityProtocolType]::Tls13

@("https://localhost:8443/", "https://localhost:8443/app.js", "https://localhost:8443/styles.css", "https://localhost:8443/soundEngine.js") | ForEach-Object {
    $res = Invoke-WebRequest -Uri $_ -UseBasicParsing
    Write-Host "$_ => Status $($res.StatusCode) - Type $($res.Headers['Content-Type']) - Size $($res.Content.Length) bytes"
}

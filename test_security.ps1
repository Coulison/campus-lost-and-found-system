Write-Host "=== TEST 1: Main Page & Security Headers ==="
$r = Invoke-WebRequest -Uri "http://localhost:5173/" -UseBasicParsing
Write-Host "Status:" $r.StatusCode
$r.Headers.GetEnumerator() | ForEach-Object { Write-Host "$($_.Key): $($_.Value)" }

Write-Host "`n=== TEST 2: Blocking Sensitive File (server.ps1) ==="
try {
    $r2 = Invoke-WebRequest -Uri "http://localhost:5173/server.ps1" -UseBasicParsing
    Write-Host "Vulnerable! Status:" $r2.StatusCode
} catch {
    Write-Host "Passed! Blocked with Status:" [int]$_.Exception.Response.StatusCode
}

Write-Host "`n=== TEST 3: Path Traversal Attack (../../windows) ==="
try {
    $r3 = Invoke-WebRequest -Uri "http://localhost:5173/../../windows" -UseBasicParsing
    Write-Host "Vulnerable! Status:" $r3.StatusCode
} catch {
    Write-Host "Passed! Blocked with Status:" [int]$_.Exception.Response.StatusCode
}

Write-Host "`n=== TEST 4: Invalid HTTP Method (POST) ==="
try {
    $r4 = Invoke-WebRequest -Uri "http://localhost:5173/" -Method POST -UseBasicParsing
    Write-Host "Vulnerable! Status:" $r4.StatusCode
} catch {
    Write-Host "Passed! Blocked with Status:" [int]$_.Exception.Response.StatusCode
}

# NEST-Haus Security Testing Scripts
# ⚠️ Only use on development/staging environments!

# Test 1: DDoS Simulation
Write-Host "🚨 Testing DDoS Protection..." -ForegroundColor Yellow

# Simple burst test
Write-Host "`nRunning burst test (50 requests in 5 seconds)..."
$results = @()
$startTime = Get-Date

for ($i = 1; $i -le 50; $i++) {
    $requestStart = Get-Date
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/security/dashboard" -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
        $responseTime = (Get-Date) - $requestStart
        $results += [PSCustomObject]@{
            Request      = $i
            Success      = $true
            ResponseTime = $responseTime.TotalMilliseconds
            Status       = 200
        }
        Write-Host "✅ Request $i succeeded ($($responseTime.TotalMilliseconds)ms)" -ForegroundColor Green
    }
    catch {
        $responseTime = (Get-Date) - $requestStart
        $statusCode = if ($_.Exception.Response) { $_.Exception.Response.StatusCode } else { "Error" }
        $results += [PSCustomObject]@{
            Request      = $i
            Success      = $false
            ResponseTime = $responseTime.TotalMilliseconds
            Status       = $statusCode
        }
        
        if ($statusCode -eq 429) {
            Write-Host "⚠️ Request $i rate limited (429)" -ForegroundColor Red
        }
        else {
            Write-Host "❌ Request $i failed ($statusCode)" -ForegroundColor Red
        }
    }
    
    # Small delay to simulate realistic timing
    Start-Sleep -Milliseconds 100
}

$totalTime = (Get-Date) - $startTime
$successful = ($results | Where-Object Success -eq $true).Count
$rateLimited = ($results | Where-Object Status -eq 429).Count
$avgResponseTime = ($results | Measure-Object ResponseTime -Average).Average

Write-Host "`n📊 DDoS Test Results:" -ForegroundColor Cyan
Write-Host "Total Duration: $($totalTime.TotalSeconds) seconds"
Write-Host "Total Requests: $($results.Count)"
Write-Host "Successful: $successful ($([math]::Round($successful / $results.Count * 100, 1))%)"
Write-Host "Rate Limited: $rateLimited ($([math]::Round($rateLimited / $results.Count * 100, 1))%)"
Write-Host "Average Response Time: $([math]::Round($avgResponseTime, 2))ms"

if ($rateLimited / $results.Count -gt 0.5) {
    Write-Host "✅ DDoS Protection: WORKING (>50% rate limited)" -ForegroundColor Green
}
else {
    Write-Host "⚠️ DDoS Protection: Needs adjustment (<50% rate limited)" -ForegroundColor Yellow
}

# Test 2: Bot Detection
Write-Host "`n🤖 Testing Bot Detection..." -ForegroundColor Yellow

$botUserAgents = @(
    "HeadlessChrome/91.0.4472.124",
    "PhantomJS/2.1.1", 
    "selenium-webdriver",
    "puppeteer-core",
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
)

$botResults = @()

foreach ($userAgent in $botUserAgents) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/security/dashboard" -Method GET -Headers @{"User-Agent" = $userAgent } -ErrorAction SilentlyContinue
        $botResults += [PSCustomObject]@{
            UserAgent = $userAgent.Substring(0, [Math]::Min(30, $userAgent.Length))
            Blocked   = $false
            Status    = 200
        }
        Write-Host "⚠️ Bot not blocked: $($userAgent.Substring(0, 30))..." -ForegroundColor Yellow
    }
    catch {
        $statusCode = if ($_.Exception.Response) { $_.Exception.Response.StatusCode } else { "Error" }
        $botResults += [PSCustomObject]@{
            UserAgent = $userAgent.Substring(0, [Math]::Min(30, $userAgent.Length))
            Blocked   = ($statusCode -eq 403)
            Status    = $statusCode
        }
        
        if ($statusCode -eq 403) {
            Write-Host "✅ Bot blocked: $($userAgent.Substring(0, 30))..." -ForegroundColor Green
        }
        else {
            Write-Host "❌ Error testing: $($userAgent.Substring(0, 30))... ($statusCode)" -ForegroundColor Red
        }
    }
}

$blockedBots = ($botResults | Where-Object Blocked -eq $true).Count
Write-Host "`n📊 Bot Detection Results:" -ForegroundColor Cyan
Write-Host "Total Tests: $($botResults.Count)"
Write-Host "Blocked: $blockedBots ($([math]::Round($blockedBots / $botResults.Count * 100, 1))%)"

# Test 3: API Testing Endpoint
Write-Host "`n🔧 Testing Security API..." -ForegroundColor Yellow

try {
    Write-Host "Testing dashboard endpoint..."
    $dashboard = Invoke-RestMethod -Uri "http://localhost:3000/api/security/dashboard" -Method GET
    Write-Host "✅ Dashboard API working" -ForegroundColor Green
    
    Write-Host "Testing events endpoint..."
    $events = Invoke-RestMethod -Uri "http://localhost:3000/api/security/events?limit=5" -Method GET
    Write-Host "✅ Events API working" -ForegroundColor Green
    
    # Test the testing endpoint (if in development)
    if ($env:NODE_ENV -eq "development" -or !$env:NODE_ENV) {
        Write-Host "Testing security test endpoint..."
        $testResult = Invoke-RestMethod -Uri "http://localhost:3000/api/security/test?test=ddos" -Method GET
        Write-Host "✅ Security test API working" -ForegroundColor Green
    }
}
catch {
    Write-Host "❌ API Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 Security Testing Complete!" -ForegroundColor Green
Write-Host "Check the security dashboard at: http://localhost:3000/api/security/dashboard" -ForegroundColor Cyan

# Optional: Open browser to security endpoints
$openBrowser = Read-Host "`nOpen security dashboard in browser? (y/n)"
if ($openBrowser -eq "y" -or $openBrowser -eq "Y") {
    Start-Process "http://localhost:3000/api/security/dashboard"
}

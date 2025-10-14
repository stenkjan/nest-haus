# DDoS Test Script for NEST-Haus Security
Write-Host "🚨 Starting DDoS Protection Test..." -ForegroundColor Yellow

$success = 0
$blocked = 0
$errors = 0
$startTime = Get-Date

Write-Host "Sending 30 rapid requests to test rate limiting..."

for ($i = 1; $i -le 30; $i++) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/security/dashboard" -Method GET -TimeoutSec 3
        $success++
        if ($i % 5 -eq 0) {
            Write-Host "✅ Completed $i requests" -ForegroundColor Green
        }
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 429) {
            $blocked++
            Write-Host "⚠️ Request $i: RATE LIMITED" -ForegroundColor Yellow
        }
        else {
            $errors++
            Write-Host "❌ Request $i: ERROR ($($_.Exception.Response.StatusCode))" -ForegroundColor Red
        }
    }
    
    # Small delay to prevent overwhelming the system
    Start-Sleep -Milliseconds 50
}

$endTime = Get-Date
$duration = ($endTime - $startTime).TotalSeconds

Write-Host "`n📊 DDoS Test Results:" -ForegroundColor Cyan
Write-Host "Duration: $([math]::Round($duration, 2)) seconds"
Write-Host "Total Requests: 30"
Write-Host "Successful: $success ($([math]::Round($success / 30 * 100, 1))%)"
Write-Host "Rate Limited: $blocked ($([math]::Round($blocked / 30 * 100, 1))%)"
Write-Host "Errors: $errors ($([math]::Round($errors / 30 * 100, 1))%)"

# Evaluate protection effectiveness
if ($blocked -gt 10) {
    Write-Host "✅ DDoS Protection: EXCELLENT (>33% blocked)" -ForegroundColor Green
}
elseif ($blocked -gt 5) {
    Write-Host "⚠️ DDoS Protection: GOOD (17-33% blocked)" -ForegroundColor Yellow
}
else {
    Write-Host "🔧 DDoS Protection: May need tuning (<17% blocked)" -ForegroundColor Orange
}

Write-Host "`n🔍 Checking for security events..."
try {
    $events = Invoke-RestMethod -Uri "http://localhost:3000/api/security/events"
    Write-Host "Security Events Generated: $($events.total)" -ForegroundColor Cyan
    
    if ($events.total -gt 0) {
        Write-Host "`nRecent Events:"
        $events.data | Select-Object -First 5 | ForEach-Object {
            Write-Host "- $($_.eventType): $($_.description) [$($_.severity)]"
        }
    }
}
catch {
    Write-Host "❌ Could not retrieve security events: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 Test Complete!" -ForegroundColor Green

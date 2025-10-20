# 🔒 DDoS and Security Testing Guide for NEST-Haus

## 🚨 How to Test DDoS Protection

### Method 1: Simple PowerShell Burst Test

```powershell
# Test rate limiting with rapid requests
$results = @()
for ($i = 1; $i -le 100; $i++) {
    try {
        $start = Get-Date
        Invoke-RestMethod -Uri "http://localhost:3000/api/security/dashboard" -Method GET -TimeoutSec 2 | Out-Null
        $time = (Get-Date) - $start
        $results += "Request $i: SUCCESS ($($time.TotalMilliseconds)ms)"
        Write-Host "✅ Request $i: SUCCESS" -ForegroundColor Green
    }
    catch {
        $results += "Request $i: FAILED - $($_.Exception.Response.StatusCode)"
        if ($_.Exception.Response.StatusCode -eq 429) {
            Write-Host "⚠️ Request $i: RATE LIMITED" -ForegroundColor Yellow
        } else {
            Write-Host "❌ Request $i: ERROR" -ForegroundColor Red
        }
    }
    # No delay - send as fast as possible
}

# Show summary
$success = ($results | Where-Object { $_ -like "*SUCCESS*" }).Count
$rateLimited = ($results | Where-Object { $_ -like "*429*" }).Count
Write-Host "`n📊 Results: $success successful, $rateLimited rate limited out of 100 requests"
```

### Method 2: Concurrent Requests Test

```powershell
# Test with concurrent requests
$jobs = @()
for ($i = 1; $i -le 50; $i++) {
    $jobs += Start-Job -ScriptBlock {
        try {
            Invoke-RestMethod -Uri "http://localhost:3000/api/security/dashboard" -Method GET -TimeoutSec 5 | Out-Null
            "SUCCESS"
        }
        catch {
            if ($_.Exception.Response.StatusCode -eq 429) {
                "RATE_LIMITED"
            } else {
                "ERROR"
            }
        }
    }
}

$results = $jobs | Wait-Job | Receive-Job
$jobs | Remove-Job

$success = ($results | Where-Object { $_ -eq "SUCCESS" }).Count
$rateLimited = ($results | Where-Object { $_ -eq "RATE_LIMITED" }).Count
$errors = ($results | Where-Object { $_ -eq "ERROR" }).Count

Write-Host "📊 Concurrent Test Results:"
Write-Host "Success: $success"
Write-Host "Rate Limited: $rateLimited"
Write-Host "Errors: $errors"
```

## 🤖 Bot Detection Testing

### Test Different User Agents

```powershell
$botUserAgents = @(
    "HeadlessChrome/91.0.4472.124",
    "PhantomJS/2.1.1",
    "selenium-webdriver",
    "puppeteer-core",
    "curl/7.68.0",
    "wget/1.20.3"
)

foreach ($ua in $botUserAgents) {
    try {
        Invoke-RestMethod -Uri "http://localhost:3000/api/security/dashboard" -Headers @{"User-Agent" = $ua} | Out-Null
        Write-Host "⚠️ NOT BLOCKED: $ua" -ForegroundColor Yellow
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 403) {
            Write-Host "✅ BLOCKED: $ua" -ForegroundColor Green
        } else {
            Write-Host "❌ ERROR: $ua" -ForegroundColor Red
        }
    }
}
```

## 🧠 Behavioral Analysis Testing

### Test Session Analysis

```powershell
# Create a test session and analyze it
$sessionId = "test-session-$(Get-Date -Format 'yyyyMMddHHmmss')"

# Send some behavioral data
$behaviorData = @{
    sessionId = $sessionId
    interaction = @{
        eventType = "click"
        category = "test"
        elementId = "test-button"
        timeSpent = 250
        deviceInfo = @{
            type = "desktop"
            width = 1920
            height = 1080
        }
    }
}

try {
    # Send behavioral event
    Invoke-RestMethod -Uri "http://localhost:3000/api/security/events" -Method POST -Body ($behaviorData | ConvertTo-Json -Depth 10) -ContentType "application/json"

    # Analyze the session
    $analysisData = @{
        sessionId = $sessionId
        forceAnalysis = $true
    }

    $result = Invoke-RestMethod -Uri "http://localhost:3000/api/security/analyze" -Method POST -Body ($analysisData | ConvertTo-Json) -ContentType "application/json"

    Write-Host "🧠 Behavioral Analysis Results:"
    Write-Host "Risk Level: $($result.data.riskLevel)"
    Write-Host "Overall Risk: $([math]::Round($result.data.overallRisk * 100, 1))%"
    Write-Host "Bot Probability: $([math]::Round($result.data.behaviorAnalysis.botProbability * 100, 1))%"
}
catch {
    Write-Host "❌ Behavioral analysis failed: $($_.Exception.Message)"
}
```

## 🛡️ Content Protection Testing

### Browser Console Tests

Open your browser console on a page with ProtectedContent and run:

```javascript
// Test right-click protection
console.log("Testing right-click protection...");
const protectedElement = document.querySelector("[data-protection-level]");
if (protectedElement) {
  const rightClickEvent = new MouseEvent("contextmenu", {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  protectedElement.dispatchEvent(rightClickEvent);
}

// Test copy protection
console.log("Testing copy protection...");
const copyEvent = new ClipboardEvent("copy", {
  bubbles: true,
  cancelable: true,
});
document.dispatchEvent(copyEvent);

// Test keyboard shortcuts
console.log("Testing keyboard shortcuts...");
const ctrlCEvent = new KeyboardEvent("keydown", {
  key: "c",
  ctrlKey: true,
  bubbles: true,
  cancelable: true,
});
document.dispatchEvent(ctrlCEvent);

console.log("Content protection tests completed. Check for violation logs.");
```

## 📊 Monitor Security Events

### Check Security Dashboard

```powershell
# Get current security status
$dashboard = Invoke-RestMethod -Uri "http://localhost:3000/api/security/dashboard"
Write-Host "📊 Security Dashboard:"
Write-Host "Threat Level: $($dashboard.data.threatLevel)"
Write-Host "Active Sessions: $($dashboard.data.activeSessions)"

# Get recent events
$events = Invoke-RestMethod -Uri "http://localhost:3000/api/security/events?limit=10"
Write-Host "`n📋 Recent Security Events: $($events.total)"
foreach ($event in $events.data) {
    Write-Host "- $($event.eventType): $($event.description) [$($event.severity)]"
}
```

## 🔧 Advanced Testing

### Stress Test with Custom Parameters

```powershell
# Customize this for more aggressive testing
$testConfig = @{
    requestCount = 200
    concurrency = 20
    targetEndpoint = "/api/security/dashboard"
    testDuration = 30  # seconds
}

Write-Host "🚨 Starting stress test with $($testConfig.requestCount) requests..."

# Your stress testing logic here
```

## 🎯 Expected Results

### Rate Limiting

- **Good**: 30-50% of rapid requests should be rate limited (429 status)
- **Excellent**: 50-70% of burst requests should be blocked
- **Critical**: >70% blocking may indicate overly aggressive settings

### Bot Detection

- Known bot user agents should be blocked (403 status)
- Legitimate browsers should pass through
- Behavioral analysis should flag suspicious patterns

### Performance

- Normal requests should complete in <500ms
- Rate limited requests should respond immediately with 429
- System should remain responsive under load

## 🚨 Important Notes

1. **Only test on development/staging environments**
2. **Monitor system resources during testing**
3. **Check logs for security event details**
4. **Adjust rate limiting thresholds based on results**
5. **Test from different IPs to verify IP-based limiting**

## 📈 Interpreting Results

### Rate Limiting Effectiveness

- 0-30%: Too permissive, increase restrictions
- 30-70%: Good balance between security and usability
- 70%+: May be too restrictive for legitimate users

### Bot Detection Accuracy

- High false positives: Adjust detection sensitivity
- Low detection rate: Strengthen bot detection rules
- Perfect detection: Verify with edge cases

### Response Times

- <100ms: Excellent performance
- 100-500ms: Good performance
- > 500ms: May need optimization

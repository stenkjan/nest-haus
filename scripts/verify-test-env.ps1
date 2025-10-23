# PowerShell Test Environment Verification Script
# Run this script to verify your test environment is correctly configured

Write-Host "🔍 NEST-Haus Test Environment Verification" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.test exists
Write-Host "📄 Checking environment files..." -ForegroundColor Yellow
if (Test-Path ".env.test") {
    Write-Host "✓ .env.test file found" -ForegroundColor Green
}
else {
    Write-Host "✗ .env.test file not found" -ForegroundColor Red
    Write-Host "   Copy .env.test.example to .env.test and configure it:" -ForegroundColor Yellow
    Write-Host "   Copy-Item .env.test.example .env.test" -ForegroundColor Yellow
    exit 1
}

# Load environment variables
Get-Content .env.test | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

Write-Host ""
Write-Host "🔑 Verifying environment variables..." -ForegroundColor Yellow

$allChecksPass = $true

# Check DATABASE_URL
$DATABASE_URL = [Environment]::GetEnvironmentVariable("DATABASE_URL", "Process")
if ([string]::IsNullOrEmpty($DATABASE_URL)) {
    Write-Host "✗ DATABASE_URL not set" -ForegroundColor Red
    $allChecksPass = $false
}
else {
    Write-Host "✓ DATABASE_URL configured" -ForegroundColor Green
}

# Check REDIS_URL
$REDIS_URL = [Environment]::GetEnvironmentVariable("REDIS_URL", "Process")
if ([string]::IsNullOrEmpty($REDIS_URL)) {
    Write-Host "✗ REDIS_URL not set" -ForegroundColor Red
    $allChecksPass = $false
}
else {
    Write-Host "✓ REDIS_URL configured" -ForegroundColor Green
}

# Check Stripe keys
$STRIPE_SECRET_KEY = [Environment]::GetEnvironmentVariable("STRIPE_SECRET_KEY", "Process")
if ([string]::IsNullOrEmpty($STRIPE_SECRET_KEY)) {
    Write-Host "✗ STRIPE_SECRET_KEY not set" -ForegroundColor Red
    $allChecksPass = $false
}
elseif (-not $STRIPE_SECRET_KEY.StartsWith("sk_test_")) {
    Write-Host "✗ STRIPE_SECRET_KEY must start with 'sk_test_' for testing" -ForegroundColor Red
    $allChecksPass = $false
}
else {
    Write-Host "✓ STRIPE_SECRET_KEY configured (test mode)" -ForegroundColor Green
}

$STRIPE_PUBLISHABLE_KEY = [Environment]::GetEnvironmentVariable("STRIPE_PUBLISHABLE_KEY", "Process")
if ([string]::IsNullOrEmpty($STRIPE_PUBLISHABLE_KEY)) {
    Write-Host "✗ STRIPE_PUBLISHABLE_KEY not set" -ForegroundColor Red
    $allChecksPass = $false
}
elseif (-not $STRIPE_PUBLISHABLE_KEY.StartsWith("pk_test_")) {
    Write-Host "✗ STRIPE_PUBLISHABLE_KEY must start with 'pk_test_' for testing" -ForegroundColor Red
    $allChecksPass = $false
}
else {
    Write-Host "✓ STRIPE_PUBLISHABLE_KEY configured (test mode)" -ForegroundColor Green
}

# Check NODE_ENV
$NODE_ENV = [Environment]::GetEnvironmentVariable("NODE_ENV", "Process")
if ($NODE_ENV -ne "test") {
    Write-Host "⚠ NODE_ENV should be 'test' (current: $NODE_ENV)" -ForegroundColor Yellow
}
else {
    Write-Host "✓ NODE_ENV set to test" -ForegroundColor Green
}

Write-Host ""
Write-Host "🗄️  Checking database connection..." -ForegroundColor Yellow

# Check if psql is available
$psqlAvailable = Get-Command psql -ErrorAction SilentlyContinue
if ($psqlAvailable) {
    try {
        $result = & psql $DATABASE_URL -c "SELECT 1;" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ PostgreSQL connection successful" -ForegroundColor Green
        }
        else {
            Write-Host "✗ Cannot connect to PostgreSQL database" -ForegroundColor Red
            Write-Host "   Make sure PostgreSQL is running and the test database exists" -ForegroundColor Yellow
            $allChecksPass = $false
        }
    }
    catch {
        Write-Host "✗ Error connecting to PostgreSQL: $_" -ForegroundColor Red
        $allChecksPass = $false
    }
}
else {
    Write-Host "⚠ psql not found - cannot verify PostgreSQL connection" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔴 Checking Redis connection..." -ForegroundColor Yellow

# Check if redis-cli is available
$redisCliAvailable = Get-Command redis-cli -ErrorAction SilentlyContinue
if ($redisCliAvailable) {
    try {
        $result = & redis-cli -u $REDIS_URL ping 2>&1
        if ($result -match "PONG") {
            Write-Host "✓ Redis connection successful" -ForegroundColor Green
        }
        else {
            Write-Host "✗ Cannot connect to Redis" -ForegroundColor Red
            Write-Host "   Make sure Redis is running" -ForegroundColor Yellow
            $allChecksPass = $false
        }
    }
    catch {
        Write-Host "✗ Error connecting to Redis: $_" -ForegroundColor Red
        $allChecksPass = $false
    }
}
else {
    Write-Host "⚠ redis-cli not found - cannot verify Redis connection" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Checking Node.js dependencies..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
    Write-Host "✓ node_modules directory exists" -ForegroundColor Green
    
    if (Test-Path "node_modules/vitest") {
        Write-Host "✓ vitest is installed" -ForegroundColor Green
    }
    else {
        Write-Host "✗ vitest is not installed" -ForegroundColor Red
        Write-Host "   Run: npm install" -ForegroundColor Yellow
        $allChecksPass = $false
    }
}
else {
    Write-Host "✗ node_modules not found" -ForegroundColor Red
    Write-Host "   Run: npm install" -ForegroundColor Yellow
    $allChecksPass = $false
}

Write-Host ""
Write-Host "🔧 Checking Prisma setup..." -ForegroundColor Yellow

if (Test-Path "prisma/schema.prisma") {
    Write-Host "✓ Prisma schema found" -ForegroundColor Green
    
    if (Test-Path "node_modules/.prisma") {
        Write-Host "✓ Prisma client is generated" -ForegroundColor Green
    }
    else {
        Write-Host "⚠ Prisma client not generated" -ForegroundColor Yellow
        Write-Host "   Run: npx prisma generate" -ForegroundColor Yellow
    }
}
else {
    Write-Host "✗ Prisma schema not found" -ForegroundColor Red
    $allChecksPass = $false
}

Write-Host ""
Write-Host "📋 Summary" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Write-Host ""
if ($allChecksPass) {
    Write-Host "✅ All checks passed! Ready to run tests." -ForegroundColor Green
}
else {
    Write-Host "⚠️  Some checks failed. Please fix the configuration before running tests." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. If any checks failed, fix the configuration"
Write-Host "2. Run: npm test -- --run to execute all tests"
Write-Host "3. Run: npm test -- --coverage to see coverage report"
Write-Host ""
Write-Host "For detailed test documentation, see:" -ForegroundColor Cyan
Write-Host "  docs/COMPREHENSIVE_TESTING_PLAN.md"
Write-Host ""


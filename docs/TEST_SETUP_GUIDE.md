# Test Environment Setup Guide

This guide will walk you through setting up and running the comprehensive test suite for NEST-Haus.

---

## Quick Start (5 minutes)

```bash
# 1. Copy environment template
cp .env.test.example .env.test

# 2. Edit .env.test with your credentials
# - Add your Stripe test keys
# - Configure database URLs
# - Set Redis connection

# 3. Verify environment (Windows)
pwsh scripts/verify-test-env.ps1

# OR (Linux/Mac)
bash scripts/verify-test-env.sh

# 4. Run tests
npm test
```

---

## Detailed Setup Instructions

### Step 1: Configure Test Environment

#### 1.1 Create Test Environment File

```bash
cp .env.test.example .env.test
```

#### 1.2 Configure Stripe Test Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your test keys (they start with `sk_test_` and `pk_test_`)
3. Add them to `.env.test`:

```env
STRIPE_SECRET_KEY="sk_test_YOUR_KEY_HERE"
STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_KEY_HERE"
```

⚠️ **Important**: Never use production keys for testing!

#### 1.3 Configure Test Database

**Option A: Use existing database (easier)**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nest_haus_test"
```

**Option B: Create new test database (recommended)**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create test database
CREATE DATABASE nest_haus_test;

# Exit
\q
```

Then update `.env.test`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nest_haus_test"
```

#### 1.4 Configure Redis

**Default configuration (uses database 1)**:

```env
REDIS_URL="redis://localhost:6379/1"
```

**If Redis requires authentication**:

```env
REDIS_URL="redis://username:password@localhost:6379/1"
```

### Step 2: Install Dependencies

```bash
# Install all dependencies including test framework
npm install

# Generate Prisma client
npx prisma generate

# Push schema to test database
npx prisma db push
```

### Step 3: Verify Environment

**On Windows (PowerShell)**:

```powershell
pwsh scripts/verify-test-env.ps1
```

**On Linux/Mac (Bash)**:

```bash
chmod +x scripts/verify-test-env.sh
./scripts/verify-test-env.sh
```

**Expected Output**:

```
✓ .env.test file found
✓ DATABASE_URL configured
✓ REDIS_URL configured
✓ STRIPE_SECRET_KEY configured (test mode)
✓ PostgreSQL connection successful
✓ Redis connection successful
✓ vitest is installed
✓ Prisma client is generated
```

### Step 4: Run Tests

#### Run All Tests

```bash
npm test
```

#### Run Specific Test Suite

```bash
# Session tracking tests
npm test session-tracking

# Stripe payment tests
npm test stripe-payment

# Form validation tests
npm test form-validation

# All integration tests
npm test -- --testPathPattern=integration
```

#### Run with Coverage Report

```bash
npm test -- --coverage
```

This will generate a coverage report in `coverage/` directory.

#### Watch Mode (for development)

```bash
npm test -- --watch
```

Tests will re-run automatically when you make changes.

---

## Troubleshooting

### Issue: Cannot connect to PostgreSQL

**Error**: `connection refused` or `ECONNREFUSED`

**Solution**:

1. Check if PostgreSQL is running:

   ```bash
   # Windows
   Get-Service -Name postgresql*

   # Linux/Mac
   sudo service postgresql status
   ```

2. Verify database exists:

   ```bash
   psql -U postgres -l
   ```

3. Check DATABASE_URL format:
   ```
   postgresql://[user]:[password]@[host]:[port]/[database]
   ```

### Issue: Cannot connect to Redis

**Error**: `ECONNREFUSED` or `Redis connection failed`

**Solution**:

1. Check if Redis is running:

   ```bash
   # Windows
   redis-cli ping

   # Linux/Mac
   redis-cli ping
   ```

2. Expected response: `PONG`

3. If not running, start Redis:

   ```bash
   # Windows (if installed as service)
   net start Redis

   # Linux
   sudo service redis-server start

   # Mac
   brew services start redis
   ```

### Issue: Stripe API errors

**Error**: `Invalid API key` or `No such customer`

**Solution**:

1. Verify you're using test keys (start with `sk_test_` and `pk_test_`)
2. Check keys are correctly copied (no extra spaces)
3. Ensure keys are from test mode in Stripe dashboard

### Issue: Prisma client not generated

**Error**: `Cannot find module '@prisma/client'`

**Solution**:

```bash
npx prisma generate
```

### Issue: Tests timing out

**Error**: `Test timeout exceeded`

**Solution**:

1. Increase timeout in test config
2. Check if database/Redis connections are slow
3. Ensure development server is not running on same port

---

## Test Data Management

### Automatic Cleanup

Tests automatically clean up after themselves if `AUTO_CLEANUP=true` in `.env.test`.

**What gets cleaned**:

- Test sessions (sessionId starts with `test_`)
- Test inquiries (email contains `@test-nest-haus.com`)
- Related events (cascade deleted)

### Manual Cleanup

**Clean all test data**:

```sql
-- Delete test sessions
DELETE FROM user_sessions WHERE session_id LIKE 'test_%';

-- Delete test inquiries
DELETE FROM customer_inquiries WHERE email LIKE '%@test-nest-haus.com';
```

**Clear Redis test database**:

```bash
redis-cli -n 1 FLUSHDB
```

### Reset Test Database

⚠️ **Warning**: This deletes ALL data in test database!

```bash
npx prisma migrate reset --force
```

---

## Running Tests in CI/CD

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: nest_haus_test
        ports:
          - 5432:5432

      redis:
        image: redis:7
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: "20"

      - run: npm ci

      - name: Setup environment
        run: |
          cp .env.test.example .env.test
          # Add secrets from GitHub

      - run: npx prisma generate
      - run: npx prisma db push

      - run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## Test Execution Schedule

### During Beta (Daily)

```bash
# Morning check (before 9 AM)
npm test -- --run > logs/test-results-$(date +%Y%m%d).log

# Review results
cat logs/test-results-*.log | grep "FAIL"
```

### Weekly Deep Dive

```bash
# Run full suite with coverage
npm test -- --coverage

# Review coverage report
open coverage/index.html  # Mac
start coverage/index.html  # Windows
```

---

## Monitoring During Beta

### Key Metrics to Track

1. **Test Pass Rate**
   - Target: >95%
   - Alert if: <90%

2. **API Response Times**
   - Target: <200ms average
   - Alert if: >500ms

3. **Error Rate**
   - Target: <1%
   - Alert if: >5%

4. **Data Integrity**
   - Target: 100% complete records
   - Alert if: Missing data detected

### Daily Checklist

- [ ] Run full test suite
- [ ] Check for failed tests
- [ ] Review error logs
- [ ] Verify data integrity
- [ ] Check Redis/PostgreSQL health
- [ ] Monitor Stripe test transactions

### Weekly Checklist

- [ ] Generate coverage report
- [ ] Review drop-off analysis
- [ ] Check conversion funnel
- [ ] Analyze user feedback
- [ ] Update test documentation
- [ ] Clean up test data

---

## After Beta: Removal Process

When beta testing is complete, follow these steps:

### 1. Document Results

```bash
# Fill in the template
code docs/BETA_TESTING_RESULTS.md
```

### 2. Archive Test Files

```bash
# Create archive directory
mkdir -p docs/archive/tests

# Move test files
mv src/test/* docs/archive/tests/

# Archive documentation
mv docs/COMPREHENSIVE_TESTING_PLAN.md docs/archive/
mv docs/TESTING_IMPLEMENTATION_SUMMARY.md docs/archive/
```

### 3. Remove Test Dependencies

Edit `package.json`:

```json
{
  "devDependencies": {
    // Remove these:
    "vitest": "^3.2.4",
    "@vitest/ui": "^3.2.4"
  },
  "scripts": {
    // Remove these:
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

Then run:

```bash
npm install
```

### 4. Clean Up Environment

```bash
# Drop test database
psql -U postgres -c "DROP DATABASE nest_haus_test;"

# Clear Redis test database
redis-cli -n 1 FLUSHDB

# Remove test environment file
rm .env.test
```

### 5. Keep Documentation

Archive but don't delete:

- `BETA_TESTING_RESULTS.md` - Results and lessons learned
- `COMPREHENSIVE_TESTING_PLAN.md` - Testing methodology reference

---

## Need Help?

### Resources

- **Test Documentation**: `docs/COMPREHENSIVE_TESTING_PLAN.md`
- **Test Files**: `src/test/`
- **Validation Library**: `src/lib/validation.ts`

### Common Questions

**Q: Can I run tests while dev server is running?**  
A: Yes, but use different ports/databases to avoid conflicts.

**Q: How long should tests take?**  
A: ~1 minute for full suite, ~30 seconds for integration tests.

**Q: Do tests require internet connection?**  
A: Only for Stripe API calls (can be mocked if needed).

**Q: Can I run tests in production?**  
A: No! Tests use test database and test Stripe keys only.

---

## Success Criteria

Before proceeding to production, ensure:

- ✅ All tests passing (>95% pass rate)
- ✅ Coverage >90% for critical paths
- ✅ No data integrity issues
- ✅ API response times <200ms average
- ✅ Error rate <1%
- ✅ Stripe integration working in test mode
- ✅ Form validation catching invalid inputs
- ✅ Drop-off tracking accurate

---

**Setup complete! You're ready to run tests.** 🚀

For detailed test information, see `docs/COMPREHENSIVE_TESTING_PLAN.md`

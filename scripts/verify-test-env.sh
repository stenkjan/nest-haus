#!/bin/bash

# Test Environment Setup Script
# Run this script to verify your test environment is correctly configured

echo "🔍 NEST-Haus Test Environment Verification"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.test exists
echo "📄 Checking environment files..."
if [ -f ".env.test" ]; then
    echo -e "${GREEN}✓${NC} .env.test file found"
else
    echo -e "${RED}✗${NC} .env.test file not found"
    echo "   Copy .env.test.example to .env.test and configure it:"
    echo "   cp .env.test.example .env.test"
    exit 1
fi

# Load environment variables
export $(cat .env.test | grep -v '^#' | xargs)

echo ""
echo "🔑 Verifying environment variables..."

# Check DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}✗${NC} DATABASE_URL not set"
else
    echo -e "${GREEN}✓${NC} DATABASE_URL configured"
fi

# Check REDIS_URL
if [ -z "$REDIS_URL" ]; then
    echo -e "${RED}✗${NC} REDIS_URL not set"
else
    echo -e "${GREEN}✓${NC} REDIS_URL configured"
fi

# Check Stripe keys
if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo -e "${RED}✗${NC} STRIPE_SECRET_KEY not set"
elif [[ ! "$STRIPE_SECRET_KEY" =~ ^sk_test_ ]]; then
    echo -e "${RED}✗${NC} STRIPE_SECRET_KEY must start with 'sk_test_' for testing"
else
    echo -e "${GREEN}✓${NC} STRIPE_SECRET_KEY configured (test mode)"
fi

if [ -z "$STRIPE_PUBLISHABLE_KEY" ]; then
    echo -e "${RED}✗${NC} STRIPE_PUBLISHABLE_KEY not set"
elif [[ ! "$STRIPE_PUBLISHABLE_KEY" =~ ^pk_test_ ]]; then
    echo -e "${RED}✗${NC} STRIPE_PUBLISHABLE_KEY must start with 'pk_test_' for testing"
else
    echo -e "${GREEN}✓${NC} STRIPE_PUBLISHABLE_KEY configured (test mode)"
fi

# Check NODE_ENV
if [ "$NODE_ENV" != "test" ]; then
    echo -e "${YELLOW}⚠${NC} NODE_ENV should be 'test' (current: $NODE_ENV)"
else
    echo -e "${GREEN}✓${NC} NODE_ENV set to test"
fi

echo ""
echo "🗄️  Checking database connection..."

# Check if PostgreSQL is running
if command -v psql &> /dev/null; then
    # Extract database name from DATABASE_URL
    DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
    
    # Try to connect to database
    if psql $DATABASE_URL -c "SELECT 1;" &> /dev/null; then
        echo -e "${GREEN}✓${NC} PostgreSQL connection successful"
        echo -e "${GREEN}✓${NC} Test database '$DB_NAME' is accessible"
    else
        echo -e "${RED}✗${NC} Cannot connect to PostgreSQL database"
        echo "   Make sure PostgreSQL is running and the test database exists"
    fi
else
    echo -e "${YELLOW}⚠${NC} psql not found - cannot verify PostgreSQL connection"
fi

echo ""
echo "🔴 Checking Redis connection..."

# Check if Redis is running
if command -v redis-cli &> /dev/null; then
    if redis-cli -u $REDIS_URL ping &> /dev/null; then
        echo -e "${GREEN}✓${NC} Redis connection successful"
    else
        echo -e "${RED}✗${NC} Cannot connect to Redis"
        echo "   Make sure Redis is running"
    fi
else
    echo -e "${YELLOW}⚠${NC} redis-cli not found - cannot verify Redis connection"
fi

echo ""
echo "📦 Checking Node.js dependencies..."

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules directory exists"
    
    # Check for vitest
    if [ -d "node_modules/vitest" ]; then
        echo -e "${GREEN}✓${NC} vitest is installed"
    else
        echo -e "${RED}✗${NC} vitest is not installed"
        echo "   Run: npm install"
    fi
else
    echo -e "${RED}✗${NC} node_modules not found"
    echo "   Run: npm install"
fi

echo ""
echo "🔧 Checking Prisma setup..."

if [ -f "prisma/schema.prisma" ]; then
    echo -e "${GREEN}✓${NC} Prisma schema found"
    
    # Check if Prisma client is generated
    if [ -d "node_modules/.prisma" ]; then
        echo -e "${GREEN}✓${NC} Prisma client is generated"
    else
        echo -e "${YELLOW}⚠${NC} Prisma client not generated"
        echo "   Run: npx prisma generate"
    fi
else
    echo -e "${RED}✗${NC} Prisma schema not found"
fi

echo ""
echo "📋 Summary"
echo "=========================================="

# Count checks
TOTAL_CHECKS=0
PASSED_CHECKS=0

# This is a simplified check - in production you'd track each check
if [ -f ".env.test" ]; then
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
fi

echo ""
echo "Next steps:"
echo "1. If any checks failed, fix the configuration"
echo "2. Run: npm test -- --run to execute all tests"
echo "3. Run: npm test -- --coverage to see coverage report"
echo ""
echo "For detailed test documentation, see:"
echo "  docs/COMPREHENSIVE_TESTING_PLAN.md"
echo ""


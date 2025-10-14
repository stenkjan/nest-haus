#!/bin/bash

# NEST-Haus Security Testing Script
# ⚠️ Only use on development/staging environments!

echo "🚨 NEST-Haus Security Testing Suite"
echo "=================================="

BASE_URL="http://localhost:3000"

# Check if server is running
echo "📡 Checking if server is running..."
if curl -s -f "$BASE_URL/api/security/dashboard" > /dev/null 2>&1; then
    echo "✅ Server is running"
else
    echo "❌ Server is not running or not responding"
    echo "Please start the server with: npm run dev"
    exit 1
fi

# Test 1: DDoS Simulation
echo ""
echo "🚨 Testing DDoS Protection..."
echo "Running 30 rapid requests..."

SUCCESS_COUNT=0
RATE_LIMITED=0
ERROR_COUNT=0
START_TIME=$(date +%s)

for i in $(seq 1 30); do
    RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null "$BASE_URL/api/security/dashboard" 2>/dev/null)
    
    case $RESPONSE in
        200)
            SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
            echo "✅ Request $i: Success"
            ;;
        429)
            RATE_LIMITED=$((RATE_LIMITED + 1))
            echo "⚠️ Request $i: Rate Limited"
            ;;
        *)
            ERROR_COUNT=$((ERROR_COUNT + 1))
            echo "❌ Request $i: Error ($RESPONSE)"
            ;;
    esac
    
    # Small delay
    sleep 0.1
done

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "📊 DDoS Test Results:"
echo "Duration: ${DURATION}s"
echo "Total Requests: 30"
echo "Successful: $SUCCESS_COUNT ($(( SUCCESS_COUNT * 100 / 30 ))%)"
echo "Rate Limited: $RATE_LIMITED ($(( RATE_LIMITED * 100 / 30 ))%)"
echo "Errors: $ERROR_COUNT ($(( ERROR_COUNT * 100 / 30 ))%)"

if [ $RATE_LIMITED -gt 15 ]; then
    echo "✅ DDoS Protection: WORKING (>50% rate limited)"
else
    echo "⚠️ DDoS Protection: Needs adjustment (<50% rate limited)"
fi

# Test 2: Bot Detection
echo ""
echo "🤖 Testing Bot Detection..."

BOT_USER_AGENTS=(
    "HeadlessChrome/91.0.4472.124"
    "PhantomJS/2.1.1"
    "selenium-webdriver"
    "puppeteer-core"
    "Mozilla/5.0 (compatible; Googlebot/2.1)"
)

BLOCKED_COUNT=0
TOTAL_BOT_TESTS=0

for user_agent in "${BOT_USER_AGENTS[@]}"; do
    TOTAL_BOT_TESTS=$((TOTAL_BOT_TESTS + 1))
    RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null -H "User-Agent: $user_agent" "$BASE_URL/api/security/dashboard" 2>/dev/null)
    
    case $RESPONSE in
        403)
            BLOCKED_COUNT=$((BLOCKED_COUNT + 1))
            echo "✅ Bot blocked: ${user_agent:0:30}..."
            ;;
        200)
            echo "⚠️ Bot not blocked: ${user_agent:0:30}..."
            ;;
        *)
            echo "❌ Error testing: ${user_agent:0:30}... ($RESPONSE)"
            ;;
    esac
done

echo ""
echo "📊 Bot Detection Results:"
echo "Total Tests: $TOTAL_BOT_TESTS"
echo "Blocked: $BLOCKED_COUNT ($(( BLOCKED_COUNT * 100 / TOTAL_BOT_TESTS ))%)"

# Test 3: API Endpoints
echo ""
echo "🔧 Testing Security API Endpoints..."

# Test dashboard
if curl -s -f "$BASE_URL/api/security/dashboard" > /dev/null; then
    echo "✅ Dashboard API: Working"
else
    echo "❌ Dashboard API: Failed"
fi

# Test events
if curl -s -f "$BASE_URL/api/security/events?limit=5" > /dev/null; then
    echo "✅ Events API: Working"
else
    echo "❌ Events API: Failed"
fi

# Test security test endpoint (development only)
if curl -s -f "$BASE_URL/api/security/test?test=bot" > /dev/null 2>&1; then
    echo "✅ Security Test API: Working"
else
    echo "⚠️ Security Test API: Not available (production mode?)"
fi

# Test 4: Behavioral Analysis
echo ""
echo "🧠 Testing Behavioral Analysis..."

SESSION_ID="test-session-$(date +%s)"

# Simulate some behavioral data
curl -s -X POST "$BASE_URL/api/security/events" \
    -H "Content-Type: application/json" \
    -H "X-Session-ID: $SESSION_ID" \
    -d '{
        "sessionId": "'$SESSION_ID'",
        "interaction": {
            "eventType": "click",
            "category": "test",
            "elementId": "test-button",
            "timeSpent": 250,
            "deviceInfo": {
                "type": "desktop",
                "width": 1920,
                "height": 1080
            }
        }
    }' > /dev/null 2>&1

# Analyze the behavior
ANALYSIS_RESULT=$(curl -s -X POST "$BASE_URL/api/security/analyze" \
    -H "Content-Type: application/json" \
    -d '{
        "sessionId": "'$SESSION_ID'",
        "forceAnalysis": true
    }' 2>/dev/null)

if echo "$ANALYSIS_RESULT" | grep -q "success"; then
    echo "✅ Behavioral Analysis: Working"
    
    # Extract risk level if possible (requires jq for full parsing)
    if command -v jq > /dev/null 2>&1; then
        RISK_LEVEL=$(echo "$ANALYSIS_RESULT" | jq -r '.data.riskLevel // "unknown"')
        echo "   Risk Level: $RISK_LEVEL"
    fi
else
    echo "❌ Behavioral Analysis: Failed"
fi

echo ""
echo "🎯 Security Testing Complete!"
echo ""
echo "📊 Summary:"
echo "- DDoS Protection: $(if [ $RATE_LIMITED -gt 15 ]; then echo "✅ Working"; else echo "⚠️ Needs adjustment"; fi)"
echo "- Bot Detection: $(if [ $BLOCKED_COUNT -gt 2 ]; then echo "✅ Working"; else echo "⚠️ Needs adjustment"; fi)"
echo "- API Endpoints: Available"
echo "- Behavioral Analysis: Available"

echo ""
echo "🔗 Access security data:"
echo "Dashboard: $BASE_URL/api/security/dashboard"
echo "Events: $BASE_URL/api/security/events"
echo "Test Suite: $BASE_URL/api/security/test?test=all"

# Offer to open browser (if available)
if command -v xdg-open > /dev/null 2>&1; then
    read -p "Open security dashboard in browser? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        xdg-open "$BASE_URL/api/security/dashboard"
    fi
elif command -v open > /dev/null 2>&1; then
    read -p "Open security dashboard in browser? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "$BASE_URL/api/security/dashboard"
    fi
fi

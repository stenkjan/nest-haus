# Security Testing Guide - NEST-Haus

## 🔒 Security Features Implemented

### Rate Limiting

- **IP-based**: 300 requests per 15 minutes (20 req/minute average)
- **Session-based**: 200 requests per 15 minutes per session
- **User-friendly**: Allows normal browsing and configurator usage
- **Attack prevention**: Blocks rapid-fire automated attacks

### CSRF Protection

- **Origin validation**: Checks request origin against allowed domains
- **Referer fallback**: Validates referer header if origin missing
- **Development mode**: More lenient for localhost testing
- **Admin protection**: Requires CSRF tokens for admin operations

### Input Sanitization

- **XSS prevention**: DOMPurify sanitization of all JSON inputs
- **SQL injection**: Parameterized queries via Prisma
- **Recursive cleaning**: Deep sanitization of nested objects
- **Malicious pattern detection**: Suspicious request logging

### Security Headers

- **XSS Protection**: `X-XSS-Protection: 1; mode=block`
- **Clickjacking**: `X-Frame-Options: DENY`
- **MIME sniffing**: `X-Content-Type-Options: nosniff`
- **Referrer policy**: `Referrer-Policy: strict-origin-when-cross-origin`
- **HSTS**: Enabled in production

## 🧪 Automated Testing

### Quick Test (Recommended)

```bash
# Make sure server is running
npm run dev

# In another terminal, run the test
node scripts/test-security-native.js
```

### Expected Results

```
🔒 Testing Security Middleware (Native Node.js)...

1. Testing basic GET request...
✅ GET request successful
   Status: 200
   Rate Limits: 300 req/IP
   Security Headers:
     ✅ x-content-type-options: nosniff
     ✅ x-frame-options: DENY
     ✅ x-xss-protection: 1; mode=block

2. Testing POST request with valid origin...
✅ POST request with valid origin successful
   CSRF Protection: PASSED - Valid origin
   Input Sanitization: PASSED - Data sanitized

3. Testing POST request with invalid origin...
✅ POST request with invalid origin correctly blocked (403)

4. Testing rate limiting with rapid requests...
✅ 15/15 rapid requests succeeded
✅ Rate limiting allows normal user behavior

🎉 Security tests completed!
```

## 🌐 Manual Browser Testing

### Test 1: Basic Security Headers

1. Open browser DevTools (F12)
2. Go to `http://localhost:3000/api/test/security`
3. Check Response Headers tab:
   - `X-Content-Type-Options: nosniff` ✅
   - `X-Frame-Options: DENY` ✅
   - `X-XSS-Protection: 1; mode=block` ✅

### Test 2: Rate Limiting (Normal Usage)

1. Open browser console
2. Run this script to simulate normal browsing:

```javascript
// Test normal user behavior
async function testNormalUsage() {
  for (let i = 1; i <= 20; i++) {
    const response = await fetch("/api/test/security?test=" + i);
    console.log(`Request ${i}: ${response.status}`);
    await new Promise((r) => setTimeout(r, 1000)); // 1 second delay
  }
}
testNormalUsage();
```

**Expected**: All 20 requests should succeed (status 200)

### Test 3: Rate Limiting (Rapid Requests)

1. Run this script to test rate limiting:

```javascript
// Test rate limiting
async function testRateLimit() {
  const promises = [];
  for (let i = 1; i <= 50; i++) {
    promises.push(
      fetch("/api/test/security?rapid=" + i).then((r) => ({
        request: i,
        status: r.status,
        ok: r.ok,
      }))
    );
  }
  const results = await Promise.all(promises);
  const success = results.filter((r) => r.ok).length;
  console.log(`${success}/50 requests succeeded`);
  console.log(
    "Failed requests:",
    results.filter((r) => !r.ok)
  );
}
testRateLimit();
```

**Expected**: Most requests succeed, some may be rate limited

### Test 4: CSRF Protection

1. Test valid POST request:

```javascript
fetch("/api/test/security", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    // Origin header automatically set by browser
  },
  body: JSON.stringify({ test: "valid request" }),
})
  .then((r) => r.json())
  .then(console.log);
```

**Expected**: Should succeed with CSRF validation passed

2. Test invalid origin (simulate from external tool):

```bash
curl -X POST http://localhost:3000/api/test/security \
  -H "Content-Type: application/json" \
  -H "Origin: https://malicious-site.com" \
  -d '{"test": "should be blocked"}'
```

**Expected**: Should return 403 Forbidden

### Test 5: Input Sanitization

1. Test XSS prevention:

```javascript
fetch("/api/test/security", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userInput: '<script>alert("XSS")</script>',
    htmlContent: '<img src="x" onerror="alert(1)">',
    nestedXSS: {
      level1: '<svg onload="alert(2)">',
      level2: { deep: '<iframe src="javascript:alert(3)"></iframe>' },
    },
  }),
})
  .then((r) => r.json())
  .then(console.log);
```

**Expected**: All script tags and event handlers should be sanitized

## 📊 Performance Testing

### Configurator Usage Simulation

Test typical configurator usage patterns:

```javascript
async function simulateConfiguratorUsage() {
  const sessionId = "test-session-" + Date.now();

  // Simulate user configuring house over 5 minutes
  for (let step = 1; step <= 100; step++) {
    await fetch("/api/test/security", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-session-id": sessionId,
      },
      body: JSON.stringify({
        configuratorStep: step,
        selection: Math.random() > 0.5 ? "option1" : "option2",
      }),
    });

    // Random delay between 1-5 seconds (realistic user behavior)
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 4000));
  }
}

simulateConfiguratorUsage();
```

**Expected**: All requests should succeed, demonstrating that rate limits don't interfere with normal configurator usage.

## ⚠️ Security Considerations

### Rate Limit Guidelines

- **Normal browsing**: 20 requests/minute easily supported
- **Configurator usage**: 200 session requests in 15 minutes
- **Image loading**: Multiple image requests counted but generous limits
- **Form submissions**: No additional restrictions for normal use

### CSRF Best Practices

- **Production**: Stricter origin validation
- **Development**: Lenient localhost validation
- **Admin routes**: Always require CSRF tokens
- **API endpoints**: Origin-based validation

### Monitoring & Alerts

- **Rate limit violations**: Logged with IP and patterns
- **CSRF failures**: Logged with origin and referer
- **Suspicious patterns**: Automatic detection and logging
- **Performance impact**: <50ms overhead per request

## 🚨 Troubleshooting

### Rate Limit Too Strict

If legitimate users are being blocked:

1. Check current limits in `SecurityMiddleware.ts`
2. Increase `maxRequests` or `perSession` values
3. Consider adjusting `windowMs` (time window)

### CSRF Blocking Valid Requests

If valid requests are blocked:

1. Check `allowedOrigins` configuration
2. Verify development mode settings
3. Add additional trusted origins if needed

### Performance Issues

If requests are slow:

1. Check security middleware overhead in logs
2. Disable expensive features for testing
3. Monitor memory usage of rate limit stores

## 🔧 Configuration Options

### Adjusting Rate Limits

```typescript
// In SecurityMiddleware.ts
const customConfig = {
  rateLimit: {
    windowMs: 15 * 60 * 1000, // Time window
    maxRequests: 300, // Per IP limit
    perSession: 200, // Per session limit
  },
};
```

### Adding Allowed Origins

```typescript
allowedOrigins: [
  'https://nest-haus.com',
  'https://www.nest-haus.com',
  'http://localhost:3000',
  'https://staging.nest-haus.com', // Add staging environment
],
```

### Customizing for Specific Routes

```typescript
// Higher limits for tracking endpoints
export const POST = SecurityMiddleware.withSecurity(handler, {
  rateLimit: { maxRequests: 1000, perSession: 500 },
  csrfProtection: false,
});

// Stricter limits for admin endpoints
export const POST = SecurityMiddleware.withSecurity(adminHandler, {
  rateLimit: { maxRequests: 50, perSession: 25 },
  csrfProtection: true,
});
```

## ✅ Security Checklist

Before deploying to production:

- [ ] Rate limits tested with realistic user behavior
- [ ] CSRF protection verified for all state-changing operations
- [ ] Input sanitization tested with XSS payloads
- [ ] Security headers present in all responses
- [ ] Admin routes have additional CSRF token protection
- [ ] Monitoring and alerting configured
- [ ] Performance impact measured and acceptable
- [ ] Error handling doesn't expose sensitive information

## 📝 Regular Maintenance

### Weekly Checks

- Review security logs for unusual patterns
- Monitor rate limit effectiveness
- Check for new security vulnerabilities

### Monthly Updates

- Update security dependencies
- Review and test security configurations
- Analyze attack patterns and adjust defenses

### Quarterly Audits

- Comprehensive penetration testing
- Security configuration review
- Performance impact assessment

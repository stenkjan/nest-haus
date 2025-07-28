/**
 * Security Testing Script
 *
 * Tests rate limiting, CSRF protection, and other security features
 * to ensure they work correctly without blocking normal user behavior.
 */

const BASE_URL = "http://localhost:3000";

async function testBasicSecurity() {
  console.log("🔒 Testing Basic Security Features...\n");

  try {
    // Test 1: Basic GET request (should pass)
    console.log("1. Testing basic GET request...");
    const getResponse = await fetch(`${BASE_URL}/api/test/security`);
    const getData = await getResponse.json();

    if (getData.success) {
      console.log("✅ GET request passed");
      console.log(
        `   Rate limits: ${getData.data.rateLimitInfo.maxRequestsPerIP} requests/IP, ${getData.data.rateLimitInfo.maxRequestsPerSession} requests/session`
      );
    } else {
      console.log("❌ GET request failed:", getData.error);
    }

    // Test 2: POST request with valid origin (should pass)
    console.log("\n2. Testing POST request with valid origin...");
    const postResponse = await fetch(`${BASE_URL}/api/test/security`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE_URL, // Valid origin for CSRF protection
        "x-session-id": "test-session-123",
      },
      body: JSON.stringify({
        testData: "Hello World",
        userInput: '<script>alert("test")</script>', // Test input sanitization
      }),
    });

    const postData = await postResponse.json();
    if (postData.success) {
      console.log("✅ POST request with valid origin passed");
      console.log(
        `   CSRF validation: ${postData.data.testResults.csrfValidation}`
      );
      console.log(
        `   Input sanitization: ${postData.data.testResults.inputSanitization}`
      );
    } else {
      console.log("❌ POST request failed:", postData.error);
    }

    // Test 3: POST request with invalid origin (should fail)
    console.log("\n3. Testing POST request with invalid origin...");
    const invalidPostResponse = await fetch(`${BASE_URL}/api/test/security`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://malicious-site.com", // Invalid origin
      },
      body: JSON.stringify({ testData: "Should be blocked" }),
    });

    if (invalidPostResponse.status === 403) {
      console.log(
        "✅ POST request with invalid origin correctly blocked (403)"
      );
    } else {
      console.log(
        "❌ POST request with invalid origin should have been blocked"
      );
    }
  } catch (error) {
    console.error("❌ Basic security test error:", error.message);
  }
}

async function testRateLimiting() {
  console.log("\n🔒 Testing Rate Limiting (User-Friendly Limits)...\n");

  try {
    const sessionId = `test-session-${Date.now()}`;
    const requestPromises = [];

    // Test normal user behavior: 20 requests in quick succession
    console.log("Testing normal browsing behavior (20 requests)...");

    for (let i = 1; i <= 20; i++) {
      requestPromises.push(
        fetch(`${BASE_URL}/api/test/security?count=${i}`, {
          headers: {
            "x-session-id": sessionId,
          },
        }).then((response) => ({
          request: i,
          status: response.status,
          success: response.ok,
        }))
      );
    }

    const results = await Promise.all(requestPromises);
    const successCount = results.filter((r) => r.success).length;
    const failedCount = results.filter((r) => !r.success).length;

    console.log(`✅ ${successCount}/20 requests succeeded`);
    if (failedCount > 0) {
      console.log(
        `⚠️  ${failedCount}/20 requests failed - checking if rate limit is too strict`
      );
      results
        .filter((r) => !r.success)
        .forEach((r) => {
          console.log(`   Request ${r.request}: Status ${r.status}`);
        });
    } else {
      console.log("✅ All requests passed - rate limits are user-friendly");
    }

    // Test configurator usage simulation: Multiple rapid requests
    console.log(
      "\nTesting configurator usage simulation (50 requests over 30 seconds)..."
    );

    let configuratorSuccess = 0;
    for (let i = 1; i <= 50; i++) {
      try {
        const response = await fetch(`${BASE_URL}/api/test/security`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Origin: BASE_URL,
            "x-session-id": sessionId,
          },
          body: JSON.stringify({ configuratorStep: i }),
        });

        if (response.ok) {
          configuratorSuccess++;
        }

        // Small delay to simulate user interaction
        await new Promise((resolve) => setTimeout(resolve, 600)); // 600ms delay = 100 requests/minute max
      } catch (error) {
        // Ignore network errors for this test
      }
    }

    console.log(`✅ ${configuratorSuccess}/50 configurator requests succeeded`);
    if (configuratorSuccess >= 45) {
      console.log("✅ Rate limits allow normal configurator usage");
    } else {
      console.log("⚠️  Rate limits may be too strict for configurator usage");
    }
  } catch (error) {
    console.error("❌ Rate limiting test error:", error.message);
  }
}

async function testSecurityHeaders() {
  console.log("\n🔒 Testing Security Headers...\n");

  try {
    const response = await fetch(`${BASE_URL}/api/test/security`);
    const headers = response.headers;

    const securityHeaders = {
      "X-Content-Type-Options": headers.get("X-Content-Type-Options"),
      "X-Frame-Options": headers.get("X-Frame-Options"),
      "X-XSS-Protection": headers.get("X-XSS-Protection"),
      "Referrer-Policy": headers.get("Referrer-Policy"),
      "Permissions-Policy": headers.get("Permissions-Policy"),
    };

    console.log("Security headers present:");
    Object.entries(securityHeaders).forEach(([name, value]) => {
      if (value) {
        console.log(`✅ ${name}: ${value}`);
      } else {
        console.log(`❌ ${name}: Missing`);
      }
    });
  } catch (error) {
    console.error("❌ Security headers test error:", error.message);
  }
}

async function runAllTests() {
  console.log("🚀 Starting Security Tests...\n");
  console.log("===============================================");

  await testBasicSecurity();
  await testRateLimiting();
  await testSecurityHeaders();

  console.log("\n===============================================");
  console.log("🏁 Security tests completed!");
  console.log("\nRate Limits Summary:");
  console.log("• 300 requests per 15 minutes per IP (20 req/min average)");
  console.log("• 200 requests per 15 minutes per session");
  console.log("• Allows normal browsing and configurator usage");
  console.log("• Blocks suspicious rapid-fire attacks");
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testBasicSecurity,
  testRateLimiting,
  testSecurityHeaders,
  runAllTests,
};

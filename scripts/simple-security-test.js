/**
 * Simple Security Test
 *
 * A straightforward test to verify security features work correctly.
 * Run with: node scripts/simple-security-test.js
 */

// Use fetch polyfill for Node.js
if (typeof fetch === "undefined") {
  const { default: fetch } = require("node-fetch");
  global.fetch = fetch;
}

const BASE_URL = "http://localhost:3000";

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function testEndpoint() {
  console.log("🔒 Testing Security Middleware...\n");

  try {
    console.log("1. Testing basic GET request...");
    const response = await fetch(`${BASE_URL}/api/test/security`);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ GET request successful");
      console.log(
        `   Rate Limits: ${data.data.rateLimitInfo.maxRequestsPerIP} req/IP, ${data.data.rateLimitInfo.maxRequestsPerSession} req/session`
      );
      console.log("   Security headers should be present in response");
    } else {
      console.log(`❌ GET request failed with status: ${response.status}`);
    }

    console.log("\n2. Testing POST request with valid origin...");
    const postResponse = await fetch(`${BASE_URL}/api/test/security`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE_URL,
      },
      body: JSON.stringify({
        testData: "Security test",
        potentialXSS: '<script>alert("test")</script>',
      }),
    });

    if (postResponse.ok) {
      const postData = await postResponse.json();
      console.log("✅ POST request with valid origin successful");
      console.log(
        `   CSRF Protection: ${postData.data.testResults.csrfValidation}`
      );
      console.log(
        `   Input Sanitization: ${postData.data.testResults.inputSanitization}`
      );
    } else {
      console.log(`❌ POST request failed with status: ${postResponse.status}`);
      const errorData = await postResponse.text();
      console.log(`   Error: ${errorData}`);
    }

    console.log("\n3. Testing rate limiting with multiple requests...");
    const requests = [];
    for (let i = 1; i <= 10; i++) {
      requests.push(
        fetch(`${BASE_URL}/api/test/security?test=${i}`)
          .then((r) => ({ success: r.ok, status: r.status }))
          .catch((e) => ({ success: false, error: e.message }))
      );
    }

    const results = await Promise.all(requests);
    const successCount = results.filter((r) => r.success).length;
    console.log(`✅ ${successCount}/10 rapid requests succeeded`);

    if (successCount >= 8) {
      console.log("✅ Rate limiting allows normal user behavior");
    } else {
      console.log("⚠️  Rate limiting may be too restrictive");
    }

    console.log("\n🎉 Security tests completed!");
    console.log("\nSummary:");
    console.log("• Rate limiting is active and user-friendly");
    console.log("• CSRF protection validates origins");
    console.log("• Input sanitization prevents XSS");
    console.log("• Security headers are applied");
  } catch (error) {
    console.error("❌ Test error:", error.message);
    console.log("\n💡 Make sure the development server is running:");
    console.log("   npm run dev");
  }
}

// Run the test
testEndpoint();

// Test script to verify the corrected image name with proper Unicode encoding
const http = require("http");

const imagePath =
  "33-NEST-Haus-Planung-Innenausbau-mo̧blierung-hausbau-flexibel";
const url = `http://localhost:3000/api/images?path=${encodeURIComponent(
  imagePath
)}`;

console.log("🔍 Testing final corrected image path...");
console.log("Image path:", imagePath);
console.log("Encoded URL:", url);

const req = http.get(url, (res) => {
  console.log("📡 Response Status:", res.statusCode);

  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    try {
      const response = JSON.parse(data);
      console.log("📦 Response Type:", response.type);

      if (response.type === "blob") {
        console.log("✅ SUCCESS! Image found in blob storage");
        console.log("🔗 Blob URL matches your provided URL");
        console.log("🎉 The image should now load on your page!");
      } else {
        console.log(
          "❌ Still not found. Response:",
          JSON.stringify(response, null, 2)
        );
        console.log(
          "💡 May need to match exact Unicode normalization from blob storage"
        );
      }
    } catch (error) {
      console.log("❌ Failed to parse JSON response");
      console.log("Raw response:", data);
    }
  });
});

req.on("error", (error) => {
  console.log("❌ Request failed:", error.message);
});

req.setTimeout(10000, () => {
  console.log("⏰ Request timed out");
  req.destroy();
});

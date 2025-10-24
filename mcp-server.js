#!/usr/bin/env node

/**
 * MCP WebSocket Server for Browser Widget
 * Handles Model Context Protocol connections on port 9009
 *
 * Usage: node mcp-server.js
 * Stop: Ctrl+C
 */

const WebSocket = require("ws");
const http = require("http");

// Create HTTP server
const server = http.createServer();

// Create WebSocket server
const wss = new WebSocket.Server({
  server,
  path: "/",
});

wss.on("connection", function connection(ws, req) {
  console.log(`🔗 MCP Widget connected from ${req.socket.remoteAddress}`);

  // Send welcome message
  ws.send(
    JSON.stringify({
      type: "connection",
      status: "connected",
      message: "MCP Server Ready",
      timestamp: new Date().toISOString(),
    })
  );

  // Handle incoming messages
  ws.on("message", function message(data) {
    try {
      const parsed = JSON.parse(data);
      console.log("📨 Received:", parsed);

      // Echo back with acknowledgment
      ws.send(
        JSON.stringify({
          type: "ack",
          original: parsed,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error("❌ Message parse error:", error);
    }
  });

  ws.on("close", function close() {
    console.log("🔌 MCP Widget disconnected");
  });

  ws.on("error", function error(err) {
    console.error("❌ WebSocket error:", err);
  });
});

// Start server
const PORT = 9009;
server.listen(PORT, "127.0.0.1", function () {
  console.log(`🚀 MCP Server running on ws://127.0.0.1:${PORT}/`);
  console.log("✅ Browser MCP widget can now connect");
  console.log("📝 Press Ctrl+C to stop");
});

server.on("error", function (error) {
  if (error.code === "EADDRINUSE") {
    console.log(`❌ Port ${PORT} is already in use`);
    console.log("💡 Try stopping other services or use a different port");
  } else {
    console.error("❌ Server error:", error);
  }
});

// Graceful shutdown
process.on("SIGINT", function () {
  console.log("\n🛑 Shutting down MCP server...");
  server.close(function () {
    console.log("✅ MCP server stopped");
    process.exit(0);
  });
});




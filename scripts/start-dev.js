/**
 * Cross-platform dev server starter with automatic IP detection
 */

const { spawn } = require('child_process');
const os = require('os');

function getLocalIPv4() {
  const interfaces = os.networkInterfaces();
  
  // Priority order: Ethernet, WiFi, then others
  const priorityOrder = ['Ethernet', 'Wi-Fi', 'WiFi', 'en0', 'eth0', 'wlan0'];
  
  // First, try priority interfaces
  for (const interfaceName of priorityOrder) {
    const networkInterface = interfaces[interfaceName];
    if (networkInterface) {
      for (const alias of networkInterface) {
        if (alias.family === 'IPv4' && !alias.internal) {
          return alias.address;
        }
      }
    }
  }
  
  // Fallback: find any non-internal IPv4 address
  for (const interfaceName of Object.keys(interfaces)) {
    const networkInterface = interfaces[interfaceName];
    for (const alias of networkInterface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  
  // Final fallback
  return 'localhost';
}

const localIP = getLocalIPv4();
console.log(`🚀 Starting Next.js dev server on ${localIP}:3000`);
console.log(`📱 Network access: http://${localIP}:3000`);
console.log(`🏠 Local access: http://localhost:3000`);

// Start Next.js dev server
const nextProcess = spawn('npx', ['next', 'dev', '--hostname', localIP], {
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down dev server...');
  nextProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  nextProcess.kill('SIGTERM');
  process.exit(0);
});

nextProcess.on('close', (code) => {
  console.log(`\n📊 Dev server exited with code ${code}`);
  process.exit(code);
});

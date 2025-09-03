/**
 * Get local IPv4 address automatically
 * Used for development server hosting
 */

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
console.log(localIP);

# Development Server Options

This project provides multiple ways to run the development server with different network configurations.

## Available Commands

### `npm run dev` (Recommended)

- **What it does**: Starts dev server on all network interfaces (0.0.0.0)
- **Access**:
  - ✅ `http://localhost:3000` (local access)
  - ✅ `http://127.0.0.1:3000` (local access)
  - ✅ `http://[your-ip]:3000` (network access from other devices)
- **Use case**: Default development with network access for testing on mobile devices

### `npm run dev:local`

- **What it does**: Starts dev server only on localhost
- **Access**:
  - ✅ `http://localhost:3000` (local access only)
  - ❌ No network access from other devices
- **Use case**: Local development only, more secure

### `npm run dev:network`

- **What it does**: Same as `npm run dev` (alias)
- **Use case**: Explicit network access

### `npm run dev:all`

- **What it does**: Direct Next.js command with 0.0.0.0 binding
- **Use case**: Bypass the custom script, direct Next.js execution

## How It Works

### Automatic IP Detection

The `scripts/start-dev.js` script automatically detects your current IPv4 address:

1. **Priority Order**:
   - Ethernet (wired connection)
   - Wi-Fi/WiFi (wireless connection)
   - Other network interfaces (en0, eth0, wlan0, etc.)
   - localhost (fallback)

2. **Network Binding**:
   - Uses `0.0.0.0` to bind to all interfaces
   - Allows access via localhost AND network IP
   - Works on Windows, macOS, and Linux

### Console Output

When you run `npm run dev`, you'll see:

```
🚀 Starting Next.js dev server on all interfaces
🏠 Local access: http://localhost:3000
📱 Network access: http://192.168.1.213:3000
🌐 All interfaces: http://0.0.0.0:3000
```

## Testing on Mobile Devices

1. Run `npm run dev`
2. Note the "Network access" URL from the console output
3. On your mobile device (connected to same WiFi), visit that URL
4. Your mobile device can now access the development server

## Troubleshooting

### "Address not available" error

- The script automatically detects available IPs
- Falls back to localhost if no network IP is found
- Use `npm run dev:local` as a fallback

### Firewall blocking network access

- Windows/Mac firewall might block incoming connections
- Allow Node.js through your firewall when prompted
- Or use `npm run dev:local` for localhost-only development

### Different network scenarios

- **Home WiFi**: Works automatically
- **Office network**: May be restricted by IT policies
- **Mobile hotspot**: Works automatically
- **No network**: Falls back to localhost automatically

/**
 * Analytics Filtering Utilities
 * 
 * Filters out specified IP addresses from analytics data
 * Used to exclude developer/admin sessions from tracking
 */

/**
 * Get list of IPs to exclude from analytics
 * Reads from environment variables:
 * - EXCLUDED_IPS: Comma-separated list of IPs
 * - DEV_IP: Single dev IP
 */
export function getExcludedIPs(): string[] {
  const excluded: string[] = [];
  
  // Get comma-separated excluded IPs
  const excludedIpsEnv = process.env.EXCLUDED_IPS || '';
  if (excludedIpsEnv) {
    const ips = excludedIpsEnv.split(',').map(ip => ip.trim()).filter(Boolean);
    excluded.push(...ips);
  }
  
  // Get single dev IP
  const devIp = process.env.DEV_IP;
  if (devIp) {
    excluded.push(devIp.trim());
  }
  
  return excluded;
}

/**
 * Check if an IP should be excluded from analytics
 */
export function shouldExcludeIP(ip: string | null | undefined): boolean {
  if (!ip) return false;
  
  const excludedIPs = getExcludedIPs();
  return excludedIPs.includes(ip);
}

/**
 * Get Prisma where clause to filter out excluded IPs
 * Use this in Prisma queries to exclude development sessions
 */
export function getIPFilterClause() {
  const excludedIPs = getExcludedIPs();
  
  if (excludedIPs.length === 0) {
    return {}; // No filtering needed
  }
  
  return {
    ipAddress: {
      notIn: excludedIPs
    }
  };
}

/**
 * Log current filter status (for debugging)
 */
export function logFilterStatus() {
  const excludedIPs = getExcludedIPs();
  
  if (excludedIPs.length > 0) {
    console.log(`🔍 Analytics Filter: Excluding ${excludedIPs.length} IP(s):`, excludedIPs);
  } else {
    console.log('🔍 Analytics Filter: No IPs excluded (set EXCLUDED_IPS or DEV_IP in .env.local)');
  }
}


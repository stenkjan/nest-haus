# Google Analytics 4 - Admin Panel Integration Guide

**Ziel:** GA4-Daten in Ihre bestehende Admin-Seite (user-tracking) integrieren  
**Datum:** 2025-11-20

---

## 📊 **Teil 1: Google Analytics Data API Integration**

### **Was Sie brauchen:**

```
✅ Google Cloud Project (haben Sie bereits)
✅ Google Analytics Data API aktivieren
✅ Service Account erstellen
✅ Analytics-Property Zugriff geben
✅ API-Credentials herunterladen
```

---

## 🔧 **Schritt 1: Google Analytics Data API aktivieren**

### **In Google Cloud Console:**

```
1. https://console.cloud.google.com
2. Wählen Sie Ihr Projekt (oder erstellen Sie eines)
3. APIs & Services → Library
4. Suchen: "Google Analytics Data API"
5. Klicken: "Enable"
6. Suchen: "Google Analytics Admin API"
7. Klicken: "Enable"
```

---

## 🔑 **Schritt 2: Service Account erstellen**

### **Service Account Setup:**

```
1. Google Cloud Console → IAM & Admin → Service Accounts
2. "Create Service Account"
3. Name: "nest-haus-analytics-reader"
4. Description: "Read-only access to GA4 data for admin panel"
5. Create

6. Grant Permissions:
   - Roles: "Viewer" (optional, für Cloud-Zugriff)
   - Klicken: Continue → Done

7. Keys:
   - Klicken auf den Service Account
   - Keys-Tab
   - Add Key → Create New Key
   - JSON Format
   - Download: "nest-haus-analytics-reader-xxx.json"
```

**⚠️ WICHTIG:** Diese JSON-Datei ist Ihr API-Key! Halten Sie sie geheim!

---

## 📊 **Schritt 3: Service Account zu Analytics hinzufügen**

### **In Google Analytics:**

```
1. https://analytics.google.com
2. Admin (unten links)
3. Property: "Nest-Haus Website"
4. Property Access Management
5. Klicken: "+" (Add Users)
6. Email: [SERVICE_ACCOUNT_EMAIL aus JSON]
   (z.B. nest-haus-analytics-reader@project-id.iam.gserviceaccount.com)
7. Role: "Viewer"
8. Klicken: "Add"
```

---

## 💾 **Schritt 4: Credentials in Ihr Projekt**

### **Option A: Als Environment Variable (Empfohlen für Vercel)**

```bash
# In Vercel Dashboard: Settings → Environment Variables

# Variable 1: Property ID
NEXT_PUBLIC_GA4_PROPERTY_ID=123456789

# Variable 2: Service Account Credentials (JSON als String)
GA4_SERVICE_ACCOUNT_KEY={
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "nest-haus-analytics-reader@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
}
```

### **Option B: Als lokale Datei (nur Development)**

```bash
# In /workspace/credentials/
# Fügen Sie zu .gitignore hinzu!

/credentials/
ga4-service-account.json
```

---

## 📦 **Schritt 5: NPM Packages installieren**

```bash
npm install @google-analytics/data googleapis
```

---

## 🛠️ **Schritt 6: API-Integration Code**

### **Datei: `/src/lib/ga4-client.ts`**

```typescript
import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Initialize GA4 Client
let analyticsDataClient: BetaAnalyticsDataClient | null = null;

function getGA4Client(): BetaAnalyticsDataClient {
  if (analyticsDataClient) return analyticsDataClient;

  // Parse service account from environment variable
  const serviceAccountKey = process.env.GA4_SERVICE_ACCOUNT_KEY;
  
  if (!serviceAccountKey) {
    throw new Error('GA4_SERVICE_ACCOUNT_KEY not found in environment variables');
  }

  const credentials = JSON.parse(serviceAccountKey);

  analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
    projectId: credentials.project_id,
  });

  return analyticsDataClient;
}

// Get Property ID from environment
function getPropertyId(): string {
  const propertyId = process.env.NEXT_PUBLIC_GA4_PROPERTY_ID;
  
  if (!propertyId) {
    throw new Error('NEXT_PUBLIC_GA4_PROPERTY_ID not found');
  }
  
  return `properties/${propertyId}`;
}

/**
 * Get realtime active users (last 30 minutes)
 */
export async function getRealtimeUsers() {
  try {
    const client = getGA4Client();
    const [response] = await client.runRealtimeReport({
      property: getPropertyId(),
      metrics: [
        { name: 'activeUsers' },
      ],
    });

    return {
      activeUsers: parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0'),
    };
  } catch (error) {
    console.error('Error fetching realtime users:', error);
    throw error;
  }
}

/**
 * Get page views for last 7 days
 */
export async function getPageViewsLast7Days() {
  try {
    const client = getGA4Client();
    const [response] = await client.runReport({
      property: getPropertyId(),
      dateRanges: [
        {
          startDate: '7daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        { name: 'date' },
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'sessions' },
        { name: 'totalUsers' },
      ],
    });

    return response.rows?.map(row => ({
      date: row.dimensionValues?.[0]?.value || '',
      pageViews: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
      users: parseInt(row.metricValues?.[2]?.value || '0'),
    })) || [];
  } catch (error) {
    console.error('Error fetching page views:', error);
    throw error;
  }
}

/**
 * Get top pages by views
 */
export async function getTopPages(limit = 10) {
  try {
    const client = getGA4Client();
    const [response] = await client.runReport({
      property: getPropertyId(),
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        { name: 'pagePath' },
        { name: 'pageTitle' },
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
      ],
      orderBys: [
        {
          metric: {
            metricName: 'screenPageViews',
          },
          desc: true,
        },
      ],
      limit,
    });

    return response.rows?.map(row => ({
      path: row.dimensionValues?.[0]?.value || '',
      title: row.dimensionValues?.[1]?.value || '',
      views: parseInt(row.metricValues?.[0]?.value || '0'),
      avgDuration: parseFloat(row.metricValues?.[1]?.value || '0'),
    })) || [];
  } catch (error) {
    console.error('Error fetching top pages:', error);
    throw error;
  }
}

/**
 * Get traffic sources
 */
export async function getTrafficSources() {
  try {
    const client = getGA4Client();
    const [response] = await client.runReport({
      property: getPropertyId(),
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        { name: 'sessionSource' },
        { name: 'sessionMedium' },
      ],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
      ],
      orderBys: [
        {
          metric: {
            metricName: 'sessions',
          },
          desc: true,
        },
      ],
    });

    return response.rows?.map(row => ({
      source: row.dimensionValues?.[0]?.value || '',
      medium: row.dimensionValues?.[1]?.value || '',
      sessions: parseInt(row.metricValues?.[0]?.value || '0'),
      users: parseInt(row.metricValues?.[1]?.value || '0'),
    })) || [];
  } catch (error) {
    console.error('Error fetching traffic sources:', error);
    throw error;
  }
}

/**
 * Get user demographics (age, gender)
 */
export async function getUserDemographics() {
  try {
    const client = getGA4Client();
    
    // Age
    const [ageResponse] = await client.runReport({
      property: getPropertyId(),
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        { name: 'userAgeBracket' },
      ],
      metrics: [
        { name: 'totalUsers' },
      ],
    });

    // Gender
    const [genderResponse] = await client.runReport({
      property: getPropertyId(),
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        { name: 'userGender' },
      ],
      metrics: [
        { name: 'totalUsers' },
      ],
    });

    return {
      age: ageResponse.rows?.map(row => ({
        bracket: row.dimensionValues?.[0]?.value || '',
        users: parseInt(row.metricValues?.[0]?.value || '0'),
      })) || [],
      gender: genderResponse.rows?.map(row => ({
        gender: row.dimensionValues?.[0]?.value || '',
        users: parseInt(row.metricValues?.[0]?.value || '0'),
      })) || [],
    };
  } catch (error) {
    console.error('Error fetching demographics:', error);
    throw error;
  }
}

/**
 * Get user locations (country, city)
 */
export async function getUserLocations() {
  try {
    const client = getGA4Client();
    const [response] = await client.runReport({
      property: getPropertyId(),
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        { name: 'country' },
        { name: 'city' },
      ],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
      ],
      orderBys: [
        {
          metric: {
            metricName: 'totalUsers',
          },
          desc: true,
        },
      ],
      limit: 50,
    });

    return response.rows?.map(row => ({
      country: row.dimensionValues?.[0]?.value || '',
      city: row.dimensionValues?.[1]?.value || '',
      users: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
    })) || [];
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
}
```

---

## 🌐 **Schritt 7: API-Route erstellen**

### **Datei: `/src/app/api/admin/ga4-data/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { 
  getRealtimeUsers, 
  getPageViewsLast7Days, 
  getTopPages,
  getTrafficSources,
  getUserDemographics,
  getUserLocations
} from '@/lib/ga4-client';

// Admin authentication check
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  
  const token = authHeader.replace('Bearer ', '');
  // TODO: Implement your admin auth check
  return token === process.env.ADMIN_API_KEY;
}

export async function GET(request: NextRequest) {
  // Check authorization
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const dataType = searchParams.get('type') || 'overview';

  try {
    switch (dataType) {
      case 'realtime':
        const realtimeData = await getRealtimeUsers();
        return NextResponse.json(realtimeData);

      case 'pageviews':
        const pageViewsData = await getPageViewsLast7Days();
        return NextResponse.json(pageViewsData);

      case 'toppages':
        const topPagesData = await getTopPages();
        return NextResponse.json(topPagesData);

      case 'traffic':
        const trafficData = await getTrafficSources();
        return NextResponse.json(trafficData);

      case 'demographics':
        const demographicsData = await getUserDemographics();
        return NextResponse.json(demographicsData);

      case 'locations':
        const locationsData = await getUserLocations();
        return NextResponse.json(locationsData);

      case 'overview':
      default:
        // Get all data for overview
        const [realtime, pageViews, topPages, traffic] = await Promise.all([
          getRealtimeUsers(),
          getPageViewsLast7Days(),
          getTopPages(5),
          getTrafficSources(),
        ]);

        return NextResponse.json({
          realtime,
          pageViews,
          topPages,
          traffic,
        });
    }
  } catch (error) {
    console.error('GA4 API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GA4 data' },
      { status: 500 }
    );
  }
}
```

---

## 🎨 **Schritt 8: Admin Panel Integration**

### **Beispiel: GA4-Widget in Ihrer Admin-Seite**

```typescript
// In Ihrer Admin-Seite (z.B. /src/app/admin/user-tracking/page.tsx)

'use client';

import { useEffect, useState } from 'react';

interface GA4Data {
  realtime: { activeUsers: number };
  pageViews: Array<{ date: string; pageViews: number; sessions: number; users: number }>;
  topPages: Array<{ path: string; title: string; views: number }>;
  traffic: Array<{ source: string; medium: string; sessions: number; users: number }>;
}

export default function AdminUserTracking() {
  const [ga4Data, setGa4Data] = useState<GA4Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGA4Data() {
      try {
        const response = await fetch('/api/admin/ga4-data?type=overview', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setGa4Data(data);
        }
      } catch (error) {
        console.error('Failed to fetch GA4 data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGA4Data();
    // Refresh every 5 minutes
    const interval = setInterval(fetchGA4Data, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Lade Google Analytics Daten...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Tracking</h1>

      {/* Realtime Users */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Aktive User (Jetzt)</h2>
        <p className="text-4xl font-bold text-green-600">
          {ga4Data?.realtime.activeUsers || 0}
        </p>
      </div>

      {/* Top Pages */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Top Seiten (30 Tage)</h2>
        <div className="space-y-2">
          {ga4Data?.topPages.map((page, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm">{page.path}</span>
              <span className="font-semibold">{page.views} Views</span>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Traffic-Quellen</h2>
        <div className="space-y-2">
          {ga4Data?.traffic.map((source, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm">{source.source} / {source.medium}</span>
              <span className="font-semibold">{source.sessions} Sessions</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart für Page Views (Optional mit Chart.js) */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Page Views (7 Tage)</h2>
        {/* Hier können Sie Chart.js oder Recharts einbauen */}
      </div>
    </div>
  );
}
```

---

## 📊 **Verfügbare Dimensionen & Metriken**

### **User Dimensionen:**
```
- country, city, region
- userAgeBracket, userGender
- language, deviceCategory
- browser, operatingSystem
```

### **Traffic Dimensionen:**
```
- sessionSource, sessionMedium, sessionCampaignName
- firstUserSource, firstUserMedium
- pagePath, pageTitle, landingPage
```

### **Metriken:**
```
- activeUsers, totalUsers, newUsers
- sessions, sessionsPerUser
- screenPageViews, screenPageViewsPerSession
- averageSessionDuration, bounceRate
- conversions, purchaseRevenue
```

**Alle verfügbar:** https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema

---

## 🔄 **Zusammenfassung Setup:**

```
✅ Step 1: Google Analytics Data API aktivieren
✅ Step 2: Service Account erstellen
✅ Step 3: Service Account zu GA4 hinzufügen
✅ Step 4: Credentials in Environment Variables
✅ Step 5: NPM Packages installieren
✅ Step 6: GA4-Client Code schreiben
✅ Step 7: API-Route erstellen
✅ Step 8: In Admin-Panel einbauen
```

---

**Nächster Teil: IP-Filter Setup! →**

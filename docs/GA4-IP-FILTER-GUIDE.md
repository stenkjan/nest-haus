# Google Analytics 4 - IP-Filter & Internal Traffic Ausschluss

**Ziel:** Ihre eigenen IPs und Ihre Organisation aus GA4-Daten ausschließen  
**Datum:** 2025-11-20

---

## 🚫 **Problem: Keine direkten IP-Filter in GA4**

### **Wichtiger Unterschied zu Universal Analytics:**

```
❌ Universal Analytics (alt): IP-Filter in Admin
✅ Google Analytics 4 (neu): "Internal Traffic" Filter mit Data Streams
```

**GA4 hat KEINE direkten IP-Filter mehr!**  
Stattdessen nutzen wir **Data Filters** basierend auf "traffic_type" Parameter.

---

## 🎯 **3 Lösungen für IP-Ausschluss**

### **Option 1: Data Stream Internal Traffic Filter** ⭐ **EMPFOHLEN**
```
✅ Offizieller Google-Weg
✅ Filtert auf Server-Seite
✅ Einfach zu konfigurieren
✅ Keine Code-Änderungen nötig
```

### **Option 2: Custom gtag.js Logic**
```
✅ Flexibel
✅ Client-seitig
⚠️ Erfordert Code-Änderungen
⚠️ Kann umgangen werden (DevTools)
```

### **Option 3: Next.js Middleware Filter**
```
✅ Server-seitig
✅ Sehr zuverlässig
⚠️ Komplexer zu implementieren
```

---

## ⭐ **Lösung 1: Data Stream Internal Traffic Filter (EMPFOHLEN)**

### **Schritt 1: Internal Traffic Definition erstellen**

```
1. Gehen Sie zu: https://analytics.google.com
2. Admin → Data Streams
3. Klicken Sie Ihren Stream: "Nest-Haus Website"
4. Scrollen Sie zu: "Configure tag settings"
5. Klicken: "Show more"
6. Klicken: "Define internal traffic"
7. Klicken: "Create"
```

### **Schritt 2: Traffic-Regel konfigurieren**

```
Rule name: NEST-Haus Team & Office
IP address matches: [Wählen Sie basierend auf Ihrem Setup]

Optionen:
- "IP address equals" → Für eine spezifische IP
- "IP address starts with" → Für IP-Range (z.B. 192.168.)
- "IP address contains" → Für Teilmatch
- "IP address ends with" → Für Suffix-Match
- "IP address in range" → Für CIDR-Range
```

### **Schritt 3: Ihre IPs hinzufügen**

#### **Ihre aktuelle öffentliche IP finden:**

```bash
# In Terminal (oder https://whatismyipaddress.com)
curl ifconfig.me
# Beispiel Output: 178.115.xxx.xxx
```

#### **IP-Regel Beispiele:**

**Einzelne IP (Home Office):**
```
Condition: IP address equals
Value: 178.115.123.45
```

**IP-Range (Office-Netzwerk):**
```
Condition: IP address in range
Value: 192.168.1.0/24
```

**Mehrere einzelne IPs:**
```
Erstellen Sie mehrere Regeln:
- Rule 1: IP equals 178.115.123.45 (Ihr Home)
- Rule 2: IP equals 194.25.10.50 (Office)
- Rule 3: IP equals 185.100.20.30 (Team Member)
```

### **Schritt 4: Data Filter aktivieren**

```
1. Admin → Data Settings → Data Filters
2. Sie sehen: "Internal Traffic" (standardmäßig "Testing" Status)
3. Klicken Sie auf "Internal Traffic"
4. Filter state: Ändern von "Testing" zu "Active"
5. Save
```

**⚠️ WICHTIG:**
- **Testing**: Daten werden getaggt, aber NICHT gefiltert (Sie sehen sie noch)
- **Active**: Daten werden KOMPLETT ausgefiltert (nicht in Reports sichtbar)

### **Schritt 5: Verifizierung**

```
1. Öffnen Sie: https://nest-haus.at
2. Admin → DebugView (in Analytics)
3. Sie sollten sehen: traffic_type = "internal"
4. Warten Sie 24 Stunden
5. Reports sollten Ihre internen Besuche NICHT mehr zählen
```

---

## 🔧 **Lösung 2: Custom gtag.js Logic (Backup-Methode)**

### **Wenn Sie mehr Kontrolle wollen:**

**Datei: `/src/app/layout.tsx`**

```typescript
<script
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      
      // Check if internal IP/domain
      function isInternalTraffic() {
        // Option 1: Check hostname (für lokale Tests)
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1') {
          return true;
        }
        
        // Option 2: Check localStorage flag (manuell gesetzt)
        if (localStorage.getItem('nest_internal_user') === 'true') {
          return true;
        }
        
        // Option 3: Check Cookie
        if (document.cookie.includes('nest_internal=true')) {
          return true;
        }
        
        return false;
      }
      
      // Set consent defaults
      gtag('consent', 'default', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied',
        'functionality_storage': 'granted',
        'personalization_storage': 'denied',
        'security_storage': 'granted',
        'wait_for_update': 500
      });
      
      gtag('js', new Date());
      
      // Configure GA4 with internal traffic tag
      if (isInternalTraffic()) {
        gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
          'traffic_type': 'internal'
        });
      } else {
        gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
      }
    `,
  }}
/>
```

### **Internes Flag manuell setzen (für Team):**

```javascript
// In Browser-Console (F12) ausführen:
localStorage.setItem('nest_internal_user', 'true');

// Oder Cookie setzen:
document.cookie = "nest_internal=true; path=/; max-age=31536000";
```

---

## 🛡️ **Lösung 3: Next.js Middleware (Fortgeschritten)**

### **Server-seitiger IP-Check**

**Datei: `/src/middleware.ts` (erweitern)**

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Liste Ihrer internen IPs
const INTERNAL_IPS = [
  '178.115.123.45', // Ihr Home Office
  '194.25.10.50',   // Office
  '185.100.20.30',  // Team Member
];

// IP-Ranges (CIDR)
const INTERNAL_IP_RANGES = [
  '192.168.1.', // Office-Netzwerk (Prefix)
  '10.0.0.',    // VPN-Range
];

function isInternalIP(ip: string | null): boolean {
  if (!ip) return false;
  
  // Exakte IP-Match
  if (INTERNAL_IPS.includes(ip)) {
    return true;
  }
  
  // Range-Match (Prefix)
  for (const range of INTERNAL_IP_RANGES) {
    if (ip.startsWith(range)) {
      return true;
    }
  }
  
  return false;
}

export function middleware(request: NextRequest) {
  // Get real IP (behind Vercel proxy)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] 
    || request.headers.get('x-real-ip')
    || request.ip;

  // Check if internal
  if (isInternalIP(ip)) {
    // Set cookie to identify internal user
    const response = NextResponse.next();
    response.cookies.set('nest_internal', 'true', {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
      httpOnly: false, // Needs to be readable by client-side gtag
    });
    return response;
  }

  return NextResponse.next();
}

// Apply to all routes
export const config = {
  matcher: '/:path*',
};
```

### **Dann in layout.tsx:**

```typescript
<script
  dangerouslySetInnerHTML={{
    __html: `
      // ... consent defaults ...
      
      // Check cookie set by middleware
      const isInternal = document.cookie.includes('nest_internal=true');
      
      gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', 
        isInternal ? { 'traffic_type': 'internal' } : {}
      );
    `,
  }}
/>
```

---

## 🔍 **Wie finde ich die IPs meines Teams?**

### **Option 1: Team-Mitglieder selbst checken**

```
Senden Sie Ihrem Team:
1. Öffne: https://whatismyipaddress.com
2. Kopiere die "IPv4 Address"
3. Sende mir die IP
```

### **Option 2: Logs checken (wenn Sie Server-Logs haben)**

```bash
# In Vercel Deployment Logs:
1. Vercel Dashboard → Logs
2. Filter nach Ihren Team-Zugriffen
3. Schauen Sie x-forwarded-for Header
```

### **Option 3: Temporärer Test-Endpoint**

**Datei: `/src/app/api/test/my-ip/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] 
    || request.headers.get('x-real-ip')
    || request.ip;

  return NextResponse.json({
    ip,
    headers: {
      'x-forwarded-for': request.headers.get('x-forwarded-for'),
      'x-real-ip': request.headers.get('x-real-ip'),
    },
  });
}
```

**Team-Mitglieder gehen auf:**
```
https://nest-haus.at/api/test/my-ip
```

**Output:**
```json
{
  "ip": "178.115.123.45",
  "headers": {
    "x-forwarded-for": "178.115.123.45, 1.2.3.4",
    "x-real-ip": "178.115.123.45"
  }
}
```

---

## ✅ **Empfohlener Workflow:**

### **Phase 1: Setup (Jetzt)**

```
1. ✅ Lösung 1: Data Stream Internal Traffic Filter
2. ✅ Fügen Sie Ihre aktuelle IP hinzu
3. ✅ Status: "Testing" (zum Testen)
4. ✅ Verifizieren in DebugView (traffic_type: internal)
```

### **Phase 2: Team-IPs sammeln (Diese Woche)**

```
1. ✅ Erstellen Sie /api/test/my-ip Endpoint
2. ✅ Team-Mitglieder rufen Endpoint auf
3. ✅ Sammeln Sie alle IPs
4. ✅ Fügen Sie IPs in Internal Traffic Rules hinzu
```

### **Phase 3: Aktivieren (Nach 2-3 Tagen Testing)**

```
1. ✅ Data Filter: Status von "Testing" → "Active"
2. ✅ Warten Sie 24 Stunden
3. ✅ Verifizieren: Reports zeigen keine internen Besuche mehr
```

---

## 📊 **Verifizierung: Funktioniert der Filter?**

### **Test 1: DebugView**

```
1. Analytics → Admin → DebugView
2. Öffnen Sie nest-haus.at von Ihrer IP
3. DebugView sollte zeigen:
   - Event: page_view
   - Parameter: traffic_type = "internal"
```

### **Test 2: Realtime Report**

```
1. Analytics → Reports → Realtime
2. Mit "Testing" Status:
   ✅ Sie sehen sich selbst (aber mit internal tag)
3. Mit "Active" Status:
   ❌ Sie sehen sich selbst NICHT mehr
```

### **Test 3: Vergleich nach 7 Tagen**

```
Vorher (ohne Filter):
- 100 Sessions
- 80 davon waren Sie

Nachher (mit Filter):
- 20 Sessions
- Nur echte Kunden
```

---

## 🎯 **Zusammenfassung:**

### **Für sofortige Implementierung:**

```typescript
// SCHRITT 1: Analytics Admin
1. Data Streams → Configure tag settings
2. Define internal traffic
3. Ihre IP hinzufügen: [Ihre öffentliche IP]
4. Data Filters → Internal Traffic → Status: Testing

// SCHRITT 2: Nach 2 Tagen Testing
1. Data Filters → Internal Traffic → Status: Active
2. Fertig! ✅
```

### **KEINE Code-Änderungen nötig für Lösung 1!**

Nur Analytics-Konfiguration! 🎉

---

## 🔗 **Weiterführende Links:**

- [Google: Internal Traffic Filter](https://support.google.com/analytics/answer/10108813)
- [Google: Data Filters](https://support.google.com/analytics/answer/10108024)
- [GA4: traffic_type Parameter](https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference?client_type=gtag#reserved_parameters)

---

**Möchten Sie, dass ich Ihnen helfe, die IPs zu konfigurieren?** 🚀

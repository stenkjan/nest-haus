# Google Analytics 4 - Vollständige Einrichtungsanleitung
## Für nest-haus.at | Von Kontoerstellung bis Datenerhebung

**Erstellt:** 2025-11-20  
**Website:** nest-haus.at  
**Typ:** Modulhaus-Konfigurator mit E-Commerce  
**Ziel:** Vollständige GA4-Integration mit Event-Tracking

---

## 📋 Inhaltsverzeichnis

1. [Vorbereitung & Voraussetzungen](#1-vorbereitung--voraussetzungen)
2. [Google-Konto & Analytics-Konto erstellen](#2-google-konto--analytics-konto-erstellen)
3. [Property einrichten](#3-property-einrichten)
4. [Datenstream konfigurieren](#4-datenstream-konfigurieren)
5. [Tracking-Code in Next.js einbauen](#5-tracking-code-in-nextjs-einbauen)
6. [Cookie-Consent integrieren](#6-cookie-consent-integrieren)
7. [E-Commerce-Tracking einrichten](#7-e-commerce-tracking-einrichten)
8. [Custom Events für Konfigurator](#8-custom-events-für-konfigurator)
9. [Conversion-Ziele definieren](#9-conversion-ziele-definieren)
10. [Testen & Verifizieren](#10-testen--verifizieren)
11. [Dashboard & Reports einrichten](#11-dashboard--reports-einrichten)
12. [Datenschutz & GDPR-Compliance](#12-datenschutz--gdpr-compliance)

---

## 1. Vorbereitung & Voraussetzungen

### Was Sie brauchen:

```
✅ Google-Konto (mit @nest-haus.at oder persönlich)
✅ Admin-Zugriff auf nest-haus.at Website
✅ Zugriff auf nest-haus.at DNS (für Verifizierung)
✅ Zeit: 2-3 Stunden für komplette Einrichtung
```

### Wichtige Informationen bereithalten:

```
Website-URL:        https://nest-haus.at
Unternehmensname:   Nest-Haus (oder Ihr offizieller Name)
Branche:            Bau/Immobilien/Modulhäuser
Land:               Österreich
Zeitzone:           Europe/Vienna
Währung:            EUR (Euro)
Firmensitz:         [Ihre Adresse]
```

### Welche Analytics-Daten wollen Sie sammeln?

```
✅ Seitenaufrufe & Navigation
✅ Konfigurator-Nutzung (Auswahl von Optionen)
✅ "In den Warenkorb"-Klicks
✅ Kontaktformular-Anfragen
✅ Konzept-Check-Käufe (E-Commerce)
✅ Traffic-Quellen (Google, Direct, Social Media)
✅ User-Verhalten (Zeit auf Seite, Scrolltiefe)
✅ Conversions (Leads & Verkäufe)
```

---

## 2. Google-Konto & Analytics-Konto erstellen

### Schritt 2.1: Google-Konto (falls noch nicht vorhanden)

**Option A: Mit Ihrer @nest-haus.at Email (EMPFOHLEN)**
```
1. Gehen Sie zu: accounts.google.com
2. Falls noch kein Google-Konto mit nest-haus.at:
   → "Konto erstellen" → "Für mein Unternehmen"
   → Email: ihr-name@nest-haus.at
   → Passwort festlegen
   → Bestätigen

Vorteil: Professionell, alle Team-Mitglieder können Zugriff bekommen
```

**Option B: Mit persönlichem Google-Konto**
```
Nutzen Sie Ihr bestehendes Gmail-Konto
(Können später weitere Nutzer hinzufügen)
```

### Schritt 2.2: Analytics-Konto erstellen (15 Minuten)

```
1. Gehen Sie zu: https://analytics.google.com

2. Klicken Sie auf: "Messung starten" (oder "Start measuring")

3. Konto-Name eingeben:
   ┌─────────────────────────────────────┐
   │ Kontoname: Nest-Haus                │ ← Ihr Unternehmensname
   └─────────────────────────────────────┘

4. Datenfreigabe-Einstellungen (alle empfohlen):
   ☑ Google-Produkte und -Dienste
   ☑ Benchmarking
   ☑ Technischer Support
   ☑ Kontospezialisten

5. Klicken Sie: "Weiter"
```

**✅ Checkpoint 2.2:** Sie haben jetzt ein Analytics-Konto namens "Nest-Haus"

---

## 3. Property einrichten

### Was ist eine Property?

```
Property = Ihre Website oder App
Ein Analytics-Konto kann mehrere Properties haben (z.B. Website + Mobile App)
```

### Schritt 3.1: Property-Einstellungen (10 Minuten)

```
1. Property-Name eingeben:
   ┌─────────────────────────────────────┐
   │ Property-Name: Nest-Haus Website    │ ← Beschreibender Name
   └─────────────────────────────────────┘

2. Zeitzone auswählen:
   ┌─────────────────────────────────────┐
   │ Berichtzeitzone: (GMT+01:00)        │
   │ Europe/Vienna                       │ ← Österreich
   └─────────────────────────────────────┘

3. Währung auswählen:
   ┌─────────────────────────────────────┐
   │ Währung: EUR - Euro (€)             │ ← Für E-Commerce wichtig!
   └─────────────────────────────────────┘

4. Klicken Sie: "Weiter"
```

### Schritt 3.2: Unternehmensdetails (5 Minuten)

```
1. Branche auswählen:
   ┌─────────────────────────────────────┐
   │ Branche:                            │
   │ ⦿ Immobilien                        │ ← Wählen Sie die passendste
   │   (oder "Bau & Handwerk")           │
   └─────────────────────────────────────┘

2. Unternehmensgröße:
   ┌─────────────────────────────────────┐
   │ ⦿ Klein (1-10 Mitarbeiter)          │ ← Je nach Größe
   │   Mittel (11-100)                   │
   │   Groß (>100)                       │
   └─────────────────────────────────────┘

3. Klicken Sie: "Weiter"
```

### Schritt 3.3: Geschäftsziele (5 Minuten)

**Wählen Sie alle relevanten Ziele:**

```
☑ Basisberichte abrufen (immer wählen)
☑ Onlineumsätze steigern (für Konzept-Check-Käufe)
☑ Leads generieren (für Kontaktformular)
☐ Markenbekanntheit erhöhen (optional)
☐ Nutzerinteraktion prüfen (optional, aber nützlich)
```

**Empfehlung für nest-haus.at:**
```
☑ Basisberichte abrufen
☑ Onlineumsätze steigern     ← Konzept-Check (Stripe-Zahlungen)
☑ Leads generieren           ← Kontaktformular, Grundstücks-Check
☑ Nutzerinteraktion prüfen   ← Konfigurator-Nutzung
```

Klicken Sie: "Erstellen"

### Schritt 3.4: Nutzungsbedingungen akzeptieren

```
1. Wählen Sie: "Österreich" als Land
2. Lesen Sie die Google Analytics-Nutzungsbedingungen
3. ☑ Ich akzeptiere die Nutzungsbedingungen
4. ☑ Datenschutzhinweise für die Datenverarbeitung (DSGVO)
5. Klicken Sie: "Ich stimme zu"
```

**✅ Checkpoint 3:** Property "Nest-Haus Website" wurde erstellt!

---

## 4. Datenstream konfigurieren

### Was ist ein Datenstream?

```
Datenstream = Die Verbindung zwischen Ihrer Website und Google Analytics
Hier bekommen Sie Ihren Tracking-Code (Measurement ID)
```

### Schritt 4.1: Datenstream erstellen (5 Minuten)

```
Sie sollten jetzt auf der Seite "Datenerfassung" sein.
Falls nicht: Admin → Datenstreams

1. Klicken Sie: "Datenstream hinzufügen"

2. Wählen Sie: "Web" (nicht iOS oder Android)

3. Website-Informationen eingeben:
   ┌─────────────────────────────────────┐
   │ Website-URL:                        │
   │ https://nest-haus.at                │ ← WICHTIG: https:// mit!
   └─────────────────────────────────────┘
   
   ┌─────────────────────────────────────┐
   │ Stream-Name:                        │
   │ Nest-Haus Website                   │ ← Beschreibender Name
   └─────────────────────────────────────┘

4. Klicken Sie: "Stream erstellen"
```

### Schritt 4.2: Measurement ID kopieren (WICHTIG!)

```
Sie sehen jetzt Ihre Stream-Details:

┌─────────────────────────────────────────────┐
│ Messdaten-ID (Measurement ID):              │
│                                              │
│ G-XXXXXXXXXX                                 │ ← KOPIEREN SIE DIESE!
│                                              │
│ [📋 Kopieren]                                │
└─────────────────────────────────────────────┘

⚠️ WICHTIG: Speichern Sie diese ID!
Sie werden sie gleich für die Integration brauchen.

Beispiel: G-9BCDEFGH12
```

### Schritt 4.3: Erweiterte Einstellungen (EMPFOHLEN)

**Scrollen Sie nach unten zu "Erweiterte Einstellungen":**

#### Enhanced Measurement (Erweiterte Messung)

```
Aktivieren Sie diese Optionen:

☑ Seitenaufrufe            ← Standardmäßig aktiviert
☑ Scrolls                  ← Erfasst 90% Scroll-Tiefe
☑ Ausgehende Klicks        ← Links zu anderen Websites
☑ Sitesuche                ← Falls Sie eine Suche haben
☑ Videoengagement          ← YouTube-Videos auf Ihrer Seite
☑ Dateidownloads           ← PDF-Downloads etc.

✅ Alle sollten aktiviert sein (Standardeinstellung)
```

**Warum wichtig?**
Diese Events werden automatisch getrackt, ohne dass Sie Code schreiben müssen!

**✅ Checkpoint 4:** Datenstream erstellt, Measurement ID: `G-XXXXXXXXXX`

---

## 5. Tracking-Code in Next.js einbauen

### Übersicht: Integration mit @next/third-parties

```
Google empfiehlt für Next.js: @next/third-parties
Vorteile:
✅ Optimiert für Performance
✅ Lädt Analytics asynchron (blockiert nicht)
✅ Einfache Integration
✅ Von Next.js offiziell supported
```

### Schritt 5.1: Package installieren (2 Minuten)

```bash
# Im Terminal/PowerShell:
cd /workspace

# Package installieren:
npm install @next/third-parties

# Warten bis Installation abgeschlossen (30-60 Sekunden)
```

### Schritt 5.2: Umgebungsvariable hinzufügen (3 Minuten)

**Datei: `.env.local` (oder erstellen, falls nicht vorhanden)**

```bash
# Google Analytics 4 Configuration
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

⚠️ **WICHTIG:** Ersetzen Sie `G-XXXXXXXXXX` mit Ihrer echten Measurement ID aus Schritt 4.2!

**Beispiel:**
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-9BCDEFGH12
```

**Warum `NEXT_PUBLIC_`?**
- Macht die Variable im Browser verfügbar
- Notwendig für client-side Analytics
- Kein Sicherheitsrisiko (Measurement ID ist öffentlich)

### Schritt 5.3: Layout.tsx anpassen (10 Minuten)

**Datei: `/workspace/src/app/layout.tsx`**

**Schritt A: Import hinzufügen (oben in der Datei)**

```tsx
// VORHER (Zeile 1-18):
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// ... andere Imports ...

// NEU: Fügen Sie diese Zeile hinzu:
import { GoogleAnalytics } from '@next/third-parties/google'
```

**Schritt B: GoogleAnalytics-Komponente einfügen**

Suchen Sie diese Zeile in Ihrer `layout.tsx`:

```tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
```

**Fügen Sie direkt NACH `<html lang="de">` ein:**

```tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      {/* Google Analytics 4 - Optimized for Next.js */}
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
      
      <head>
        {/* ... existing head content ... */}
      </head>
      <body className={`${inter.className} antialiased bg-white min-h-screen flex flex-col`}>
        {/* ... rest of your layout ... */}
      </body>
    </html>
  );
}
```

**Vollständiges Beispiel:**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { GoogleAnalytics } from '@next/third-parties/google' // NEU

// ... andere Imports ...

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // ... existing metadata ...
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      {/* NEU: Google Analytics 4 */}
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
      
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* ... other schemas ... */}
      </head>
      <body className={`${inter.className} antialiased bg-white min-h-screen flex flex-col`}>
        <CookieConsentProvider>
          <SecurityProvider {...config} />
          <Navbar />
          <main className="flex-1">{children}</main>

          {/* Global Components */}
          <CookieBanner />
          <CookieSettingsHandler />
          <AlphaTestProvider />
          <AlphaSessionTracker />
          <SessionInteractionTracker />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
```

### Schritt 5.4: Build & Test (5 Minuten)

```bash
# 1. Stoppen Sie den Dev-Server (falls läuft)
# Strg+C im Terminal

# 2. Cache löschen (sicher ist sicher)
rm -rf .next

# 3. Dependencies neu installieren (falls nötig)
npm install

# 4. Dev-Server neu starten
npm run dev

# 5. Browser öffnen:
# http://localhost:3000

# 6. Browser-Konsole öffnen (F12)
# Schauen Sie nach Fehlern
```

**Was Sie sehen sollten:**
```
✅ Keine Fehler in der Konsole
✅ Im Network-Tab: Requests an google-analytics.com oder googletagmanager.com
✅ Website lädt normal
```

**✅ Checkpoint 5:** Google Analytics Code ist eingebaut!

---

## 6. Cookie-Consent integrieren

### Warum wichtig?

```
DSGVO (GDPR) in EU/Österreich:
❌ Analytics OHNE Einwilligung = Illegal
✅ Analytics MIT Einwilligung = Legal

Sie haben bereits ein Cookie-Banner!
Wir müssen nur Google Analytics hinzufügen.
```

### Schritt 6.1: Cookie-Consent-Context erweitern (10 Minuten)

**Datei: `/workspace/src/contexts/CookieConsentContext.tsx`**

Suchen Sie die `cookiePreferences` State-Definition:

```tsx
// VORHER:
const [cookiePreferences, setCookiePreferences] = useState({
  necessary: true,
  analytics: false,
  marketing: false,
})

// NACHHER: Fügen Sie googleAnalytics hinzu:
const [cookiePreferences, setCookiePreferences] = useState({
  necessary: true,
  analytics: false,
  marketing: false,
  googleAnalytics: false, // NEU
})
```

**Fügen Sie einen useEffect hinzu (für Consent Mode v2):**

```tsx
// Am Ende der CookieConsentProvider-Funktion, vor dem return:

useEffect(() => {
  // Update Google Analytics consent when preferences change
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('consent', 'update', {
      'analytics_storage': cookiePreferences.googleAnalytics ? 'granted' : 'denied',
      'ad_storage': 'denied', // Werbung immer deaktiviert
    })
  }
}, [cookiePreferences.googleAnalytics])
```

**Type-Definitionen hinzufügen (falls TypeScript meckert):**

```tsx
// Oben in der Datei:
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
```

### Schritt 6.2: Cookie-Banner anpassen (15 Minuten)

**Datei: `/workspace/src/components/CookieBanner.tsx`**

Fügen Sie einen neuen Toggle für Google Analytics hinzu:

```tsx
// Irgendwo in Ihrem Cookie-Banner JSX, bei den anderen Toggles:

<div className="space-y-4">
  {/* Notwendige Cookies (immer aktiv) */}
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-sm text-gray-700">Notwendige Cookies</span>
    <input
      type="checkbox"
      checked={true}
      disabled={true}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
    />
  </label>

  {/* Ihre Custom Analytics (existiert bereits) */}
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-sm text-gray-700">Analyse-Cookies (Intern)</span>
    <input
      type="checkbox"
      checked={cookiePreferences.analytics}
      onChange={(e) =>
        setCookiePreferences({
          ...cookiePreferences,
          analytics: e.target.checked,
        })
      }
      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
    />
  </label>

  {/* NEU: Google Analytics Toggle */}
  <label className="flex items-center justify-between cursor-pointer">
    <div className="flex-1">
      <span className="text-sm font-medium text-gray-700">Google Analytics</span>
      <p className="text-xs text-gray-500 mt-1">
        Für Demografiedaten und erweiterte Statistiken
      </p>
    </div>
    <input
      type="checkbox"
      checked={cookiePreferences.googleAnalytics}
      onChange={(e) =>
        setCookiePreferences({
          ...cookiePreferences,
          googleAnalytics: e.target.checked,
        })
      }
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
    />
  </label>

  {/* Marketing Cookies */}
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-sm text-gray-700">Marketing-Cookies</span>
    <input
      type="checkbox"
      checked={cookiePreferences.marketing}
      onChange={(e) =>
        setCookiePreferences({
          ...cookiePreferences,
          marketing: e.target.checked,
        })
      }
      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
    />
  </label>
</div>
```

### Schritt 6.3: Conditional Loading in Layout.tsx

**Zurück zu: `/workspace/src/app/layout.tsx`**

Ändern Sie die Google Analytics-Integration zu conditional loading:

```tsx
// VORHER:
{process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
  <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
)}

// NACHHER: Mit Cookie-Consent-Check
// Erstellen Sie eine neue Komponente:
```

**Neue Datei: `/workspace/src/components/analytics/ConditionalGoogleAnalytics.tsx`**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { GoogleAnalytics } from '@next/third-parties/google'
import { useCookieConsent } from '@/contexts/CookieConsentContext'

export default function ConditionalGoogleAnalytics() {
  const { cookiePreferences } = useCookieConsent()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render on server
  if (!mounted) return null

  // Don't render if no measurement ID
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return null

  // Only render if user accepted Google Analytics
  if (!cookiePreferences.googleAnalytics) return null

  return <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
}
```

**Dann in `/workspace/src/app/layout.tsx`:**

```tsx
import ConditionalGoogleAnalytics from '@/components/analytics/ConditionalGoogleAnalytics'

// ... im JSX:
<body>
  <CookieConsentProvider>
    {/* ... rest of your components ... */}
    
    {/* Google Analytics - nur mit Einwilligung */}
    <ConditionalGoogleAnalytics />
  </CookieConsentProvider>
</body>
```

**✅ Checkpoint 6:** Cookie-Consent für Google Analytics integriert!

---

## 7. E-Commerce-Tracking einrichten

### Warum E-Commerce-Tracking?

```
Ihr Konzept-Check (Stripe-Zahlung) = E-Commerce-Transaktion
Google Analytics kann tracken:
✅ Produkt in Warenkorb gelegt
✅ Checkout-Prozess gestartet
✅ Kaufabschluss (Conversion)
✅ Umsatz
```

### Schritt 7.1: Helper-Funktion erstellen (20 Minuten)

**Neue Datei: `/workspace/src/lib/analytics/ga4-events.ts`**

```typescript
/**
 * Google Analytics 4 Event Tracking
 * 
 * Helper functions for tracking e-commerce and custom events
 */

// Type definitions
interface GA4Product {
  item_id: string
  item_name: string
  item_category?: string
  price: number
  quantity: number
}

interface GA4EcommerceEvent {
  currency: string
  value: number
  items: GA4Product[]
  transaction_id?: string
  coupon?: string
}

// Helper to safely call gtag
function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args)
  }
}

/**
 * Track when user views Konzept-Check product
 */
export function trackViewItem(price: number, configHash: string) {
  gtag('event', 'view_item', {
    currency: 'EUR',
    value: price / 100, // Convert cents to euros
    items: [{
      item_id: `konzept-check-${configHash}`,
      item_name: 'Konzept-Check',
      item_category: 'Service',
      price: price / 100,
      quantity: 1,
    }],
  })
  
  console.log('GA4: view_item tracked', { price, configHash })
}

/**
 * Track when user adds Konzept-Check to cart
 */
export function trackAddToCart(price: number, configHash: string) {
  gtag('event', 'add_to_cart', {
    currency: 'EUR',
    value: price / 100,
    items: [{
      item_id: `konzept-check-${configHash}`,
      item_name: 'Konzept-Check',
      item_category: 'Service',
      price: price / 100,
      quantity: 1,
    }],
  })
  
  console.log('GA4: add_to_cart tracked', { price, configHash })
}

/**
 * Track when user starts checkout
 */
export function trackBeginCheckout(price: number, configHash: string) {
  gtag('event', 'begin_checkout', {
    currency: 'EUR',
    value: price / 100,
    items: [{
      item_id: `konzept-check-${configHash}`,
      item_name: 'Konzept-Check',
      item_category: 'Service',
      price: price / 100,
      quantity: 1,
    }],
  })
  
  console.log('GA4: begin_checkout tracked', { price, configHash })
}

/**
 * Track successful purchase (Conversion!)
 */
export function trackPurchase(
  transactionId: string,
  amount: number,
  configHash: string,
  paymentMethod: string
) {
  gtag('event', 'purchase', {
    transaction_id: transactionId,
    currency: 'EUR',
    value: amount / 100,
    payment_type: paymentMethod,
    items: [{
      item_id: `konzept-check-${configHash}`,
      item_name: 'Konzept-Check',
      item_category: 'Service',
      price: amount / 100,
      quantity: 1,
    }],
  })
  
  console.log('GA4: purchase tracked', { 
    transactionId, 
    amount, 
    configHash,
    paymentMethod 
  })
}

/**
 * Track configuration creation
 */
export function trackConfigurationCreated(nestType: string, totalPrice: number) {
  gtag('event', 'configuration_created', {
    event_category: 'Konfigurator',
    event_label: nestType,
    value: totalPrice / 100,
    currency: 'EUR',
    nest_type: nestType,
  })
  
  console.log('GA4: configuration_created tracked', { nestType, totalPrice })
}

/**
 * Track when user changes a configuration option
 */
export function trackConfigurationChange(
  category: string,
  selection: string,
  priceChange: number
) {
  gtag('event', 'configuration_change', {
    event_category: 'Konfigurator',
    event_label: `${category}: ${selection}`,
    value: Math.abs(priceChange) / 100,
    category,
    selection,
    price_change: priceChange,
  })
  
  console.log('GA4: configuration_change tracked', { 
    category, 
    selection, 
    priceChange 
  })
}

/**
 * Track form submission (Lead)
 */
export function trackFormSubmission(formType: string) {
  gtag('event', 'generate_lead', {
    event_category: 'Lead',
    event_label: formType,
    form_type: formType,
  })
  
  console.log('GA4: generate_lead tracked', { formType })
}

// Type declaration for window.gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
```

### Schritt 7.2: E-Commerce-Events in Warenkorb einbauen (30 Minuten)

**Datei: `/workspace/src/app/warenkorb/components/CheckoutStepper.tsx`**

**Import hinzufügen:**

```tsx
import { 
  trackViewItem, 
  trackBeginCheckout, 
  trackPurchase 
} from '@/lib/analytics/ga4-events'
```

**Event 1: View Item (wenn Warenkorb geladen wird)**

```tsx
// Am Anfang der Komponente, in useEffect:
useEffect(() => {
  if (configurationData && totalPrice) {
    // Track that user is viewing the Konzept-Check product
    trackViewItem(totalPrice, generateConfigHash(configurationData))
  }
}, [configurationData, totalPrice])
```

**Event 2: Begin Checkout (wenn Checkout startet)**

```tsx
// Wenn User auf "Zur Kasse" klickt:
const handleProceedToCheckout = () => {
  if (configurationData && totalPrice) {
    trackBeginCheckout(totalPrice, generateConfigHash(configurationData))
  }
  // ... rest of your checkout logic
}
```

**Event 3: Purchase (nach erfolgreicher Zahlung)**

```tsx
// In der Funktion, die nach Stripe-Zahlung aufgerufen wird:
const handlePaymentSuccess = (paymentIntent: PaymentIntent) => {
  if (configurationData && totalPrice) {
    trackPurchase(
      paymentIntent.id,
      paymentIntent.amount,
      generateConfigHash(configurationData),
      paymentIntent.payment_method_types[0] || 'card'
    )
  }
  // ... rest of your success logic
}
```

### Schritt 7.3: Add-to-Cart Event (Optional)

**Falls Sie einen "In den Warenkorb"-Button haben:**

**Datei: Wo auch immer Ihr "In den Warenkorb"-Button ist**

```tsx
import { trackAddToCart } from '@/lib/analytics/ga4-events'

const handleAddToCart = () => {
  if (configurationData && totalPrice) {
    trackAddToCart(totalPrice, generateConfigHash(configurationData))
  }
  // ... rest of add to cart logic
}
```

**✅ Checkpoint 7:** E-Commerce-Tracking eingerichtet!

---

## 8. Custom Events für Konfigurator

### Warum Custom Events?

```
Standard-Events (Seitenaufrufe) reichen nicht!
Sie wollen wissen:
- Welche Nest-Größe wird am häufigsten ausgewählt?
- Welche Gebäudehülle ist beliebt?
- Wo brechen User ab?
```

### Schritt 8.1: Konfigurator-Events tracken (30 Minuten)

**Datei: `/workspace/src/app/konfigurator/...` (Ihre Konfigurator-Komponenten)**

**Import hinzufügen:**

```tsx
import { 
  trackConfigurationCreated,
  trackConfigurationChange 
} from '@/lib/analytics/ga4-events'
```

**Event 1: Configuration Created**

```tsx
// Wenn User erstmals eine Konfiguration erstellt:
useEffect(() => {
  if (nestType && !isInitialLoad) {
    trackConfigurationCreated(nestType, totalPrice)
    setIsInitialLoad(true)
  }
}, [nestType, totalPrice])
```

**Event 2: Configuration Change**

```tsx
// Jedes Mal wenn User eine Option ändert:
const handleOptionChange = (category: string, selection: string, priceChange: number) => {
  // Your existing logic...
  
  // Track the change
  trackConfigurationChange(category, selection, priceChange)
}
```

**Beispiel für Gebäudehülle-Auswahl:**

```tsx
const handleGebaeudehuelleChange = (newValue: string) => {
  const oldPrice = totalPrice
  
  // Update configuration
  setGebaeudehuelle(newValue)
  calculateNewPrice(newValue) // Your price calculation
  
  const newPrice = calculateNewPrice(newValue)
  const priceChange = newPrice - oldPrice
  
  // Track in Google Analytics
  trackConfigurationChange(
    'Gebäudehülle',
    getGebaeudehuelleLabel(newValue),
    priceChange
  )
}
```

### Schritt 8.2: Lead-Generation Events (10 Minuten)

**Kontaktformular:**

```tsx
// Datei: /workspace/src/components/sections/GrundstueckCheckForm.tsx
import { trackFormSubmission } from '@/lib/analytics/ga4-events'

const handleSubmit = async (e) => {
  e.preventDefault()
  
  // Your form submission logic...
  const result = await submitForm(formData)
  
  if (result.success) {
    // Track lead generation
    trackFormSubmission('Grundstücks-Check')
  }
}
```

**Appointment Booking:**

```tsx
// Wenn User einen Termin bucht:
trackFormSubmission('Termin-Buchung')
```

**Inquiry Form:**

```tsx
// Allgemeines Kontaktformular:
trackFormSubmission('Kontaktanfrage')
```

**✅ Checkpoint 8:** Custom Events für Konfigurator implementiert!

---

## 9. Conversion-Ziele definieren

### In Google Analytics: Conversions einrichten (20 Minuten)

```
1. Gehen Sie zu: analytics.google.com
2. Wählen Sie Ihre Property: "Nest-Haus Website"
3. Im linken Menü: "Admin" → "Events" (unter "Datenerfassung und -änderung")
4. Warten Sie 24 Stunden bis Events ankommen
5. Dann: Events als Conversions markieren
```

### Welche Events als Conversions markieren?

```
☑ purchase                    ← WICHTIGSTE Conversion (Konzept-Check-Kauf)
☑ generate_lead               ← Kontaktformular-Anfragen
☑ begin_checkout              ← Checkout-Start (Micro-Conversion)
☐ configuration_created       ← Optional: Interesse-Signal
☐ add_to_cart                 ← Optional: Micro-Conversion
```

### Conversion-Werte setzen (für ROI-Berechnung)

```
purchase:              Tatsächlicher Verkaufspreis (automatisch)
generate_lead:         €50 (geschätzter Wert eines Leads)
begin_checkout:        €25 (geschätzter Wert)
configuration_created: €10 (geschätzter Wert)
```

**Wie setzen:**
```
Admin → Events → [Event auswählen]
→ "Als Conversion markieren" aktivieren
→ Conversion-Wert: [Betrag eingeben]
```

**✅ Checkpoint 9:** Conversion-Ziele definiert!

---

## 10. Testen & Verifizieren

### Schritt 10.1: DebugView aktivieren (5 Minuten)

```
1. Gehen Sie zu: analytics.google.com
2. Ihre Property: "Nest-Haus Website"
3. Im linken Menü: "Admin"
4. Unter "Datenerfassung": "DebugView"
5. Öffnen Sie DebugView in neuem Tab
```

### Schritt 10.2: Test durchführen (15 Minuten)

**Test 1: Basis-Tracking**

```
1. Öffnen Sie Ihre Website: https://nest-haus.at
2. In DebugView: Sehen Sie einen "page_view"-Event? ✓
3. Navigieren Sie zu einer anderen Seite
4. In DebugView: Weiterer "page_view"-Event? ✓
```

**Test 2: Konfigurator**

```
1. Gehen Sie zum Konfigurator
2. Wählen Sie eine Nest-Größe
3. In DebugView: Sehen Sie "configuration_created"? ✓
4. Ändern Sie die Gebäudehülle
5. In DebugView: Sehen Sie "configuration_change"? ✓
```

**Test 3: E-Commerce**

```
1. Erstellen Sie eine Konfiguration
2. Klicken Sie "In den Warenkorb"
3. In DebugView: Sehen Sie "add_to_cart"? ✓
4. Gehen Sie zur Kasse
5. In DebugView: Sehen Sie "begin_checkout"? ✓

Testen Sie KEINE echte Zahlung in Production!
Nur in Stripe Test-Mode.
```

**Test 4: Lead-Generation**

```
1. Öffnen Sie das Kontaktformular
2. Füllen Sie es aus und senden Sie ab
3. In DebugView: Sehen Sie "generate_lead"? ✓
```

### Schritt 10.3: Realtime-Report checken (5 Minuten)

```
1. Analytics → Reports → Realtime
2. Sehen Sie sich selbst als aktiven User? ✓
3. Sehen Sie Ihre Events in der Liste? ✓
4. Klicken Sie auf verschiedene Events für Details
```

### Fehlerbehebung

**Problem: Keine Events in DebugView**

```
Lösung 1: Cookie-Consent prüfen
→ Haben Sie Google Analytics-Cookies akzeptiert?
→ Cookie-Banner öffnen → Google Analytics aktivieren

Lösung 2: Browser-Konsole prüfen (F12)
→ Sehen Sie Fehler?
→ Werden gtag-Requests abgeschickt?

Lösung 3: Measurement ID prüfen
→ .env.local: Ist NEXT_PUBLIC_GA_MEASUREMENT_ID korrekt?
→ Analytics: Stimmt die ID mit dem Dashboard überein?

Lösung 4: Cache löschen
→ Browser-Cache leeren (Strg+Shift+Del)
→ Next.js-Cache löschen: rm -rf .next
→ Dev-Server neu starten: npm run dev
```

**Problem: Events kommen an, aber keine Conversions**

```
Warten Sie 24 Stunden!
Google Analytics braucht Zeit, um Events zu verarbeiten.
Danach können Sie Events als Conversions markieren.
```

**✅ Checkpoint 10:** Tracking getestet und verifiziert!

---

## 11. Dashboard & Reports einrichten

### Standard-Reports verstehen (15 Minuten)

```
Google Analytics Dashboard
├── Home (Übersicht)
├── Reports
│   ├── Realtime (Echtzeit-Besucher)
│   ├── Übersicht (Snapshot)
│   ├── Akquisition (Traffic-Quellen)
│   │   └── Hier sehen Sie: Google, Direct, Social Media, etc.
│   ├── Engagement (Nutzerverhalten)
│   │   ├── Events (Ihre Custom Events!)
│   │   ├── Conversions (Käufe, Leads)
│   │   └── Seiten und Bildschirme
│   ├── Monetarisierung (E-Commerce)
│   │   └── Umsatz, Transaktionen, etc.
│   └── Nutzer (demografisch)
│       └── Alter, Geschlecht, Interessen
└── Explore (Custom Reports erstellen)
```

### Wichtige Reports für nest-haus.at

#### Report 1: Traffic-Quellen

```
Navigation: Reports → Akquisition → Akquisition: Übersicht

Was Sie sehen:
- Direct (Direkteingabe)
- Organic Search (Google)
- Organic Social (Instagram, Facebook)
- Referral (andere Websites)
- (none) (unbekannt)

Nutzen: Wo kommen Ihre Besucher her?
```

#### Report 2: Konfigurator-Events

```
Navigation: Reports → Engagement → Events

Filtern Sie nach:
- configuration_created
- configuration_change
- add_to_cart
- begin_checkout

Nutzen: Wie wird der Konfigurator genutzt?
```

#### Report 3: Conversions & Umsatz

```
Navigation: Reports → Engagement → Conversions

Oder: Reports → Monetarisierung → E-Commerce-Käufe

Was Sie sehen:
- Anzahl Käufe (purchase Events)
- Gesamtumsatz
- Durchschnittlicher Bestellwert
- Conversion-Rate

Nutzen: Wie viel verdienen Sie?
```

#### Report 4: Beliebte Seiten

```
Navigation: Reports → Engagement → Seiten und Bildschirme

Was Sie sehen:
- Welche Seiten werden am häufigsten besucht?
- Wie lange bleiben User auf Seiten?
- Welche Seiten haben hohe Absprungraten?

Nutzen: Content-Optimierung
```

### Custom Dashboard erstellen (30 Minuten)

**Schritt 1: Explore öffnen**

```
1. Im linken Menü: "Explore"
2. Klicken Sie: "Leere Berichte" oder "Freeform"
3. Name: "Nest-Haus Konfigurator-Performance"
```

**Schritt 2: Dimensionen & Messwerte hinzufügen**

```
Dimensionen (Spalten):
- Ereignisname (Event Name)
- Seitenpfad + Abfrage (Page Path)
- Quelle / Medium (Source / Medium)
- Gerätekategorie (Device Category)

Messwerte (Zahlen):
- Ereignisse (Event Count)
- Nutzer (Users)
- Umsatz (Revenue)
- Conversions (Conversion Count)
```

**Schritt 3: Filter setzen**

```
Filter: Ereignisname
Operator: genau übereinstimmend
Wert: configuration_created, add_to_cart, begin_checkout, purchase

→ Zeigt nur Konfigurator-relevante Events
```

**Schritt 4: Visualisierung wählen**

```
Tabelle: Für detaillierte Daten
Balkendiagramm: Für Event-Vergleiche
Liniendiagramm: Für Trends über Zeit
Kreisdiagramm: Für Traffic-Quellen-Anteile
```

**Schritt 5: Speichern & zur Bibliothek hinzufügen**

```
1. Oben rechts: "Speichern"
2. Name: "Nest-Haus Konfigurator-Dashboard"
3. Zur Bibliothek hinzufügen: ✓

Jetzt finden Sie es unter: Explore → In der Bibliothek
```

### Nützliche vorgefertigte Explorations

```
1. Trichter-Exploration (Funnel Exploration)
   → Zeigt Conversion-Funnel:
     Seitenbesuch → Konfigurator → Warenkorb → Kauf

2. Pfadanalyse (Path Exploration)
   → Zeigt User-Journey durch Ihre Website

3. Kohortenanalyse (Cohort Exploration)
   → Vergleicht User-Gruppen über Zeit

4. Segmentüberschneidung (Segment Overlap)
   → Vergleicht verschiedene User-Segmente
```

**✅ Checkpoint 11:** Dashboard und Reports eingerichtet!

---

## 12. Datenschutz & GDPR-Compliance

### Wichtige DSGVO-Anforderungen

```
✅ Cookie-Consent vor Tracking (haben Sie schon)
✅ Datenschutzerklärung aktualisieren
✅ IP-Anonymisierung (automatisch in GA4)
✅ Datenauftragsverarbeitungsvertrag (DPA) mit Google
✅ Opt-Out-Möglichkeit für User
```

### Schritt 12.1: Datenschutzerklärung aktualisieren (30 Minuten)

**Datei: `/workspace/src/app/datenschutz/page.tsx` oder DatenschutzClient.tsx**

**Fügen Sie diesen Abschnitt hinzu:**

```markdown
## Google Analytics

Wir verwenden Google Analytics, einen Webanalysedienst der Google Ireland Limited ("Google"). Google Analytics verwendet Cookies und ähnliche Technologien, um die Nutzung unserer Website zu analysieren.

### Zweck der Datenverarbeitung
Die Verarbeitung erfolgt zur Analyse des Nutzerverhaltens, zur Verbesserung unserer Website und zur Optimierung unseres Angebots.

### Rechtsgrundlage
Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.

### Erfasste Daten
- Seitenaufrufe und Navigation
- Geräteinformationen (Browser, Betriebssystem, Bildschirmauflösung)
- Ungefähre Standortdaten (Land, Region)
- Interaktionen mit unserer Website

### Datenübermittlung in die USA
Google Analytics überträgt Daten in die USA. Es besteht ein Angemessenheitsbeschluss der EU-Kommission für die Datenübermittlung in die USA.

### Speicherdauer
Daten werden nach 14 Monaten automatisch gelöscht.

### Widerruf und Opt-Out
Sie können Ihre Einwilligung jederzeit in den Cookie-Einstellungen widerrufen oder das Browser-Add-on von Google zur Deaktivierung von Google Analytics installieren: https://tools.google.com/dlpage/gaoptout

### Weitere Informationen
Informationen zu Google Analytics und Datenschutz finden Sie unter:
- Google Analytics Datenschutzhinweise: https://support.google.com/analytics/answer/6004245
- Google Datenschutzerklärung: https://policies.google.com/privacy
```

### Schritt 12.2: Data Processing Amendment (DPA) akzeptieren

```
1. Gehen Sie zu: https://privacy.google.com/businesses/processorterms/
2. Oder in Analytics: Admin → Account-Einstellungen → "Datenverarbeitungsbedingungen"
3. Lesen Sie die Bedingungen
4. Akzeptieren Sie die "EU-Standardvertragsklauseln"
5. Speichern
```

### Schritt 12.3: IP-Anonymisierung (bereits aktiviert in GA4)

```
✅ In Google Analytics 4 ist IP-Anonymisierung STANDARD!
Sie müssen nichts tun.

In GA4 werden IPs automatisch anonymisiert:
- Letzte Oktette werden entfernt
- Nur grobe Geo-Location wird gespeichert
- Volle IP wird NIEMALS gespeichert
```

### Schritt 12.4: User-ID & Remarketing deaktivieren (empfohlen für DSGVO)

```
1. Analytics → Admin → Datenerfassung
2. Unter "Datenerhebung":
   
   Google-Signale für Ihre Datenerfassung aktivieren:
   ⚪ Deaktivieren (empfohlen für maximale DSGVO-Compliance)
   
   Warum deaktivieren:
   - Google-Signale = Cross-Device-Tracking
   - Nutzt Google-Konto-Daten
   - Kann DSGVO-problematisch sein
   - Sie brauchen es nicht für Basis-Analytics
```

### Schritt 12.5: Data Retention (Datenaufbewahrung) einstellen

```
1. Analytics → Admin → Dateneinstellungen → Datenaufbewahrung
2. "Aufbewahrungsdauer für Nutzerdaten":
   
   Empfohlen für DSGVO:
   ⦿ 14 Monate (Standard)
   
   Strenger:
   ⦿ 2 Monate
   
3. "Nutzerdaten bei neuer Aktivität zurücksetzen":
   ⚪ Aus (empfohlen)
   
4. Speichern
```

**✅ Checkpoint 12:** DSGVO-Compliance sichergestellt!

---

## 13. Launch-Checklist

### Vor dem Go-Live prüfen:

```
Pre-Launch Checklist:
□ Google Analytics 4 Property erstellt
□ Measurement ID in .env.local eingetragen
□ @next/third-parties installiert
□ GoogleAnalytics-Komponente in layout.tsx eingefügt
□ Cookie-Consent für Google Analytics hinzugefügt
□ ConditionalGoogleAnalytics-Komponente erstellt
□ E-Commerce-Events implementiert (purchase, begin_checkout)
□ Konfigurator-Events implementiert (configuration_created, configuration_change)
□ Lead-Events implementiert (generate_lead)
□ DebugView getestet - Events kommen an
□ Datenschutzerklärung aktualisiert
□ DPA mit Google akzeptiert
□ IP-Anonymisierung aktiviert (Standard in GA4)
□ Data Retention auf 14 Monate gesetzt
□ Team informiert über neue Analytics

Optional:
□ Google Tag Manager statt direkt (für Nicht-Entwickler)
□ Conversion-Ziele definiert (nach 24h)
□ Custom Dashboard erstellt
□ Wöchentliche Report-Email eingerichtet
```

### Nach dem Go-Live (erste 7 Tage):

```
Tag 1:
□ Realtime-Report checken → Kommen Events an?
□ DebugView checken → Events korrekt?

Tag 2-3:
□ Events-Report checken → Alle Events vorhanden?
□ E-Commerce-Report checken → Transaktionen tracken?

Tag 7:
□ Traffic-Quellen analysieren → Woher kommen User?
□ Konfigurator-Nutzung analysieren → Welche Optionen beliebt?
□ Conversion-Rate berechnen → Wie viele kaufen?
```

### Monatliche Checks:

```
Jeden Monat:
□ Conversion-Rate prüfen → Verbessert oder verschlechtert?
□ Top-Traffic-Quellen identifizieren → Wo investieren?
□ Beliebte Konfigurator-Optionen → Was promoted?
□ Abbruchpunkte identifizieren → Was optimieren?
□ Umsatz tracken → Ziele erreicht?
```

---

## 14. Troubleshooting & FAQ

### Problem 1: Keine Events in Google Analytics

**Symptome:**
```
✅ Website läuft
❌ Keine Events in Realtime
❌ Keine Events in DebugView
```

**Lösungen:**

```
Schritt 1: Cookie-Consent prüfen
→ Website öffnen
→ Cookie-Banner: Google Analytics aktivieren?
→ F12 (Developer Tools) → Application → Cookies
→ Gibt es einen "_ga"-Cookie?

Schritt 2: Measurement ID prüfen
→ .env.local öffnen
→ NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
→ Ist die ID korrekt?
→ Stimmt sie mit dem Analytics-Dashboard überein?

Schritt 3: Browser-Konsole prüfen
→ F12 → Console Tab
→ Fehler sichtbar?
→ Network Tab → Filter: "google-analytics"
→ Werden Requests abgeschickt?

Schritt 4: Ad-Blocker prüfen
→ Haben Sie einen Ad-Blocker installiert?
→ Deaktivieren Sie ihn für nest-haus.at
→ uBlock Origin, AdBlock Plus blockieren Analytics

Schritt 5: Cache löschen
→ Browser: Strg+Shift+Del → Alles löschen
→ Next.js: rm -rf .next
→ npm run dev (neu starten)
```

### Problem 2: Events kommen an, aber keine Conversions

**Symptome:**
```
✅ Events in Realtime sichtbar
✅ purchase-Event feuert
❌ Keine Conversions in Reports
```

**Lösung:**
```
WARTEN SIE 24 STUNDEN!

Google Analytics braucht Zeit:
- Events: Sofort sichtbar
- Conversions: 24-48 Stunden Verzögerung

Nach 24 Stunden:
1. Admin → Events
2. purchase-Event suchen
3. Schalter "Als Conversion markieren" aktivieren
4. Weitere 24 Stunden warten → Dann in Reports sichtbar
```

### Problem 3: E-Commerce-Daten fehlen

**Symptome:**
```
✅ purchase-Event feuert
❌ Kein Umsatz in Monetarisierung
❌ Keine Transaktionen
```

**Lösung:**
```
Prüfen Sie die Event-Parameter:

1. DebugView öffnen
2. purchase-Event anklicken
3. Parameter prüfen:
   ✅ transaction_id: "pi_xxxxx" (muss vorhanden sein!)
   ✅ value: 99.00 (in EUR, nicht Cent!)
   ✅ currency: "EUR" (muss "EUR" sein!)
   ✅ items: [{ item_id, item_name, price, quantity }]

Häufiger Fehler:
❌ value: 9900 (Cent) → Falsch!
✅ value: 99.00 (Euro) → Richtig!

Im Code:
// FALSCH:
value: amount  // amount ist in Cent

// RICHTIG:
value: amount / 100  // Umrechnen in Euro
```

### Problem 4: Doppelte Events

**Symptome:**
```
⚠️ Events werden 2x getrackt
⚠️ purchase-Event erscheint doppelt
```

**Lösung:**
```
Ursache: Tracking-Code mehrfach eingebunden

Prüfen Sie:
1. layout.tsx → Nur 1x <GoogleAnalytics />
2. Keine manuelle gtag-Implementierung zusätzlich
3. Kein Google Tag Manager UND @next/third-parties gleichzeitig

Wenn React Strict Mode:
→ In Development werden manche Events 2x gefeuert
→ In Production ist das normal nur 1x
→ Testen Sie in Production Build: npm run build && npm start
```

### Problem 5: Consent Mode funktioniert nicht

**Symptome:**
```
✅ Cookie-Banner akzeptiert
❌ Events werden trotzdem nicht getrackt
```

**Lösung:**
```
Prüfen Sie ConditionalGoogleAnalytics:

1. useCookieConsent() korrekt importiert?
2. cookiePreferences.googleAnalytics wird korrekt gesetzt?
3. Browser-Konsole: console.log(cookiePreferences)
4. Wird GoogleAnalytics-Komponente gerendert?

Debug-Code in ConditionalGoogleAnalytics.tsx:
useEffect(() => {
  console.log('Cookie Preferences:', cookiePreferences)
  console.log('Google Analytics accepted:', cookiePreferences.googleAnalytics)
}, [cookiePreferences])
```

---

## 15. Weiterführende Ressourcen

### Offizielle Google-Dokumentation

```
Google Analytics 4 Help:
https://support.google.com/analytics/

GA4 Setup-Anleitung:
https://support.google.com/analytics/answer/9304153

E-Commerce-Tracking:
https://developers.google.com/analytics/devguides/collection/ga4/ecommerce

Event-Reference:
https://developers.google.com/analytics/devguides/collection/ga4/reference/events

Consent Mode v2:
https://support.google.com/analytics/answer/9976101
```

### Next.js Dokumentation

```
@next/third-parties:
https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries

Script-Optimierung:
https://nextjs.org/docs/app/building-your-application/optimizing/scripts
```

### Tools & Extensions

```
Google Analytics Debugger (Chrome):
https://chrome.google.com/webstore/detail/google-analytics-debugger/

Tag Assistant (Chrome):
https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/

GA4 BigQuery Export:
https://support.google.com/analytics/answer/9358801
(Kostenlos bis 1 Million Events/Tag)
```

### Österreich-spezifische Datenschutz-Links

```
Österreichische Datenschutzbehörde:
https://www.dsb.gv.at/

DSGVO-Text (offiziell):
https://eur-lex.europa.eu/eli/reg/2016/679/oj

DSGVO-Checkliste für Websites:
https://www.wko.at/branchen/information-consulting/IT/datenschutz-grundverordnung.html
```

---

## 16. Support & Hilfe

### Bei Problemen:

**1. Google Analytics Community (Deutsch):**
```
https://support.google.com/analytics/community
→ Fragen stellen
→ Von Experten lernen
→ Häufige Probleme durchsuchen
```

**2. Next.js Discord:**
```
https://discord.com/invite/nextjs
→ Channel: #app-router-help
→ Fragen zu @next/third-parties
```

**3. Stack Overflow:**
```
Tags: [google-analytics] [next.js] [ga4]
Bevor Sie fragen:
→ Durchsuchen Sie existierende Antworten
→ Geben Sie spezifische Fehlermeldungen an
→ Code-Beispiele beifügen
```

---

## ✅ Zusammenfassung

### Was Sie jetzt haben:

```
✅ Google Analytics 4 Property: "Nest-Haus Website"
✅ Datenstream eingerichtet: nest-haus.at
✅ Tracking-Code integriert: @next/third-parties
✅ Cookie-Consent implementiert: DSGVO-konform
✅ E-Commerce-Tracking: Konzept-Check-Käufe
✅ Custom Events: Konfigurator-Nutzung
✅ Lead-Tracking: Kontaktformular
✅ Dashboard & Reports: Eingerichtet
✅ Datenschutz: Compliant

Measurement ID: G-XXXXXXXXXX
```

### Nächste Schritte:

```
Woche 1:
→ Testen Sie das Tracking täglich
→ Prüfen Sie Realtime-Reports
→ Beheben Sie eventuelle Probleme

Woche 2-4:
→ Definieren Sie Conversion-Ziele
→ Erstellen Sie Custom Dashboards
→ Analysieren Sie erste Daten

Monat 2+:
→ Optimieren Sie basierend auf Daten
→ A/B-Tests durchführen
→ Marketing-Kampagnen tracken
```

### Wichtige Metriken zu beobachten:

```
📊 Traffic:
- Woher kommen Ihre Besucher?
- Welche Seiten sind am beliebtesten?
- Wie lange bleiben User auf der Seite?

🔧 Konfigurator:
- Welche Nest-Größen werden gewählt?
- Welche Gebäudehülle ist am beliebtesten?
- Wo brechen User ab?

💰 Conversions:
- Wie viele kaufen den Konzept-Check?
- Wie viele füllen das Kontaktformular aus?
- Wie hoch ist die Conversion-Rate?

💼 ROI:
- Welche Traffic-Quellen bringen die meisten Käufe?
- Lohnen sich Google Ads?
- Welcher Content konvertiert am besten?
```

---

**Viel Erfolg mit Google Analytics 4!** 🎉

Bei Fragen: Dokumentation durchsuchen oder Community fragen.

**Letzte Aktualisierung:** 2025-11-20  
**Version:** 1.0  
**Autor:** Cursor AI Agent für nest-haus.at

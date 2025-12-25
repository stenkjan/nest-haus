# 🚨 Konzept-Check Webhook - Problem & Lösung

**Datum:** 25. Dezember 2025  
**Status:** ❌ **KRITISCH - Webhook fehlkonfiguriert**

---

## 📊 Problem-Analyse

### Symptome:
- Webhook "konzept-check" in Stripe Dashboard
- 27 Request Attempts, **alle 27 fehlgeschlagen**
- Webhook Secret korrekt
- Status: Active

### Root Cause:

**Problem 1: Falscher Endpoint**
```
❌ Konfiguriert: https://nest-haus.at/api/webhooks/konzept-check
✅ Sollte sein:  https://www.nest-haus.at/api/webhooks/stripe
```

Der Endpoint `/api/webhooks/konzept-check` **existiert nicht!**

**Test-Bestätigung:**
```bash
$ curl -I https://www.nest-haus.at/api/webhooks/konzept-check
HTTP/2 404  # ❌ Not Found!

$ curl -I https://www.nest-haus.at/api/webhooks/stripe
HTTP/2 405  # ✅ Exists! (405 = Method Not Allowed für GET, POST funktioniert)
```

**Problem 2: Redirect (zusätzlich)**
```
nest-haus.at → www.nest-haus.at (HTTP 301)
```

Stripe folgt niemals Redirects!

---

## ✅ Lösung: Webhook-URL korrigieren

### Schritt 1: Stripe Dashboard öffnen

1. Gehe zu: https://dashboard.stripe.com/webhooks
2. Finde Webhook: **"konzept-check"**

### Schritt 2: Webhook-URL ändern

**Von (falsch):**
```
https://nest-haus.at/api/webhooks/konzept-check
```

**Zu (korrekt):**
```
https://www.nest-haus.at/api/webhooks/stripe
```

### Schritt 3: Events prüfen

Stelle sicher, dass diese Events ausgewählt sind:
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`
- ✅ `payment_intent.canceled`
- ✅ `payment_intent.processing`
- ✅ `charge.refunded`
- ✅ `refund.created`

### Schritt 4: Webhook-Secret aktualisieren (optional)

Falls Sie separate Secrets verwenden möchten:

**Option A: Gleicher Secret für beide Webhooks (empfohlen)**
- Verwenden Sie denselben Secret wie für den Haupt-Webhook
- Einfacher zu verwalten
- Ein Endpoint verarbeitet alles

**Option B: Separater Secret (falls gewünscht)**
1. In Stripe Dashboard: Neuen Secret generieren
2. In Vercel: Environment Variable hinzufügen
3. Im Code unterscheiden (nicht empfohlen, unnötig komplex)

### Schritt 5: Test senden

1. Klick "Send test webhook"
2. Event: `payment_intent.succeeded`
3. **Erwartung:** ✅ **200 OK**

---

## 🔍 Warum ein Endpoint für alles?

### Aktuelle Architektur:

```typescript
// src/app/api/webhooks/stripe/route.ts
export async function POST(request: NextRequest) {
    // Verarbeitet ALLE Stripe-Zahlungen:
    // - Konfigurator-Bestellungen
    // - Konzept-Check Bestellungen  
    // - Grundstückscheck Bestellungen
    // - Alle anderen Stripe-Zahlungen
    
    switch (event.type) {
        case 'payment_intent.succeeded':
            // Findet automatisch die richtige Inquiry anhand paymentIntentId
            const inquiry = await prisma.customerInquiry.findFirst({
                where: { paymentIntentId: paymentIntent.id }
            });
            // Verarbeitet unabhängig vom Typ!
            break;
    }
}
```

**Vorteile:**
- ✅ Ein Webhook für alle Zahlungen
- ✅ Automatische Zuordnung anhand Payment Intent ID
- ✅ Einfacher zu warten
- ✅ Kein doppelter Code

**Kein separater Webhook nötig!**

---

## 🤔 Sollten wir separate Webhooks haben?

### Option 1: Ein Webhook (EMPFOHLEN) ✅

**Setup:**
```
Webhook Name: "stripe-payments"
URL: https://www.nest-haus.at/api/webhooks/stripe
Events: Alle payment_intent.* Events
```

**Vorteile:**
- ✅ Einfach
- ✅ Ein Secret zu verwalten
- ✅ Automatische Verarbeitung aller Zahlungen
- ✅ Kein Code-Duplikat

**Nachteile:**
- ❌ Keine Trennung in Logs (aber nicht schlimm)

### Option 2: Separate Webhooks (NICHT EMPFOHLEN) ❌

**Setup:**
```
Webhook 1: "hauptzahlungen"
URL: https://www.nest-haus.at/api/webhooks/stripe

Webhook 2: "konzept-check"  
URL: https://www.nest-haus.at/api/webhooks/konzept-check (muss erstellt werden!)
```

**Nachteile:**
- ❌ Doppelter Code nötig
- ❌ Zwei Secrets zu verwalten
- ❌ Mehr Maintenance
- ❌ Mehr Fehlerquellen
- ❌ Kein echter Vorteil

**Nur sinnvoll wenn:**
- Komplett andere Verarbeitung nötig
- Unterschiedliche Teams verantwortlich
- Regulatorische Trennung erforderlich

---

## 🛠️ Sofort-Fix (5 Minuten)

### Schritt-für-Schritt:

**1. Stripe Dashboard:**
```
https://dashboard.stripe.com/webhooks
→ Klick auf "konzept-check" Webhook
→ Klick "Update details" oder "⋯" → "Update endpoint"
→ URL ändern zu: https://www.nest-haus.at/api/webhooks/stripe
→ Klick "Update endpoint"
```

**2. Test:**
```
→ Klick "Send test webhook"
→ Event: payment_intent.succeeded
→ Erwartung: ✅ 200 OK
```

**3. Verifizieren:**
```bash
# Webhook sollte jetzt funktionieren
# Check Recent deliveries in Stripe Dashboard
```

**4. Optional: Webhook umbenennen**
```
→ Klick auf Webhook
→ Klick "..." → "Update details"
→ Name ändern von "konzept-check" zu "stripe-payments" (für Klarheit)
```

---

## 🚨 Alternative: Separaten Endpoint erstellen (NICHT EMPFOHLEN)

Falls Sie wirklich einen separaten Endpoint wollen:

### Code erstellen:

```typescript
// src/app/api/webhooks/konzept-check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-09-30.clover',
});

const webhookSecret = process.env.STRIPE_KONZEPT_CHECK_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
    // Exakt gleicher Code wie in /api/webhooks/stripe/route.ts
    // ... (würde dupliziert werden)
}
```

### Warum das schlecht ist:
- ❌ 200+ Zeilen Code-Duplikat
- ❌ Änderungen müssen an 2 Stellen gemacht werden
- ❌ Doppelte Fehlerquellen
- ❌ Mehr Maintenance
- ❌ **Kein Vorteil!**

---

## ✅ Empfohlene Lösung

### Für Konzept-Check Webhook:

**1. URL korrigieren:**
```
Von: https://nest-haus.at/api/webhooks/konzept-check
Zu:  https://www.nest-haus.at/api/webhooks/stripe
```

**2. Optional: Webhook umbenennen**
```
Von: "konzept-check"
Zu:  "stripe-payments" oder "nest-haus-payments"
```

**3. Fertig!**
- Ein Endpoint verarbeitet alle Zahlungen
- Automatische Zuordnung anhand Payment Intent ID
- Funktioniert für Konfigurator UND Konzept-Check

---

## 📊 Verifikation nach Fix

### Test 1: Webhook erreichbar

```bash
curl -I https://www.nest-haus.at/api/webhooks/stripe
# Erwartung: HTTP/2 405 (nicht 404!)
```

### Test 2: Stripe Test-Webhook

**Im Stripe Dashboard:**
1. Webhook öffnen
2. "Send test webhook"
3. Event: `payment_intent.succeeded`
4. **Erwartung:** ✅ 200 OK

### Test 3: Recent Deliveries

**In Stripe Dashboard:**
- Gehe zu: Webhooks → [Dein Webhook] → Recent deliveries
- **Erwartung:** Alle grün (Success)
- Keine roten (Failed) mehr

---

## 🔍 Troubleshooting

### Problem: Immer noch 404

**Lösung:**
- Prüfe URL exakt: `https://www.nest-haus.at/api/webhooks/stripe`
- Mit `www.` nicht ohne!
- `/webhooks/stripe` nicht `/webhooks/konzept-check`

### Problem: Immer noch 301 Redirect

**Lösung:**
- URL muss mit `www.` beginnen
- Unsere Vercel Config leitet nur non-www weiter
- Mit `www.` gibt es keinen Redirect

### Problem: 400 Signature Error

**Lösung:**
1. Stripe Dashboard → Webhook → Signing secret
2. Kopiere Secret (beginnt mit `whsec_`)
3. Vercel → Environment Variables → `STRIPE_WEBHOOK_SECRET`
4. Update Secret
5. Redeploy

---

## 📋 Checklist

- [ ] **Stripe Dashboard geöffnet**
- [ ] **Webhook "konzept-check" gefunden**
- [ ] **URL geändert zu:** `https://www.nest-haus.at/api/webhooks/stripe`
- [ ] **Events überprüft** (6 Events ausgewählt)
- [ ] **Test-Webhook gesendet**
- [ ] **Ergebnis: 200 OK** ✅
- [ ] **Recent deliveries: Alle Success** ✅
- [ ] **Optional: Webhook umbenannt** zu "stripe-payments"

---

## 🎯 Zusammenfassung

### Problem:
- ❌ Webhook-URL zeigt auf nicht-existierenden Endpoint
- ❌ `/api/webhooks/konzept-check` existiert nicht (404)
- ❌ Redirect-Problem zusätzlich (301)

### Lösung:
- ✅ URL ändern zu: `https://www.nest-haus.at/api/webhooks/stripe`
- ✅ Dieser Endpoint verarbeitet ALLE Stripe-Zahlungen
- ✅ Automatische Zuordnung anhand Payment Intent ID

### Zeitaufwand:
- **5 Minuten** - URL in Stripe Dashboard ändern
- **0 Code-Änderungen** nötig!

### Ergebnis:
- ✅ Konzept-Check Zahlungen werden verarbeitet
- ✅ Bestätigungs-E-Mails werden gesendet
- ✅ Datenbank wird aktualisiert
- ✅ Admin-Benachrichtigungen funktionieren

---

**Status:** ⚠️ **KRITISCH - Sofort beheben**  
**Priorität:** 🚨 **HOCH** (27 Fehlversuche)  
**Zeitaufwand:** 5 Minuten  
**Code-Änderungen:** Keine nötig

**Nächster Schritt:** Stripe Dashboard öffnen → URL ändern → Test senden

---

**Erstellt:** 25. Dezember 2025  
**Branch:** cursor/stripe-webhook-error-investigation-0024

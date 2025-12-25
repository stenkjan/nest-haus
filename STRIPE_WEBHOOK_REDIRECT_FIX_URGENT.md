# 🚨 KRITISCH: Stripe Webhook Redirect-Problem - Sofort-Fix

**Datum:** 25. Dezember 2025  
**Status:** ❌ **ALLE Webhooks schlagen fehl wegen 301 Redirect**  
**Branch:** `cursor/stripe-webhook-error-investigation-0024`

---

## 🎯 Problem identifiziert

### Ihre aktuelle Webhook-Konfiguration in Stripe:

```
URL: https://nest-haus.at/api/webhooks/stripe
Status: Active
Webhook Secret: ✅ Korrekt
```

### Was passiert (Test-Ergebnisse):

```bash
# ❌ Ohne www - nest-haus.at
$ curl -I https://nest-haus.at/api/webhooks/stripe
HTTP/2 301  # REDIRECT!
location: https://www.nest-haus.at/api/webhooks/stripe

# ❌ Ohne www - da-hoam.at  
$ curl -I https://da-hoam.at/api/webhooks/stripe
HTTP/2 307  # REDIRECT!
location: https://www.da-hoam.at/api/webhooks/stripe

# ✅ Mit www - beide funktionieren!
$ curl -I https://www.nest-haus.at/api/webhooks/stripe
HTTP/2 405  # Endpoint existiert!

$ curl -I https://www.da-hoam.at/api/webhooks/stripe
HTTP/2 405  # Endpoint existiert!
```

### Root Cause:

**Stripe's Sicherheitsrichtlinie:**
- ❌ Stripe folgt **NIEMALS** HTTP Redirects (301, 302, 307, 308)
- ❌ Jeder Redirect = Failed Webhook Delivery
- ❌ Nach 9 Tagen → Automatische Deaktivierung

**Warum Redirects passieren:**
- Vercel leitet automatisch non-www → www weiter
- Gut für normale Besucher
- **Katastrophal für Webhooks!**

---

## ✅ Zwei-Stufen-Lösung

### SOFORT-FIX (5 Minuten) - Stripe Dashboard

**Schritt 1: Webhook-URL ändern**

1. Gehe zu: https://dashboard.stripe.com/webhooks
2. Finde Webhook: `nest-haus.at/api/webhooks/stripe`
3. Klick auf den Webhook
4. Klick "..." → "Update details"
5. **Ändere URL:**
   ```
   Von: https://nest-haus.at/api/webhooks/stripe
   Zu:  https://www.nest-haus.at/api/webhooks/stripe
   ```
   ⚠️ **MIT www!**
6. Klick "Update endpoint"

**Schritt 2: Test senden**

1. Klick "Send test webhook"
2. Event: `payment_intent.succeeded`
3. **Erwartung:** ✅ **200 OK** (nicht mehr 301!)

**Schritt 3: Für "konzept-check" Webhook wiederholen**

Falls Sie einen separaten "konzept-check" Webhook haben:
1. Finde Webhook: "konzept-check"
2. URL ändern zu: `https://www.nest-haus.at/api/webhooks/stripe`
3. Test senden: Sollte 200 OK sein

---

### LANGFRISTIG-FIX (Automatisch nach Deploy) - Code

**Bereits implementiert in diesem Branch! ✅**

Die `vercel.json` wurde aktualisiert:

```json
{
  "redirects": [
    {
      "source": "/:path((?!api/webhooks/).*)",
      "has": [{"type": "host", "value": "nest-haus.at"}],
      "destination": "https://www.nest-haus.at/:path*",
      "permanent": true
    },
    {
      "source": "/:path((?!api/webhooks/).*)",
      "has": [{"type": "host", "value": "da-hoam.at"}],
      "destination": "https://www.da-hoam.at/:path*",
      "permanent": true
    }
  ]
}
```

**Was das macht:**
- ✅ Normale Seiten: `nest-haus.at/konfigurator` → `www.nest-haus.at/konfigurator`
- ✅ Normale Seiten: `da-hoam.at/konfigurator` → `www.da-hoam.at/konfigurator`
- ✅ **Webhooks werden NICHT weitergeleitet:**
  - `nest-haus.at/api/webhooks/stripe` → KEIN Redirect!
  - `da-hoam.at/api/webhooks/stripe` → KEIN Redirect!
- ✅ Stripe kann beide Domains verwenden

**Nach dem nächsten Deployment:**
```bash
# Beide URLs funktionieren dann!
curl -I https://nest-haus.at/api/webhooks/stripe
# Erwartung: HTTP/2 405 (kein 301 mehr!)

curl -I https://da-hoam.at/api/webhooks/stripe  
# Erwartung: HTTP/2 405 (kein 307 mehr!)
```

---

## 🔧 Environment Variables (Noch nicht gesetzt)

### Fehlende Variablen in Vercel:

Sie haben erwähnt, dass diese noch fehlen:

```bash
# 1. Cron Job Security (für Webhook Health Checks)
CRON_SECRET="<generate: openssl rand -base64 32>"

# 2. Admin Email (für Alert-E-Mails)
ADMIN_EMAIL="ihre-email@domain.com"

# Optional: Falls noch nicht gesetzt
RESEND_API_KEY="re_..."
```

**So hinzufügen:**

1. Gehe zu: https://vercel.com/[ihr-projekt]/settings/environment-variables

2. **CRON_SECRET hinzufügen:**
   ```bash
   # Lokal generieren:
   openssl rand -base64 32
   
   # Dann in Vercel:
   Name: CRON_SECRET
   Value: <generierter String>
   Environment: Production, Preview, Development
   ```

3. **ADMIN_EMAIL hinzufügen:**
   ```bash
   Name: ADMIN_EMAIL
   Value: ihre-email@domain.com
   Environment: Production, Preview, Development
   ```

4. **Nach Hinzufügen:**
   - Klick "Save"
   - **Redeploy triggern** (Environment Variables werden nur bei neuem Deploy aktiv)

**Wichtig:** Diese Variablen sind **optional** für den Webhook-Fix!
- Webhook funktioniert auch ohne sie
- Health-Check Cron-Job benötigt sie (läuft aber unabhängig)

---

## 🌐 Multi-Domain Support (da-hoam.at + nest-haus.at)

### Aktuelle Situation:

**Beide Domains funktionieren:**
- ✅ `www.nest-haus.at` → Funktioniert
- ✅ `www.da-hoam.at` → Funktioniert
- ❌ `nest-haus.at` (ohne www) → Redirect
- ❌ `da-hoam.at` (ohne www) → Redirect

### Nach Code-Deployment:

**Alle vier Varianten funktionieren:**
- ✅ `nest-haus.at/api/webhooks/stripe`
- ✅ `www.nest-haus.at/api/webhooks/stripe`
- ✅ `da-hoam.at/api/webhooks/stripe`
- ✅ `www.da-hoam.at/api/webhooks/stripe`

**Webhook-Handler verarbeitet beide Domains automatisch:**

```typescript
// src/app/api/webhooks/stripe/route.ts
export async function POST(request: NextRequest) {
    // Funktioniert unabhängig von der Domain!
    // - Payments von nest-haus.at ✅
    // - Payments von da-hoam.at ✅
    // - Payments von www.nest-haus.at ✅
    // - Payments von www.da-hoam.at ✅
    
    const inquiry = await prisma.customerInquiry.findFirst({
        where: { paymentIntentId: paymentIntent.id }
    });
    // Findet automatisch die richtige Bestellung!
}
```

**Stripe kümmert sich nicht um die Domain:**
- Payment Intent ID ist eindeutig
- Egal von welcher Domain die Zahlung kam
- Webhook findet automatisch die richtige Bestellung

---

## ⚠️ WICHTIG: Zeitliche Reihenfolge

### Sofort (JETZT):

1. **Stripe Dashboard Update (5 Min):**
   - ✅ Webhook-URL zu `www.nest-haus.at` ändern
   - ✅ Test senden: Sollte 200 OK sein
   - ✅ Ab jetzt funktionieren Webhooks wieder!

### Nach Code-Deployment:

2. **Vercel Config wird aktiv:**
   - ✅ Redirects entfernt für Webhook-URLs
   - ✅ Beide Domains (nest-haus.at + da-hoam.at) funktionieren ohne www
   - ✅ Optional: Webhook-URL in Stripe kann auf non-www geändert werden

3. **Environment Variables setzen:**
   - ✅ `CRON_SECRET` hinzufügen
   - ✅ `ADMIN_EMAIL` hinzufügen
   - ✅ Redeploy triggern

4. **Health-Check Monitoring startet:**
   - ✅ Läuft automatisch alle 6 Stunden
   - ✅ Sendet Alert-E-Mails bei Problemen
   - ✅ Frühwarnsystem für zukünftige Issues

---

## 🧪 Verifikation nach Stripe Dashboard Update

### Test 1: Webhook erreichbar

```bash
curl -I https://www.nest-haus.at/api/webhooks/stripe
# Erwartung: HTTP/2 405 (nicht 301!)
```

### Test 2: Stripe Test-Webhook

**Im Stripe Dashboard:**
1. Webhook öffnen
2. "Send test webhook"
3. Event: `payment_intent.succeeded`
4. **Erwartung:** ✅ **200 OK** (nicht 301 Moved Permanently)

### Test 3: Recent Deliveries

**In Stripe Dashboard:**
- Webhooks → [Ihr Webhook] → Recent deliveries
- **Erwartung:** Nächste Events zeigen "Success" (grün)
- Alte Failures (rot) sind History

### Test 4: Production Test

**Kleine Test-Bestellung:**
1. Gehe zu: https://www.nest-haus.at/warenkorb
2. Füge etwas hinzu
3. Checkout mit Test-Karte: `4242 4242 4242 4242`
4. Zahlung abschließen
5. **Erwartung:**
   - ✅ E-Mail-Bestätigung empfangen (innerhalb 30 Sek)
   - ✅ Admin-Benachrichtigung empfangen
   - ✅ DB-Status: "PAID"
   - ✅ Webhook-Log in Stripe: "200 OK"

---

## 🔍 Troubleshooting

### Problem: Immer noch 301 nach Stripe Update

**Symptome:**
- Stripe zeigt: "Failed delivery"
- Status: 301 Moved Permanently

**Lösung:**
- Prüfe URL in Stripe exakt: `https://www.nest-haus.at/api/webhooks/stripe`
- **Muss mit `www.` beginnen!**
- Falls ohne www: Erneut ändern

### Problem: 400 Webhook Signature Error

**Symptome:**
- Stripe zeigt: "Failed delivery"  
- Status: 400 Bad Request
- Message: "Webhook signature verification failed"

**Lösung:**
1. Stripe Dashboard → Webhooks → [Dein Webhook]
2. Unter "Signing secret": Klick "Reveal"
3. Kopiere Wert (beginnt mit `whsec_`)
4. Vercel → Settings → Environment Variables
5. Update `STRIPE_WEBHOOK_SECRET`
6. Redeploy

### Problem: Da-hoam.at Payments funktionieren nicht

**Symptome:**
- Zahlungen von da-hoam.at werden nicht verarbeitet
- Keine E-Mails
- DB-Status bleibt "PENDING"

**Ursache:**
- Webhook-URL ist für nest-haus.at
- da-hoam.at sendet auch an gleichen Webhook
- Webhook-Handler verarbeitet beide!

**Lösung:**
- ✅ Kein separater Webhook nötig
- ✅ Ein Webhook verarbeitet beide Domains
- ✅ Payment Intent ID ist eindeutig
- ✅ Funktioniert automatisch

### Problem: Health-Check sendet keine E-Mails

**Symptome:**
- Cron-Job läuft (Vercel Logs zeigen Executions)
- Aber keine Alert-E-Mails empfangen

**Ursache:**
- `CRON_SECRET` fehlt → Cron-Job wird abgelehnt (401)
- `ADMIN_EMAIL` fehlt → Keine E-Mail-Adresse
- `RESEND_API_KEY` fehlt → Kann E-Mails nicht senden

**Lösung:**
1. Environment Variables in Vercel setzen
2. Redeploy
3. Nächster Cron-Job (nach 6h) sollte funktionieren

---

## 📋 Vollständige Checkliste

### Phase 1: Sofort-Fix (JETZT - 5 Min)

- [ ] **Stripe Dashboard öffnen**
- [ ] **Webhook finden:** "nest-haus.at/api/webhooks/stripe"
- [ ] **URL ändern zu:** `https://www.nest-haus.at/api/webhooks/stripe`
- [ ] **Test senden:** Ergebnis 200 OK?
- [ ] **Falls "konzept-check" Webhook existiert:** Auch ändern!
- [ ] **Recent deliveries prüfen:** Nächste Events erfolgreich?

### Phase 2: Nach Code-Deployment (Automatisch)

- [ ] **Vercel Build erfolgreich?**
- [ ] **Test non-www URLs:**
  ```bash
  curl -I https://nest-haus.at/api/webhooks/stripe
  # Sollte 405 sein (nicht mehr 301)
  ```
- [ ] **Optional: Webhook-URL in Stripe zurück zu non-www ändern**
  - Dann funktionieren beide Varianten!

### Phase 3: Environment Variables (Optional aber empfohlen)

- [ ] **Vercel Dashboard öffnen**
- [ ] **Environment Variables:**
  - [ ] `CRON_SECRET` hinzufügen
  - [ ] `ADMIN_EMAIL` hinzufügen
  - [ ] `RESEND_API_KEY` prüfen (sollte schon existieren)
- [ ] **Redeploy triggern**
- [ ] **Nach 6h: Erste Health-Check E-Mail?**

### Phase 4: Production Validation (Nach Fix)

- [ ] **Test-Zahlung durchführen (€0.50)**
- [ ] **E-Mail empfangen?** (Kunde + Admin)
- [ ] **DB-Status korrekt?** (PAID)
- [ ] **Stripe Logs:** 200 OK?
- [ ] **Webhook Success Rate:** 100%?

---

## 🎯 Zusammenfassung

### Problem:
- ❌ Webhook-URL: `nest-haus.at` (ohne www)
- ❌ Server sendet: 301 Redirect → `www.nest-haus.at`
- ❌ Stripe folgt nicht → Alle Webhooks fehlgeschlagen
- ❌ 9 Tage Failures → Automatische Deaktivierung
- ❌ Gilt auch für da-hoam.at (307 Redirect)

### Sofort-Lösung (JETZT):
1. ✅ Stripe Dashboard → Webhook-URL ändern
2. ✅ Zu: `https://www.nest-haus.at/api/webhooks/stripe`
3. ✅ Test senden: 200 OK
4. ✅ **Webhooks funktionieren sofort wieder!**

### Langfrist-Lösung (Nach Deploy):
1. ✅ Code-Fix: Redirects für Webhooks entfernt
2. ✅ Beide Domains (nest-haus.at + da-hoam.at) funktionieren
3. ✅ Mit UND ohne www
4. ✅ Monitoring: Health-Checks alle 6h
5. ✅ Frühwarnsystem: E-Mail-Alerts bei Problemen

### Zeitaufwand:
- **Sofort-Fix:** 5 Minuten (Stripe Dashboard)
- **Code-Deployment:** Automatisch
- **Env Variables:** 5 Minuten (optional)
- **Gesamt:** 10-15 Minuten

### Ergebnis:
- ✅ Webhooks funktionieren für beide Domains
- ✅ Automatische Bestätigungen
- ✅ Proaktives Monitoring
- ✅ Nie wieder unbemerkte Webhook-Failures

---

**Status:** 🚨 **KRITISCH - Sofort Stripe Dashboard updaten!**  
**Priorität:** **HÖCHSTE** (alle Zahlungsbestätigungen betroffen)  
**Nächster Schritt:** Stripe Dashboard öffnen → URL ändern → Testen

**Nach Fix:** Alles funktioniert wieder! 🎉

---

**Erstellt:** 25. Dezember 2025  
**Branch:** cursor/stripe-webhook-error-investigation-0024  
**Deployment:** Nach Commit automatisch via Vercel

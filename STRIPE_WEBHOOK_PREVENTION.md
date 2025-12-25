# Stripe Webhook Prävention & Best Practices

**Erstellt:** 25. Dezember 2025  
**Zweck:** Zukünftige Webhook-Probleme verhindern  
**Status:** ✅ Implementiert

---

## 🎯 Übersicht

Nach dem Webhook-Ausfall vom Dezember 2025 wurden folgende Präventionsmaßnahmen implementiert:

1. ✅ **Vercel Config:** Webhook-URLs von Redirects ausgeschlossen
2. ✅ **Monitoring:** Automatische Health Checks alle 6 Stunden
3. ✅ **Alerting:** E-Mail-Benachrichtigung bei Problemen
4. ✅ **Dokumentation:** Best Practices dokumentiert

---

## 🛡️ Implementierte Lösungen

### 1. Vercel Redirect-Konfiguration

**Datei:** `vercel.json`

**Problem:** Domain-Redirects (nest-haus.at → www.nest-haus.at) verhindern Webhook-Zustellung

**Lösung:** Webhook-URLs von automatischen Redirects ausschließen

```json
{
  "redirects": [
    {
      "source": "/:path((?!api/webhooks/).*)",
      "has": [
        {
          "type": "host",
          "value": "nest-haus.at"
        }
      ],
      "destination": "https://www.nest-haus.at/:path*",
      "permanent": true
    }
  ]
}
```

**Was das macht:**
- Normale Besucher: `nest-haus.at` → `www.nest-haus.at` (weiterhin weitergeleitet)
- Webhook-URLs: `/api/webhooks/*` → **KEINE Weiterleitung**
- Stripe kann beide Domains verwenden

**Warum das wichtig ist:**
- Stripe folgt niemals 301/302 Redirects (Sicherheitsrichtlinie)
- Jeder Redirect führt zu fehlgeschlagener Webhook-Zustellung
- Nach 9 Tagen deaktiviert Stripe den Webhook automatisch

### 2. Automatisches Monitoring

**Datei:** `src/app/api/cron/check-stripe-webhook/route.ts`

**Zweck:** Frühzeitige Erkennung von Sync-Problemen

**Funktionsweise:**
1. Läuft alle 6 Stunden (konfiguriert in `vercel.json`)
2. Holt letzte 24h Zahlungen von Stripe
3. Vergleicht mit Datenbank-Status
4. Sendet E-Mail-Alert bei Diskrepanzen

**Erkannte Probleme:**
- ✅ Zahlung in Stripe erfolgreich, aber nicht in DB
- ✅ Status in DB nicht auf "PAID" aktualisiert
- ✅ Bestätigungs-E-Mails nicht gesendet
- ✅ Critical Errors im Cron-Job selbst

**Alert-E-Mail enthält:**
- Liste aller gefundenen Probleme
- Payment Intent IDs
- Status-Vergleich Stripe vs. DB
- Direkte Links zu Stripe Dashboard
- Handlungsempfehlungen

### 3. Sichere Cron-Job-Authentifizierung

**Environment Variable:** `CRON_SECRET`

**Verwendung:**
```typescript
const authHeader = request.headers.get('authorization');
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**Vercel Cron-Konfiguration:**
```json
{
  "crons": [
    {
      "path": "/api/cron/check-stripe-webhook",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

**Setup in Vercel:**
1. Gehen Sie zu: Vercel Project → Settings → Environment Variables
2. Fügen Sie hinzu: `CRON_SECRET` = `<secure-random-string>`
3. Generieren Sie sicheren String:
   ```bash
   openssl rand -base64 32
   ```

### 4. Environment Variables Update

**Datei:** `.env.local.example`

**Neue Variablen:**
```bash
# Webhook Health Check
CRON_SECRET="your-secure-cron-secret"
ADMIN_EMAIL="admin@nest-haus.at"

# Stripe Webhook (mit Warnung)
# ⚠️ IMPORTANT: Use www subdomain to avoid redirect issues!
# Create webhook at: https://www.nest-haus.at/api/webhooks/stripe
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

## 📋 Checkliste: Neue Projekte / Domain-Migration

Wenn Sie ein neues Projekt aufsetzen oder Domains migrieren:

### Vor dem Go-Live:

- [ ] **Webhook-URL prüfen:**
  - Verwendet die URL `www.` oder ohne?
  - Wird die URL weitergeleitet? (Test mit `curl -I`)
  - Stripe Dashboard entsprechend konfiguriert?

- [ ] **Vercel Config prüfen:**
  - `vercel.json` enthält Redirect-Ausschluss für `/api/webhooks/*`
  - Config deployed und aktiv?

- [ ] **Environment Variables:**
  - `STRIPE_WEBHOOK_SECRET` gesetzt?
  - `CRON_SECRET` gesetzt (für Monitoring)?
  - `ADMIN_EMAIL` gesetzt (für Alerts)?

- [ ] **Monitoring aktiv:**
  - Cron-Job für Webhook-Health-Check deployed?
  - Test-Alert gesendet und empfangen?

- [ ] **Stripe Dashboard:**
  - Webhook erstellt mit korrekter URL?
  - Alle 6 Events ausgewählt?
  - Test-Webhook gesendet: 200 OK?

### Nach dem Go-Live:

- [ ] **24h Überwachung:**
  - Erste echte Zahlung durchgeführt?
  - Webhook-Log in Stripe zeigt Success?
  - Bestätigungs-E-Mails empfangen?
  - DB-Status korrekt aktualisiert?

- [ ] **48h Monitoring:**
  - Webhook Success Rate: 100%?
  - Keine Alert-E-Mails empfangen?
  - Alle Health-Checks erfolgreich?

---

## 🧪 Testing: Webhook-Gesundheit prüfen

### Test 1: URL-Redirect prüfen

```bash
# Test ohne www
curl -I https://nest-haus.at/api/webhooks/stripe

# Erwartung für normale Seiten: HTTP/2 301 (Redirect)
# Erwartung für Webhook: HTTP/2 405 (KEIN Redirect!)
```

```bash
# Test mit www
curl -I https://www.nest-haus.at/api/webhooks/stripe

# Erwartung: HTTP/2 405 (Method Not Allowed für GET)
# Das ist korrekt - Webhook akzeptiert nur POST
```

**✅ Gut:** HTTP 405  
**⚠️ Problem:** HTTP 301 (Redirect)  
**❌ Kritisch:** HTTP 404 (Nicht gefunden)

### Test 2: POST-Request funktioniert

```bash
# Test POST (ohne Signatur)
curl -X POST https://www.nest-haus.at/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -d '{}'

# Erwartung: {"error":"No signature provided"}
# Das bedeutet: Endpoint erreichbar, erwartet Stripe-Signatur
```

**✅ Gut:** Error message über fehlende Signatur  
**❌ Problem:** Keine Response oder HTTP 500

### Test 3: Stripe Test-Webhook

**Im Stripe Dashboard:**
1. Gehen Sie zu: Developers → Webhooks
2. Klicken Sie auf Ihren Webhook
3. Klicken Sie auf "Send test webhook"
4. Wählen Sie: `payment_intent.succeeded`
5. Senden

**Erwartung:**
```
✅ 200 OK
Response received successfully
```

**Bei Fehler:**
- HTTP 301: URL-Redirect-Problem → Vercel Config prüfen
- HTTP 404: Route nicht gefunden → Deployment prüfen
- HTTP 400: Signatur-Fehler → `STRIPE_WEBHOOK_SECRET` prüfen
- HTTP 500: Server-Error → Vercel Logs prüfen

### Test 4: Health-Check Cron-Job

**Manuell triggern:**
```bash
# Lokale Entwicklung (falls lokaler Server läuft)
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  http://localhost:3000/api/cron/check-stripe-webhook

# Production
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://www.nest-haus.at/api/cron/check-stripe-webhook
```

**Erwartete Response (wenn alles gut):**
```json
{
  "status": "healthy",
  "message": "All webhooks synced correctly",
  "checkedPayments": 5,
  "timestamp": "2025-12-25T15:30:00.000Z"
}
```

**Bei Problemen:**
```json
{
  "status": "warning",
  "message": "Found 2 sync issues",
  "issues": [
    {
      "paymentIntentId": "pi_xxxxx",
      "stripeStatus": "succeeded",
      "dbStatus": "PENDING",
      "issue": "Payment succeeded in Stripe but DB status is PENDING"
    }
  ],
  "checkedPayments": 10,
  "timestamp": "2025-12-25T15:30:00.000Z"
}
```

---

## 🚨 Troubleshooting Guide

### Problem: Webhook liefert 301 Redirect

**Symptome:**
- Stripe zeigt "Failed delivery"
- HTTP Status: 301
- Location header zeigt andere URL

**Ursache:**
- Domain-Redirect in Vercel/CDN-Konfiguration
- Webhook-URL in Stripe verwendet non-www, aber Server leitet zu www weiter

**Lösung:**
1. URL in Stripe Dashboard zu `www.` ändern, ODER
2. Vercel Config anpassen (siehe Abschnitt "Vercel Redirect-Konfiguration")
3. Beide Domains ohne Redirect konfigurieren

### Problem: Webhook liefert 404

**Symptome:**
- Stripe zeigt "Failed delivery"
- HTTP Status: 404
- Message: "Not Found"

**Ursache:**
- Route nicht deployed
- Falsche URL in Stripe
- Vercel Routing-Problem

**Lösung:**
1. Prüfen Sie Deployment: Ist `src/app/api/webhooks/stripe/route.ts` deployed?
2. Prüfen Sie URL in Stripe: Exakt `https://www.nest-haus.at/api/webhooks/stripe`?
3. Testen Sie lokal: Route vorhanden?

### Problem: Webhook liefert 400 (Signature Error)

**Symptome:**
- Stripe zeigt "Failed delivery"
- HTTP Status: 400
- Message: "Webhook signature verification failed"

**Ursache:**
- `STRIPE_WEBHOOK_SECRET` falsch oder nicht gesetzt
- Webhook Secret in Stripe Dashboard ≠ Environment Variable

**Lösung:**
1. Gehen Sie zu: Stripe Dashboard → Developers → Webhooks
2. Klicken Sie auf Ihren Webhook
3. Unter "Signing secret": Klicken Sie "Reveal"
4. Kopieren Sie den Wert (beginnt mit `whsec_`)
5. Vercel: Settings → Environment Variables
6. Update `STRIPE_WEBHOOK_SECRET` mit korrektem Wert
7. Redeploy triggern (oder warten auf nächsten Deploy)

### Problem: Webhook liefert 500

**Symptome:**
- Stripe zeigt "Failed delivery"
- HTTP Status: 500
- Message: "Internal Server Error"

**Ursache:**
- Code-Fehler im Webhook-Handler
- Datenbank-Verbindungsfehler
- Missing Environment Variables

**Lösung:**
1. Vercel Logs prüfen:
   ```
   Vercel Dashboard → Logs → Filter: "Stripe Webhook"
   ```
2. Häufige Ursachen:
   - `DATABASE_URL` nicht gesetzt
   - Prisma Client nicht generiert
   - Email Service Fehler
3. Lokales Testing:
   ```bash
   npm run dev
   # Stripe CLI forwarding:
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

### Problem: Health-Check sendet ständig Alerts

**Symptome:**
- Alle 6 Stunden Alert-E-Mail
- Gleiche Probleme gemeldet
- Webhook in Stripe zeigt "Success"

**Ursache:**
- Alte Zahlungen im System (vor Webhook-Fix)
- DB-Status nicht manuell korrigiert
- Timing-Problem (Race Condition)

**Lösung:**
1. **Alte Probleme bereinigen:**
   ```sql
   -- Finde betroffene Inquiries
   SELECT id, paymentIntentId, paymentStatus, createdAt
   FROM CustomerInquiry
   WHERE paymentStatus != 'PAID'
     AND paymentIntentId IS NOT NULL;
   ```

2. **Manuell korrigieren (für bestätigte bezahlte Bestellungen):**
   ```sql
   UPDATE CustomerInquiry
   SET 
     paymentStatus = 'PAID',
     status = 'CONVERTED',
     paidAt = NOW(),
     emailsSent = true,
     emailsSentAt = NOW()
   WHERE paymentIntentId = 'pi_xxxxx';  -- Verifizierte Payment Intent
   ```

3. **Oder:** Webhook-Event in Stripe erneut senden (siehe "Alte Zahlungen prüfen")

---

## 📊 Monitoring Dashboard (Optional)

### Admin-Panel Integration

Erweitern Sie Ihr Admin-Panel mit Webhook-Health-Status:

**Neue Route:** `/admin/webhook-health`

```typescript
// src/app/admin/webhook-health/page.tsx
export default async function WebhookHealthPage() {
  // Hole letzte Health-Check Ergebnisse
  const healthStatus = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/cron/check-stripe-webhook`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET}`,
      },
    }
  ).then(r => r.json());

  // Zeige Status an
  return (
    <div>
      <h1>Stripe Webhook Health</h1>
      <div>Status: {healthStatus.status}</div>
      <div>Checked Payments: {healthStatus.checkedPayments}</div>
      <div>Timestamp: {healthStatus.timestamp}</div>
      {/* ... weitere Details ... */}
    </div>
  );
}
```

**Widget für Dashboard:**
```typescript
// Zeigt Webhook-Status direkt im Admin-Dashboard
<WebhookHealthWidget />
```

---

## 🔄 Regelmäßige Wartung

### Wöchentlich:

- [ ] Stripe Dashboard öffnen: https://dashboard.stripe.com/webhooks
- [ ] Webhook Success Rate prüfen (Ziel: >99%)
- [ ] Recent deliveries prüfen (alle grün?)
- [ ] Bei Failures: Logs prüfen und beheben

### Monatlich:

- [ ] Test-Zahlung durchführen (End-to-End Test)
- [ ] Health-Check Logs prüfen (Vercel Dashboard)
- [ ] Alert-E-Mails reviewing (wurden welche gesendet?)
- [ ] Dokumentation aktualisieren falls nötig

### Bei Domain-Änderungen:

- [ ] **SOFORT:** Webhook-URL in Stripe aktualisieren
- [ ] Vercel Config prüfen (Redirects)
- [ ] Test-Webhook senden
- [ ] 24h erhöhte Überwachung

### Bei Code-Changes (Webhook-Handler):

- [ ] Lokales Testing mit Stripe CLI
- [ ] Staging-Deployment zuerst
- [ ] Production-Deployment mit Monitoring
- [ ] Post-Deploy Test-Webhook senden

---

## 📞 Eskalation

**Level 1: Warning (automatisch gehandhabt)**
- Einzelne Webhook-Failures (<5%)
- Health-Check findet 1-2 Probleme
- **Aktion:** Automatische E-Mail an Admin

**Level 2: Alert (manuelles Eingreifen)**
- Mehrere Webhook-Failures (5-20%)
- Health-Check findet >3 Probleme
- **Aktion:** Admin prüft Logs, behebt Ursache

**Level 3: Critical (sofortiges Handeln)**
- Alle Webhooks fehlgeschlagen (>20%)
- Webhook von Stripe deaktiviert
- Payment-Flow komplett unterbrochen
- **Aktion:** Sofortige Fehleranalyse, Fix, Testing

---

## 🎓 Best Practices

### DO's:

✅ **Verwenden Sie immer die gleiche Domain für Webhooks**
   - Entscheiden Sie: `nest-haus.at` ODER `www.nest-haus.at`
   - Bleiben Sie dabei, wechseln Sie nicht

✅ **Testen Sie Webhooks nach jedem Deployment**
   - Stripe Dashboard → Send test webhook
   - 5 Minuten Zeit spart Stunden Debugging

✅ **Monitoren Sie Webhook Success Rate**
   - Ziel: 100% Success Rate
   - <99%: Sofort untersuchen

✅ **Idempotenz implementieren**
   - Stripe sendet Events mehrfach bei Retry
   - Doppelte Aktionen verhindern (z.B. doppelte E-Mails)

✅ **Logging aktivieren**
   - Jedes Webhook-Event loggen
   - Hilft bei Debugging und Audit

✅ **Timeout-Handling**
   - Webhook-Handler sollte <5 Sekunden dauern
   - Lange Operationen in Background-Jobs auslagern

### DON'Ts:

❌ **Keine Domain-Redirects für Webhooks**
   - Stripe folgt niemals Redirects
   - Führt zu garantierten Failures

❌ **Keine komplexen Operationen im Webhook**
   - Halten Sie Handler schlank
   - Heavy lifting in Queue/Background

❌ **Keine hardcodierte URLs**
   - Verwenden Sie Environment Variables
   - Erleichtert Staging/Production-Setup

❌ **Keine ignorierten Webhook-Failures**
   - Jeder Failure ist ein potentielles Problem
   - Untersuchen Sie alle Fehler

❌ **Keine fehlende Signatur-Verifikation**
   - Immer Webhook-Signatur prüfen
   - Security Best Practice

---

## 📚 Weitere Ressourcen

**Stripe Dokumentation:**
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Testing Webhooks](https://stripe.com/docs/webhooks/test)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

**Interne Dokumentation:**
- `STRIPE_WEBHOOK_ERROR_ANALYSIS.md` - Detaillierte Fehleranalyse
- `STRIPE_WEBHOOK_QUICK_FIX.md` - Sofort-Anleitung
- `WEBHOOK_VERIFICATION_GUIDE.md` - Testing Guide

**Tools:**
- [Stripe Dashboard - Webhooks](https://dashboard.stripe.com/webhooks)
- [Vercel Dashboard - Logs](https://vercel.com)
- [Stripe CLI Download](https://stripe.com/docs/stripe-cli)

---

**Erstellt:** 25. Dezember 2025  
**Letzte Aktualisierung:** 25. Dezember 2025  
**Version:** 1.0  
**Status:** ✅ Produktiv im Einsatz

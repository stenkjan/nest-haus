# 🚨 STRIPE WEBHOOK FIX - SOFORT-ANLEITUNG

**Zeitaufwand:** 5-10 Minuten  
**Schwierigkeit:** ⭐ Einfach (keine Code-Änderungen nötig)

---

## ❌ Problem

Ihr Stripe Webhook wurde nach 9 Tagen Fehlversuchen **automatisch deaktiviert**.

**Grund:** URL-Redirect von `nest-haus.at` → `www.nest-haus.at`  
**Folge:** Stripe konnte den Webhook nicht erreichen

---

## ✅ Lösung in 4 Schritten

### Schritt 1: Stripe Dashboard öffnen

🔗 Gehen Sie zu: **https://dashboard.stripe.com/webhooks**

> ⚠️ Stellen Sie sicher, dass Sie im **Live Mode** sind (nicht Test Mode)

### Schritt 2: Webhook finden und reaktivieren

1. Finden Sie den Webhook mit URL: `https://nest-haus.at/api/webhooks/stripe`
2. Status sollte **"Disabled"** oder **"Deactivated"** sein
3. Klicken Sie auf den Webhook
4. Klicken Sie auf **"Enable"** oder **"Activate"**

### Schritt 3: URL ändern

1. Klicken Sie auf **"⋯"** (drei Punkte) oder **"Update details"**
2. Ändern Sie die URL:

**ALT (funktioniert NICHT):**
```
❌ https://nest-haus.at/api/webhooks/stripe
```

**NEU (funktioniert):**
```
✅ https://www.nest-haus.at/api/webhooks/stripe
```

3. Klicken Sie auf **"Update endpoint"** oder **"Save"**

### Schritt 4: Testen

1. Klicken Sie auf **"Send test webhook"**
2. Wählen Sie Event: **`payment_intent.succeeded`**
3. Klicken Sie auf **"Send test webhook"**

**Erwartetes Ergebnis:**
```
✅ 200 OK
Response received successfully
```

---

## ✅ Fertig!

Ihr Webhook ist jetzt wieder aktiv. Zukünftige Zahlungen werden automatisch verarbeitet.

---

## 📋 Optionale Nachbearbeitung

### Alte Zahlungen prüfen (letzte 9 Tage)

Da der Webhook 9 Tage deaktiviert war, sollten Sie prüfen, ob Kunden keine Bestätigungs-E-Mails erhalten haben.

**1. Stripe Dashboard öffnen:**
- Gehen Sie zu: https://dashboard.stripe.com/payments
- Filter: "Succeeded" (erfolgreiche Zahlungen)
- Zeitraum: Letzte 9 Tage

**2. Für jede Zahlung:**
- Klicken Sie auf die Zahlung
- Gehen Sie zu: **Events and logs** (unten)
- Finden Sie das Event: `payment_intent.succeeded`
- Klicken Sie auf **"⋯"** → **"Resend webhook"**
- Der Webhook wird erneut gesendet → E-Mails werden automatisch verschickt

---

## 🔄 Zukünftige Probleme verhindern

Die folgenden Änderungen wurden bereits in den Code eingefügt:

### 1. Vercel Config aktualisiert ✅

**Datei:** `vercel.json`

- Webhook-URLs werden nun **nicht mehr weitergeleitet**
- Normale Besucher werden weiterhin zu `www.` weitergeleitet
- Stripe kann beide Domains verwenden

### 2. Monitoring eingerichtet ✅

**Neuer Cron-Job:** Prüft alle 6 Stunden die Webhook-Gesundheit

- Vergleicht Stripe-Zahlungen mit Datenbank
- Sendet automatisch E-Mail-Alert bei Problemen
- Ermöglicht frühzeitige Erkennung von Sync-Problemen

---

## 📞 Support

**Wenn nach dem Fix immer noch Probleme auftreten:**

### Prüfen Sie:

1. **Webhook Status in Stripe:**
   - https://dashboard.stripe.com/webhooks
   - Status sollte **"Enabled"** sein
   - Recent deliveries sollten **"200 OK"** zeigen

2. **Environment Variables in Vercel:**
   - https://vercel.com/[ihr-projekt]/settings/environment-variables
   - `STRIPE_WEBHOOK_SECRET` muss gesetzt sein
   - Wert sollte mit Stripe übereinstimmen

3. **Domain Setup in Vercel:**
   - https://vercel.com/[ihr-projekt]/settings/domains
   - `www.nest-haus.at` sollte aktiv sein
   - SSL sollte "Valid" sein

### Test durchführen:

```bash
# Test 1: Webhook erreichbar?
curl -I https://www.nest-haus.at/api/webhooks/stripe

# Erwartung: HTTP/2 405 (nicht 301!)
# 405 = Method Not Allowed für GET (das ist korrekt)
```

```bash
# Test 2: POST funktioniert?
curl -X POST https://www.nest-haus.at/api/webhooks/stripe

# Erwartung: {"error":"No signature provided"}
# Das bedeutet: Endpoint funktioniert, erwartet Stripe-Signatur
```

---

## 📊 Checkliste

Nach dem Fix sollten Sie folgende Ergebnisse sehen:

**In Stripe Dashboard:**
- [ ] Webhook Status: **Enabled**
- [ ] URL: `https://www.nest-haus.at/api/webhooks/stripe`
- [ ] Test webhook: **200 OK**
- [ ] Recent deliveries: **Alle grün (Success)**

**In Ihrer Anwendung:**
- [ ] Neue Zahlungen: Kunden erhalten sofort E-Mail
- [ ] Admin-Benachrichtigungen: Funktionieren
- [ ] Datenbank Status: Wird auf "PAID" aktualisiert

**Prävention:**
- [ ] Vercel Config deployed (automatisch)
- [ ] Monitoring Cron-Job aktiv (automatisch nach Deploy)
- [ ] Dokumentation aktualisiert ✅

---

## 📚 Weitere Informationen

**Detaillierte Analyse:**
- Siehe: `STRIPE_WEBHOOK_ERROR_ANALYSIS.md`

**Stripe Dokumentation:**
- Webhooks: https://stripe.com/docs/webhooks
- Testing: https://stripe.com/docs/webhooks/test
- Best Practices: https://stripe.com/docs/webhooks/best-practices

---

**Erstellt:** 25. Dezember 2025  
**Priorität:** 🚨 Kritisch  
**Status:** ✅ Lösung implementiert

# DNS TXT Records Setup für Google Verification

## Problem

Du versuchst TXT-Records in Hetzner hinzuzufügen, aber deine Nameserver zeigen auf Vercel.
**Ergebnis:** Hetzner DNS-Einträge werden nicht gelesen!

## Lösung: TXT-Records in Vercel hinzufügen

### Option 1: Vercel Dashboard (UI)

1. **Gehe zu:** https://vercel.com/dashboard
2. **Wähle dein Projekt:** nest-haus
3. **Gehe zu:** Settings → Domains
4. **Klicke auf deine Domain:** nest-haus.at
5. **Suche nach:** "DNS Records" oder "Edit DNS"
6. **Füge TXT-Record hinzu:**
   - Type: TXT
   - Name: @ (oder leer für root domain)
   - Value: `google-site-verification=Ty1KSFyrmPZ6UQoyX_6R9_W_gyFVNwd_pf8V-zk1ksl`

### Option 2: Vercel CLI

```bash
# TXT Record für Google Site Verification hinzufügen
vercel dns add nest-haus.at @ TXT "google-site-verification=Ty1KSFyrmPZ6UQoyX_6R9_W_gyFVNwd_pf8V-zk1ksl"

# SPF Record hinzufügen (für Email)
vercel dns add nest-haus.at @ TXT "v=spf1 +a +mx ?all"
```

### Option 3: vercel.json (Im Projekt)

```json
{
  "dns": [
    {
      "type": "TXT",
      "name": "@",
      "value": "google-site-verification=Ty1KSFyrmPZ6UQoyX_6R9_W_gyFVNwd_pf8V-zk1ksl"
    },
    {
      "type": "TXT", 
      "name": "@",
      "value": "v=spf1 +a +mx ?all"
    }
  ]
}
```

## Für Google Workspace Verification

Wenn du Google Workspace für `nest-haus.at` verifizieren willst:

1. **TXT-Record in Vercel hinzufügen** (wie oben)
2. **In Google Workspace Admin:**
   - Gehe zu: Domains → Manage domains
   - Klicke auf "Verify"
   - Wähle "TXT record" Methode
   - Kopiere den Verification Code
3. **Warte 10-15 Minuten** für DNS-Propagation
4. **Klicke in Google Workspace auf "Verify"**

## DNS-Einträge prüfen

```bash
# Prüfe, ob TXT-Record aktiv ist:
nslookup -type=TXT nest-haus.at

# Oder mit dig (Linux/Mac):
dig TXT nest-haus.at

# Windows PowerShell:
Resolve-DnsName -Name nest-haus.at -Type TXT
```

## Warum Hetzner DNS-Einträge nicht funktionieren

```
Domain: nest-haus.at
  ↓
Nameserver zeigen auf: ns1.vercel-dns.com, ns2.vercel-dns.com
  ↓
DNS-Anfragen gehen zu: Vercel DNS
  ↓
Hetzner DNS-Zone: WIRD IGNORIERT ❌
Vercel DNS-Zone: WIRD VERWENDET ✅
```

## Zusammenfassung

| Wo eintragen? | Funktioniert? | Warum? |
|---------------|---------------|--------|
| **Hetzner DNS** | ❌ Nein | Nameserver zeigen auf Vercel |
| **Vercel DNS** | ✅ Ja | Nameserver zeigen auf Vercel |

## Nächste Schritte

1. ✅ Lösche die Einträge in Hetzner (optional, sie werden eh ignoriert)
2. ✅ Füge die TXT-Records in Vercel hinzu
3. ✅ Warte 10-15 Minuten
4. ✅ Prüfe mit `nslookup -type=TXT nest-haus.at`
5. ✅ Verifiziere in Google Workspace


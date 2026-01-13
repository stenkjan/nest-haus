# Noch zu erledigende Aufgaben - Einfache Checkliste

**Stand:** 12. Januar 2026  
**Geschätzte Gesamtdauer:** 60-70 Stunden

---

## Google Konfiguration (4 Stunden) - KRITISCH FÜR ADS

- GA4 Events als Conversions markieren (30 Min)
  - Login: analytics.google.com
  - Configure → Events → Markieren:
    - `purchase`
    - `generate_lead`
    - `begin_checkout`
    - `config_complete`

- Custom Dimensions in GA4 erstellen (20 Min)
  - Event-scoped: `house_model`, `has_house_configuration`, `house_intent_value`
  - User-scoped: `traffic_source_detailed`

- Google Signals aktivieren (10 Min)
  - Admin → Data Settings → "Google signals" aktivieren

- Google Search Console (15 Min)
  - Domain verifizieren
  - Verification Code in .env.local
  - Sitemap einreichen

- Google Ads Konto (2 Stunden)
  - Konto erstellen
  - Billing hinterlegen
  - Conversions von GA4 importieren
  - Remarketing Audiences erstellen
  - Ads ID in .env.local (`NEXT_PUBLIC_GOOGLE_ADS_ID`)

- UTM Parameter Audit (30 Min)
  - Facebook/Instagram Ads überprüfen
  - UTM Parameter hinzufügen wenn fehlend

---

## Testing & Qualitätssicherung (25 Stunden)

- Unit Tests für neue Features schreiben (8-10 Std)
  - Analytics Tracking Tests
  - Form Tracking Tests
  - Scroll Tracking Tests
  - A/B Testing Tests

- Integration Tests (6-8 Std)
  - Campaign Analytics API Tests
  - Conversion Tracking Tests
  - Admin Dashboard Tests

- End-to-End Tests (6-7 Std)
  - Facebook → Conversion Flow
  - Google Ads → Conversion Flow
  - Mobile Social Media Flow

- Test Coverage erhöhen (3-4 Std)
  - Aktuell: ~60%
  - Ziel: >85%
  - Fehlende Tests identifizieren und schreiben

---

## Code Qualitätsaudit (15 Stunden)

- Dependency Update Audit (3-4 Std)
  - `npx npm-check-updates` ausführen
  - Changelogs für Breaking Changes checken
  - Updates testen
  - Dependencies aktualisieren

- Next.js 15 Best Practices Review (3-4 Std)
  - Alle Pages auf proper Metadata prüfen
  - Loading.tsx für Suspense Boundaries hinzufügen
  - Error.tsx für Error Boundaries hinzufügen
  - Server vs Client Components optimieren

- React 19 Optimierungen (2-3 Std)
  - React.memo() für teure Komponenten
  - useMemo/useCallback wo sinnvoll
  - use() Hook für Data Fetching erwägen
  - useOptimistic für Formulare

- TypeScript Strict Mode Audit (2-3 Std)
  - Nach `any` Types suchen und eliminieren
  - Nach `@ts-ignore` suchen und begründen
  - Return Types zu Public Functions hinzufügen
  - Generics wo sinnvoll verwenden

- Bundle Size Optimierung (3-4 Std)
  - Bundle Analyzer Report generieren
  - Heavy Components lazy loaden
  - Unused Dependencies entfernen
  - Code Splitting optimieren
  - Ziel: Main Bundle < 150KB

---

## Performance Optimierung (8 Stunden)

- Lighthouse Audit (2 Std)
  - Alle Hauptseiten testen
  - Performance Score Ziel: >90
  - Best Practices Score: >90
  - SEO Score: >95
  - Probleme fixen

- Core Web Vitals (3 Std)
  - LCP optimieren: <2.5s
  - INP optimieren: <200ms
  - CLS fixen: <0.1
  - TTFB verbessern: <800ms

- Image Optimierung Review (2 Std)
  - Alle Bilder auf Größe prüfen
  - WebP/AVIF Konvertierung verifizieren
  - Lazy Loading korrekt implementiert
  - Placeholder Images optimieren

- API Response Time Optimierung (1 Std)
  - Langsame Endpoints identifizieren
  - Database Queries optimieren
  - Caching wo möglich
  - Ziel: <200ms average

---

## Sicherheitsaudit (6-8 Stunden)

- Vulnerability Scan (2 Std)
  - `npm audit` ausführen und fixen
  - Outdated Packages mit Security Issues updaten
  - Audit Report dokumentieren

- Security Best Practices (2-3 Std)
  - Environment Variables Audit
  - API Security Review (CSRF, XSS, SQL Injection)
  - Session Security überprüfen
  - Data Protection Audit (GDPR)

- Penetration Testing (2-3 Std)
  - SQL Injection Versuche
  - XSS Versuche
  - CSRF Tests
  - Rate Limiting Tests
  - Admin Panel Security
  - Findings dokumentieren

---

## Accessibility Audit (4 Stunden)

- Automated Testing (1 Std)
  - axe DevTools ausführen
  - Lighthouse Accessibility Score
  - WAVE Tool verwenden

- Manual Testing (2 Std)
  - Keyboard Navigation testen
  - Screen Reader Testing (NVDA)
  - Color Contrast prüfen
  - ARIA Labels überprüfen

- Fixes Implementieren (1 Std)
  - Issues nach Priorität fixen
  - Re-testen
  - Ziel: Score >90

---

## Dokumentation (10 Stunden)

- API Dokumentation (4-5 Std)
  - `docs/API_REFERENCE.md` erstellen
  - Alle 20+ Endpoints dokumentieren
  - Request/Response Schemas
  - Beispiele für jeden Endpoint

- Component Library Dokumentation (2-3 Std)
  - `docs/COMPONENT_LIBRARY.md` erstellen
  - Alle wiederverwendbaren Components
  - Props Documentation
  - Usage Examples

- Deployment Runbook (1-2 Std)
  - `docs/DEPLOYMENT_RUNBOOK.md` erstellen
  - Pre-Deployment Checklist
  - Deployment Steps
  - Rollback Procedure
  - Post-Deployment Verification

- Troubleshooting Playbook (1-2 Std)
  - `docs/TROUBLESHOOTING_PLAYBOOK.md`
  - Häufige Probleme
  - Lösungsschritte
  - Debugging Guide

- Developer Onboarding (1-2 Std)
  - `docs/DEVELOPER_ONBOARDING.md`
  - Setup Anleitung
  - Codebase Tour
  - Common Tasks Guide

---

## Monitoring & Observability (8 Stunden)

- Error Tracking Setup (3-4 Std)
  - Sentry installieren: `npm install @sentry/nextjs`
  - Konfigurieren für Next.js
  - Error boundaries integrieren
  - Alerts einrichten
  - Oder: Custom Error Logging System bauen

- Performance Monitoring (2-3 Std)
  - WebVitals Component re-enablen
  - Performance Dashboard in Admin erstellen
  - Database Query Performance Tracking
  - API Response Time Monitoring

- Uptime Monitoring (1 Std)
  - UptimeRobot Account erstellen (gratis)
  - Monitors konfigurieren:
    - Homepage
    - /konfigurator
    - /api/health (neu erstellen)
    - /admin
  - Email/Slack Alerts setup

- Admin Monitoring Dashboard (2 Std)
  - Error Rate Dashboard
  - Performance Metrics Dashboard
  - System Health Overview

---

## Backup & Recovery (4 Stunden)

- Database Backup Automation (2 Std)
  - Backup Script schreiben
  - Vercel Cron Job konfigurieren
  - Test Backup/Restore Prozedur

- Configuration Backup (1 Std)
  - Alle Environment Variables dokumentieren
  - Vercel Settings dokumentieren
  - Google Setups dokumentieren
  - DNS Records dokumentieren

- Recovery Procedure (1 Std)
  - Step-by-Step Recovery Guide
  - Disaster Recovery Plan
  - Kontaktpersonen definieren

---

## CI/CD Pipeline (6 Stunden)

- GitHub Actions Quality Gates (4 Std)
  - `.github/workflows/quality-check.yml` erstellen
  - Lint Check
  - Type Check
  - Test Run
  - Build Check
  - Bundle Size Check

- Automated Testing (2 Std)
  - Tests in CI ausführen
  - Coverage Reports generieren
  - PR Checks konfigurieren

---

## Langfristige Wartung

### Wöchentlich (1-2 Std/Woche)
- Error Logs Review
- Core Web Vitals Check
- GA4 Realtime Anomalien
- Database Performance
- API Response Times

### Monatlich (4-6 Std/Monat)
- `npm audit` und Fixes
- Dependency Updates
- Bundle Size Review
- GA4 Monthly Report
- Usability Audit Dashboard Review
- Conversion Rate Trends

### Quartalsweise (2-3 Tage/Quartal)
- Dependency Major Updates
- Full Performance Audit
- Security Penetration Test
- Code Quality Review
- Documentation Update
- Team Retrospektive

---

## Priorisierung

### 🔴 KRITISCH (Vor Production Launch)
1. Google Konfiguration (4 Std) - **MUSS vor Ads Launch**
2. Security Audit (6-8 Std) - **Sicherheit**
3. Error Monitoring Setup (3-4 Std) - **Production Issues erkennen**
4. Critical Tests (10-12 Std) - **Payment, Conversion Flows**

### 🟠 HOCH (Erste Woche Production)
5. Performance Optimierung (8 Std)
6. Uptime Monitoring (1 Std)
7. Backup Procedures (4 Std)
8. API Dokumentation (4-5 Std)

### 🟡 MITTEL (Erster Monat)
9. Vollständige Test Coverage (15 Std)
10. Deployment Runbook (1-2 Std)
11. CI/CD Pipeline (6 Std)
12. Accessibility Audit (4 Std)

### 🟢 NIEDRIG (Kann später)
13. Component Library Docs (2-3 Std)
14. Developer Onboarding (1-2 Std)
15. Architecture Decision Records (2-3 Std)

---

## Geschätzte Gesamtdauer

**Minimum (Production Ready):** 40-45 Stunden
- Google Config: 4h
- Critical Testing: 12h
- Security: 8h
- Monitoring: 8h
- Performance: 8h
- Basic Docs: 5h

**Recommended (High Quality):** 60-70 Stunden
- Alle oben + vollständige Tests
- + vollständige Dokumentation
- + CI/CD Pipeline
- + Accessibility

**Ideal (Enterprise Grade):** 80-90 Stunden
- Alle Recommended Tasks
- + Advanced Monitoring
- + Comprehensive Training Materials
- + Long-term Maintenance Setup

---

## ✅ Sofort-Checkliste (Nächste 48 Stunden)

- [ ] Google Ads Konfiguration abschließen (4 Std)
- [ ] npm audit ausführen und Critical Fixes (1 Std)
- [ ] Lighthouse Audit aller Hauptseiten (1 Std)
- [ ] Sentry Setup für Error Tracking (2 Std)
- [ ] Payment Flow End-to-End Test (2 Std)
- [ ] Deployment Runbook erstellen (1 Std)
- [ ] Production Deployment

**Nach diesen 11 Stunden:** Website ist production-ready und Ads können starten! 🚀

---

_Vollständige Details: docs/FINAL_QUALITY_MAINTENANCE_PLAN.md_

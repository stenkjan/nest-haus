# Konfigurator Pricing System - Complete Guide

**Date**: November 11, 2025  
**For**: Understanding how prices from Google Sheets are used in the Konfigurator

---

## 📊 Overview

The Konfigurator displays prices from the **Google Sheets "Preistabelle_Verkauf"** tab. This document explains exactly how each price is read, stored, and calculated.

---

## 🔢 Price Format in Google Sheets

### **Important: Thousands Format**

Prices in the sheet use **German thousands format** with a decimal point:

- `188.619` = 188,619€ (one hundred eighty-eight thousand)
- `23.020` = 23,020€ (twenty-three thousand)
- `4.115` = 4,115€ (four thousand)

**Exception**: Small numbers (≥500) are NOT multiplied:

- `887` = 887€ (eight hundred eighty-seven euros)
- `1.500` = 1,500€ (fifteen hundred)

### **Parsing Rules**

```typescript
// Numbers < 500 → multiply by 1000 (thousands format)
188.619 → 188,619€
23.020 → 23,020€
4.115 → 4,115€

// Numbers ≥ 500 → use as-is
887 → 887€
1.500 → 1,500€
```

---

## 📐 Column Layout

**Nest Sizes** are always in these columns:

- **Column F** (index 5): Nest 80
- **Column H** (index 7): Nest 100
- **Column J** (index 9): Nest 120
- **Column L** (index 11): Nest 140
- **Column N** (index 13): Nest 160

---

## 🏗️ Section-by-Section Pricing

### 1️⃣ **Nest (Wie groß)**

**Sheet Location**: Rows 11-12

| Cell | Nest Size | Price (Row 11)     | m² (Row 12) |
| ---- | --------- | ------------------ | ----------- |
| F11  | Nest 80   | 188.619 → 188,619€ | 75          |
| H11  | Nest 100  | 226.108 → 226,108€ | 95          |
| J11  | Nest 120  | 263.597 → 263,597€ | 115         |
| L11  | Nest 140  | 301.086 → 301,086€ | 135         |
| N11  | Nest 160  | 338.575 → 338,575€ | 155         |

**Display in Konfigurator**:

```
Nest 80: "Ab 188,619€"
         "entspricht 2,515€/m²"  (188,619 / 75)
```

**Important**: This is the **RAW CONSTRUCTION PRICE ONLY**. Does NOT include:

- Gebäudehülle (exterior material)
- Innenverkleidung (interior material)
- Bodenbelag (flooring)

---

### 2️⃣ **Geschossdecke**

**Sheet Location**: Row 7

| Cell | Description            | Value          |
| ---- | ---------------------- | -------------- |
| D7   | Base price per unit    | 4.115 → 4,115€ |
| F7   | Max units for Nest 80  | 3              |
| H7   | Max units for Nest 100 | 4              |
| J7   | Max units for Nest 120 | 5              |
| L7   | Max units for Nest 140 | 6              |
| N7   | Max units for Nest 160 | 7              |

**Calculation**:

```
Total Price = Base Price × Quantity
            = 4,115€ × quantity (1-7 depending on nest size)

Price per m² = 4,115€ / 6.5m² = 633€/m²
```

**Display in Konfigurator**:

```
"Ab 4,115€"
"entspricht 633€/m²"

(Quantity picker shows 0-3 for Nest 80, 0-7 for Nest 160, etc.)
```

---

### 3️⃣ **Gebäudehülle (Exterior Material)**

**Sheet Location**: Rows 17-20

| Material              | Nest 80 (F)      | Nest 100 (H)     | Nest 120 (J)     | Nest 140 (L)     | Nest 160 (N)     |
| --------------------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Lärche (row 17)       | 24.413 → 24,413€ | 28.623 → 28,623€ | 32.833 → 32,833€ | 37.043 → 37,043€ | 41.253 → 41,253€ |
| Trapezblech (row 18)  | 0€               | 0€               | 0€               | 0€               | 0€               |
| Platte Black (row 19) | 36.011 → 36,011€ | 42.221 → 42,221€ | 48.431 → 48,431€ | 54.641 → 54,641€ | 60.851 → 60,851€ |
| Platte White (row 20) | 36.011 → 36,011€ | 42.221 → 42,221€ | 48.431 → 48,431€ | 54.641 → 54,641€ | 60.851 → 60,851€ |

**Calculation** (Relative Pricing):

```
Base Option: Trapezblech = 0€ (shows as "Inkludiert")

Other Options: Price - Trapezblech Price
  Lärche:       24,413€ - 0€ = +24,413€
  Platte Black: 36,011€ - 0€ = +36,011€
```

**Display in Konfigurator** (Nest 80):

```
Trapezblech:     "Inkludiert" (selected by default)
Lärche:          "+24,413€"
Platte Black:    "+36,011€"
Platte White:    "+36,011€" (same price as Black → shows "+/-")
```

---

### 4️⃣ **Innenverkleidung (Interior Material)**

**Sheet Location**: Rows 24-26

| Material | Nest 80 (F24)    | Nest 100 (H24)   | Nest 120 (J24)   | Nest 140 (L24)   | Nest 160 (N24)   |
| -------- | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Fichte   | 23.020 → 23,020€ | 27.312 → 27,312€ | 31.604 → 31,604€ | 35.895 → 35,895€ | 40.187 → 40,187€ |
| Lärche   | 31.921 → 31,921€ | 37.805 → 37,805€ | 43.689 → 43,689€ | 49.573 → 49,573€ | 55.457 → 55,457€ |
| Eiche    | 37.235 → 37,235€ | 44.450 → 44,450€ | 51.665 → 51,665€ | 58.880 → 58,880€ | 66.095 → 66,095€ |

**CRITICAL**: ALL Innenverkleidung options have ABSOLUTE prices (NOT relative to 0€)!

**Calculation** (Relative Display Only):

```
Fichte is the STANDARD option (preselected)

When Fichte is selected:
  Fichte:  23,020€ (shows actual price)
  Lärche:  31,921€ - 23,020€ = +8,901€
  Eiche:   37,235€ - 23,020€ = +14,215€

When Lärche is selected:
  Fichte:  23,020€ - 31,921€ = -8,901€
  Lärche:  31,921€ (shows actual price)
  Eiche:   37,235€ - 31,921€ = +5,314€
```

**Display in Konfigurator** (Nest 80, Fichte preselected):

```
Fichte: "23,020€"  ← NEVER shows "Inkludiert"!
Lärche: "+8,901€"
Eiche:  "+14,215€"
```

---

### 5️⃣ **PV-Anlage (Solar Panels)**

**Sheet Location**: Rows 29-44 (Quantities 1-16)

**Important**: PV prices are the SAME for all nest sizes!

| Quantity  | Price (F29-F44)  | Notes  |
| --------- | ---------------- | ------ |
| 1 Module  | 3.934 → 3,934€   | Row 29 |
| 2 Module  | 6.052 → 6,052€   | Row 30 |
| 3 Module  | 8.169 → 8,169€   | Row 31 |
| ...       | ...              | ...    |
| 16 Module | 39.539 → 39,539€ | Row 44 |

**Max Modules by Nest Size**:

- Nest 80: 8 modules
- Nest 100: 10 modules
- Nest 120: 12 modules
- Nest 140: 14 modules
- Nest 160: 16 modules

**Calculation**:

```
Price = pricesByQuantity[nestSize][quantity]

Example (Nest 80, 4 modules):
  Total: 10,286€
  Per panel: 10,286€ / 4 = 2,571€
```

**Display in Konfigurator**:

```
"Ab 10,286€"
"entspricht 2,571€ / Panel"
```

---

### 6️⃣ **Bodenbelag (Flooring)**

**Sheet Location**: Rows 50-53

| Material           | Nest 80 (F)      | Nest 100 (H)     | Nest 120 (J)     | Nest 140 (L)     | Nest 160 (N)     |
| ------------------ | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Bauherr (Standard) | 0€               | 0€               | 0€               | 0€               | 0€               |
| Eiche              | 20.531 → 20,531€ | 26.371 → 26,371€ | 32.211 → 32,211€ | 38.051 → 38,051€ | 43.891 → 43,891€ |
| Kalkstein          | 29.239 → 29,239€ | 37.256 → 37,256€ | 45.273 → 45,273€ | 53.290 → 53,290€ | 61.307 → 61,307€ |
| Dunkler Stein      | 29.239 → 29,239€ | 37.256 → 37,256€ | 45.273 → 45,273€ | 53.290 → 53,290€ | 61.307 → 61,307€ |

**Calculation** (Relative Pricing):

```
Base Option: Bauherr = 0€ (shows as "Inkludiert")

Other Options: Price - Bauherr Price
  Eiche:         20,531€ - 0€ = +20,531€
  Kalkstein:     29,239€ - 0€ = +29,239€
```

---

### 7️⃣ **Bodenaufbau / Heizung (Heating System)**

**Sheet Location**: Rows 60-62

| System             | Nest 80 (F)      | Nest 100 (H)     | Nest 120 (J)     | Nest 140 (L)     | Nest 160 (N)     |
| ------------------ | ---------------- | ---------------- | ---------------- | ---------------- | ---------------- |
| Ohne Heizung       | 0€               | 0€               | 0€               | 0€               | 0€               |
| Elektrische FBH    | 10.842 → 10,842€ | 13.552 → 13,552€ | 16.263 → 16,263€ | 18.973 → 18,973€ | 21.684 → 21,684€ |
| Wassergeführte FBH | 13.486 → 13,486€ | 16.857 → 16,857€ | 20.228 → 20,228€ | 23.600 → 23,600€ | 26.971 → 26,971€ |

**Calculation** (Relative Pricing):

```
Base Option: Ohne Heizung = 0€

Relative Prices:
  Elektrische FBH: 10,842€ - 0€ = +10,842€
  Wassergeführte: 13,486€ - 0€ = +13,486€
```

---

### 8️⃣ **Belichtungspaket & Fenster (Windows & Light)**

**Sheet Location**: Rows 70-78 (Combined pricing)

**Structure**:

- Row 70: Holz + Light
- Row 71: Holz + Medium
- Row 72: Holz + Bright
- Row 73: Holz-Alu + Light
- Row 74: Holz-Alu + Medium
- Row 75: Holz-Alu + Bright
- Row 76: Kunststoff + Light
- Row 77: Kunststoff + Medium
- Row 78: Kunststoff + Bright

**Example (Nest 80)**:

| Combination         | Cell | Price            |
| ------------------- | ---- | ---------------- |
| Holz + Light        | F70  | 21.378 → 21,378€ |
| Holz + Medium       | F71  | 39.250 → 39,250€ |
| Holz + Bright       | F72  | 55.527 → 55,527€ |
| Kunststoff + Light  | F76  | 15.107 → 15,107€ |
| Kunststoff + Medium | F77  | 24.196 → 24,196€ |
| Kunststoff + Bright | F78  | 31.765 → 31,765€ |

**Calculation**:

```
Total Price = fenster.totalPrices[fensterType][nestSize][belichtungType]

Price per m² = Total Price / Nutzfläche

Nutzfläche = (NestSize - 5) + (Geschossdecke Qty × 6.5)

Example (Nest 80, no Geschossdecke, Kunststoff, Light):
  Total: 15,107€
  Nutzfläche: 80 - 5 = 75m²
  Per m²: 15,107€ / 75 = 201€/m²
```

**Display in Konfigurator**:

```
Belichtungspaket Light: "21,378€" (shows total)
Fenster Kunststoff: "201€/m²" (shows per m²)
```

---

### 9️⃣ **Optionen (Additional Options)**

#### **Kaminschacht** (Chimney)

**Sheet Location**: Around row 80-83 (exact row varies)

```
Price: 887€ (NOT in thousands format!)
```

**Display**: Fixed price `887€` for all nest sizes

#### **Fundament** (Foundation)

**Sheet Location**: Row 83

| Nest Size | Cell | Price            |
| --------- | ---- | ---------------- |
| Nest 80   | F83  | 15.480 → 15,480€ |
| Nest 100  | H83  | 19.350 → 19,350€ |
| Nest 120  | J83  | 23.220 → 23,220€ |
| Nest 140  | L83  | 27.090 → 27,090€ |
| Nest 160  | N83  | 30.960 → 30,960€ |

---

### 🔟 **Planungspakete (Planning Packages)**

**Sheet Location**: Rows 88-90

| Package | Cell | Price            | Notes                   |
| ------- | ---- | ---------------- | ----------------------- |
| Basis   | F88  | 0€               | Always 0 (Inkludiert)   |
| Plus    | F89  | 9.600 → 9,600€   | Same for all nest sizes |
| Pro     | F90  | 12.700 → 12,700€ | Same for all nest sizes |

**Important**: Prices are the SAME for all nest sizes (only use column F)

**Display**:

```
Basis: "Inkludiert"
Plus:  "9,600€"
Pro:   "12,700€"
```

---

## 💰 Total Price Calculation

### **Formula**:

```
TOTAL PRICE =
  Nest Base Price (row 11)
  + Gebäudehülle (relative to Trapezblech)
  + Innenverkleidung (ABSOLUTE price)
  + Bodenbelag (relative to Bauherr)
  + Bodenaufbau (relative to Ohne Heizung)
  + Geschossdecke (4,115€ × quantity)
  + PV-Anlage (from quantity table)
  + Belichtungspaket + Fenster (combined price from rows 70-78)
  + Optionen (Kaminschacht 887€, Fundament from row 83)
  + Planungspaket (0€ / 9,600€ / 12,700€)
```

### **Example Calculation (Nest 80 minimum)**:

```
Nest 80 base:           188,619€ (F11)
+ Trapezblech:              0€ (included)
+ Fichte:              23,020€ (F24 - ABSOLUTE!)
+ Bauherr flooring:         0€ (included)
+ Ohne Heizung:             0€ (included)
+ Geschossdecke:            0€ (none selected)
+ PV-Anlage:                0€ (none selected)
+ Belichtung+Fenster:       0€ (counted separately)
+ Kaminschacht:             0€ (optional)
+ Fundament:                0€ (optional)
+ Planungspaket Basis:      0€ (included)
─────────────────────────────────
MINIMUM TOTAL:        211,639€
```

### **Example (Nest 80 with upgrades)**:

```
Nest 80 base:           188,619€
+ Lärche exterior:      24,413€ (upgrade from Trapezblech)
+ Lärche interior:      31,921€ (ABSOLUTE, not relative!)
+ Eiche flooring:       20,531€ (upgrade from Bauherr)
+ Elektrische FBH:      10,842€ (upgrade from Ohne Heizung)
+ Geschossdecke (2×):    8,230€ (4,115€ × 2)
+ PV 8 Module:          20,572€ (from row 36)
+ Belichtung+Fenster:   31,765€ (Kunststoff + Bright, F78)
+ Kaminschacht:            887€
+ Fundament:            15,480€ (F83)
+ Planungspaket Plus:    9,600€ (F89)
─────────────────────────────────
TOTAL:                 362,860€
```

---

## 🔧 Special Rules

### **1. UTF-8 Character Mapping**

Sheet may contain: `Lärche` (with ä)  
Mapped to ID: `laerche` (without ä)

### **2. Numbers ≥500 Are Never Multiplied**

- `887` → stays `887€`
- `1.500` → stays `1,500€`
- Numbers < 500 → multiply by 1000

### **3. Relative vs. Absolute Pricing**

**Relative (shown as +/-):**

- Gebäudehülle (base: Trapezblech)
- Bodenbelag (base: Bauherr)
- Bodenaufbau (base: Ohne Heizung)

**Absolute (shown as actual €):**

- Nest base price
- **Innenverkleidung** (even Fichte shows 23,020€!)
- PV-Anlage
- Geschossdecke
- Planungspakete
- Optionen

### **4. Per m² Calculation**

```
Adjusted Nutzfläche = (Nest Size - 5) + (Geschossdecke Qty × 6.5)

Example (Nest 100 + 2 Geschossdecken):
  = (100 - 5) + (2 × 6.5)
  = 95 + 13
  = 108m²
```

---

## 📝 Summary for Non-Technical Users

**To update prices**:

1. Edit the Google Sheet "Preistabelle_Verkauf"
2. Use German thousands format (188.619 = 188,619€)
3. Numbers ≥500 stay as-is (887 = 887€)
4. Save the sheet
5. Run sync: `POST /api/admin/sync-pricing?password=...`
6. Prices update automatically in Konfigurator

**The Konfigurator will**:

- Read ALL prices from your sheet
- Calculate totals correctly
- Show relative pricing (+/-) where appropriate
- Display per m² prices automatically
- Handle all nest size variations

**NO CODE CHANGES NEEDED** to update prices - just edit the sheet! ✅

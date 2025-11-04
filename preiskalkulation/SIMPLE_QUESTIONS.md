# 🎯 NEW PRICING STRUCTURE - Simple Questions

**Based on:** Existing Preiskalkulation.xlsx (27 combinations, 9 add-ons)  
**Goal:** Understand what NEW items from Angebot PDF need to be added and how prices are calculated

---

## ✅ CURRENT STATE (What We Have)

### **27 Material Combinations:**
- 3 Gebäudehülle × 3 Innenverkleidung × 3 Fussboden
- Price range: €155,500 - €207,800
- Formula: `Base Price (Nest 80) + (Additional Modules × Per Module Price)`

### **9 Add-Ons:**
- PV Panele: €390
- Fenster (4 materials): €280-700 per m²
- Planungspaket (3 levels): €8,900-18,900
- Grundstückscheck: €490

### **Missing from Excel (but in code):**
- Ohne Belag (no flooring)
- Bodenaufbau (heating systems)
- Fundament
- Geschossdecke
- Belichtungspaket percentages
- Stirnseite areas
- Kamindurchzug

---

## 📄 SECTION 1: ANGEBOT PDF CONTENT

### **Q1.1: What NEW items are in the Angebot that aren't in Preiskalkulation.xlsx?**

Please list in this format:

```
NEW ITEM 1: _______________
Price: €_____
Unit: per module / per m² / per unit / fixed
How it scales: with nest size / fixed / depends on ___

NEW ITEM 2: _______________
Price: €_____
Unit: ___
How it scales: ___

(continue for all new items)
```

### **Q1.2: Are there any REMOVED items?**

Items in Preiskalkulation.xlsx but NOT in Angebot:

```
REMOVED: _______________
REMOVED: _______________
```

### **Q1.3: Have any PRICES CHANGED significantly?**

From existing items:

```
ITEM: Trapezblech combinations
Old: €155,500 - €171,400
New: €_____ - €_____
Change: ____%

ITEM: PV Panele
Old: €390
New: €_____
Change: ____%

(continue for major changes > 10%)
```

---

## 🏗️ SECTION 2: MISSING COMPONENTS (Must Add)

### **Q2.1: Ohne Belag (No Flooring)**

Is this in the new Angebot?

```
☐ YES - Add to price list
  → Trapezblech + Kiefer + ohne_belag
     Base: €_____
     Per Module: €_____
  
  → Trapezblech + Fichte + ohne_belag
     Base: €_____
     Per Module: €_____
  
  → Trapezblech + Eiche + ohne_belag
     Base: €_____
     Per Module: €_____
  
  (repeat for Holzlattung and Holzverbundplatten...)

☐ NO - Not offered in new pricing
  → Should we keep it from old calculations?
```

### **Q2.2: Bodenaufbau (Heating Systems)**

Current code has:
- Ohne Heizung: €0
- Elektrische Fußbodenheizung: €5,000 base + 25% per module
- Wassergeführte: €7,500 base + 25% per module

**In Angebot:**

```
Elektrische Fußbodenheizung:
  Nest 80: €_____
  Nest 100: €_____
  Nest 120: €_____
  Nest 140: €_____
  Nest 160: €_____
  
  Formula: _______________ (e.g., base × modules, or different?)

Wassergeführte Fußbodenheizung:
  Nest 80: €_____
  Nest 100: €_____
  Nest 120: €_____
  Nest 140: €_____
  Nest 160: €_____
  
  Formula: _______________
```

### **Q2.3: Fundament (Foundation)**

Current code: €5,000 base + 25% per module

**In Angebot:**

```
Fundament:
  Nest 80: €_____
  Nest 100: €_____
  Nest 120: €_____
  Nest 140: €_____
  Nest 160: €_____
  
  Formula: _______________
```

### **Q2.4: Geschossdecke (Intermediate Floors)**

Current code: €5,000 base + 25% per module × quantity

**In Angebot:**

```
Geschossdecke (per unit):
  Nest 80: €_____
  Nest 100: €_____
  Nest 120: €_____
  Nest 140: €_____
  Nest 160: €_____
  
  Formula: _______________
  Max quantity per nest size: _______________
```

### **Q2.5: Kamindurchzug (Chimney Passage)**

Current code: Fixed price (not specified in old Excel)

**In Angebot:**

```
Kamindurchzug:
  Price: €_____
  Unit: fixed / per module / other ___
```

### **Q2.6: Belichtungspaket (Glazing Package)**

Current code: `nest_size_m² × percentage × fenster_material_price`

**In Angebot:**

```
Light (12%):
  Is this percentage correct? ☐ Yes ☐ No, new: ___%
  Formula: _______________
  Example (Nest 80 + PVC): €_____

Medium (16%):
  Is this percentage correct? ☐ Yes ☐ No, new: ___%
  Formula: _______________
  Example (Nest 80 + PVC): €_____

Bright (22%):
  Is this percentage correct? ☐ Yes ☐ No, new: ___%
  Formula: _______________
  Example (Nest 80 + PVC): €_____
```

### **Q2.7: Stirnseite Verglasung (Front Glazing)**

Current code areas:
- Verglasung Oben: 8 m²
- Einfache Schiebetür: 8.5 m²
- Doppelte Schiebetür: 17 m²
- Vollverglasung: 25 m²

**In Angebot:**

```
Are these areas correct?
☐ Yes, keep as is
☐ No, new areas:
  
  Verglasung Oben: ___ m²
  Einfache Schiebetür: ___ m²
  Doppelte Schiebetür: ___ m²
  Vollverglasung: ___ m²

Formula still: area × fenster_material_price?
☐ Yes
☐ No, new formula: _______________
```

---

## 🔢 SECTION 3: CALCULATION LOGIC

### **Q3.1: Base Module Formula**

Is the formula still the same?

```
Current: Total = Base Price (Nest 80) + ((Modules - 1) × Per Module Price)

New formula:
☐ Same as current
☐ Changed to: _______________

Example calculation for Nest 120 (6 modules), Trapezblech, Kiefer, Parkett:
  Old: €155,500 + (5 × €33,600) = €323,500
  New: €_____  calculation: _______________
```

### **Q3.2: Nest Module Count**

Are these correct?

```
Nest 80 (75m²): 4 modules ☐ correct ☐ changed to: ___
Nest 100 (95m²): 5 modules ☐ correct ☐ changed to: ___
Nest 120 (115m²): 6 modules ☐ correct ☐ changed to: ___
Nest 140 (135m²): 7 modules ☐ correct ☐ changed to: ___
Nest 160 (155m²): 8 modules ☐ correct ☐ changed to: ___
```

### **Q3.3: Material Upgrade Display**

When user is on "Trapezblech + Kiefer + Parkett" and views "Holzlattung":

```
Current display: Shows price difference (+€9,600 for Nest 80)
New display should:
☐ Same - show upgrade from current selection
☐ Show absolute price for that combination
☐ Show price per module
☐ Other: _______________
```

### **Q3.4: Dependent Pricing**

Which selections influence OTHER selection prices?

```
Nest Size influences:
☐ Base module price
☐ Heating systems
☐ Fundament
☐ Geschossdecke
☐ Belichtungspaket
☐ Other: _______________

Fenster Material influences:
☐ Belichtungspaket
☐ Stirnseite
☐ Other: _______________

Gebäudehülle influences:
☐ Only base price
☐ Also affects: _______________

Innenverkleidung influences:
☐ Only base price
☐ Also affects: _______________

Fussboden influences:
☐ Only base price
☐ Also affects: _______________
```

---

## 📊 SECTION 4: PRICE SORTING (from Angebot)

### **Please copy ALL items from Angebot sorted by price (highest first):**

```
Format: Item Name | €Price | Unit | Notes

1. _________________ | €_____ | per ___ | ___
2. _________________ | €_____ | per ___ | ___
3. _________________ | €_____ | per ___ | ___
4. _________________ | €_____ | per ___ | ___
5. _________________ | €_____ | per ___ | ___
6. _________________ | €_____ | per ___ | ___
7. _________________ | €_____ | per ___ | ___
8. _________________ | €_____ | per ___ | ___
9. _________________ | €_____ | per ___ | ___
10. ________________ | €_____ | per ___ | ___

(continue with all items...)
```

---

## 🎯 SECTION 5: KEY CHANGES SUMMARY

### **Q5.1: What are the TOP 3 biggest changes from old to new pricing?**

```
1. _______________________________________________
   Impact: _______________
   
2. _______________________________________________
   Impact: _______________
   
3. _______________________________________________
   Impact: _______________
```

### **Q5.2: Which formulas/calculations changed?**

```
Changed Formula 1: _______________
  Old: _______________
  New: _______________
  
Changed Formula 2: _______________
  Old: _______________
  New: _______________
```

### **Q5.3: Are there new dependencies between selections?**

```
Example: "If Holzverbundplatten selected, must use Aluminium Fenster"

New Rule 1: _______________________________________________
New Rule 2: _______________________________________________
New Rule 3: _______________________________________________
```

---

## ⚡ SECTION 6: QUICK ANSWERS (If short on time)

### **Minimum info needed to update configurator:**

```
1. NEW ITEMS to add (list):
   _______________
   _______________
   _______________

2. REMOVED ITEMS (list):
   _______________
   _______________

3. MAJOR PRICE CHANGES (> 20%):
   _______________: was €___ now €___ (___%)
   _______________: was €___ now €___ (___%)

4. FORMULA CHANGES:
   ☐ Base formula unchanged
   ☐ Base formula changed to: _______________
   
   ☐ Size-dependent formula unchanged (25% per module)
   ☐ Changed to: _______________

5. NEW DEPENDENCIES:
   ☐ None
   ☐ Yes: _______________
```

---

## 📁 HOW TO FILL THIS OUT

### **Option A: Have the PDF/Excel?**

Open the Angebot PDF and book5.xlsx side by side and fill in the blanks directly.

### **Option B: Can't access files right now?**

Just paste the raw content from Angebot here (even messy), and I'll parse it:

```
[Paste Angebot content here - any format is fine]
```

### **Option C: Share the files?**

Upload to /workspace/preiskalkulation/ and I'll extract everything automatically.

---

**FOCUS: I only need to know:**
1. What's NEW (that wasn't in Preiskalkulation.xlsx)
2. What changed price/formula
3. What items are missing (like "ohne_belag", heating, etc.)

Everything else can stay the same! 🚀

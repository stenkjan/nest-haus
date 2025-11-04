# 🎯 New Pricing Logic - Questionnaire for Configurator Update

**Goal:** Understand how to calculate prices for each selection in the configurator based on the new producer pricing.

**Focus:** What selections influence other selections' prices, and what price displays when.

---

## 📋 SECTION 1: ANGEBOT PDF - PRICE LIST EXTRACTION

### **Question 1.1: Base Module Pricing Structure**

From the Angebot PDF, what is the pricing structure for the base house module?

```
Option A: Fixed price per nest size (e.g., Nest 80 = €X, Nest 100 = €Y)
Option B: Base price + per-module calculation
Option C: Price per m² × total area
Option D: Something else (please explain)
```

**Your Answer:** _____________

---

### **Question 1.2: Material Combinations**

In the Angebot PDF, how are material combinations priced?

```
Option A: Each combination has its own total price
Option B: Base price + material upgrades (e.g., Kiefer +€0, Eiche +€X)
Option C: Individual material prices that add together
Option D: Percentage-based upgrades from base
```

**Your Answer:** _____________

**Follow-up:** Are all combinations available, or only specific ones?
- [ ] All combinations possible (Gebäudehülle × Innenverkleidung × Fussboden)
- [ ] Only specific combinations offered

---

### **Question 1.3: Price List Format**

Please extract from the Angebot PDF and list in this format:

```
| Item/Component | Price | Unit | Notes |
|----------------|-------|------|-------|
| [Example: Nest 80 Base] | €XXX | per unit | |
| [Trapezblech] | €XXX | per module / included / per m² | |
| [Kiefer Innenverkleidung] | €XXX | per module / included / per m² | |
| ... | ... | ... | ... |
```

**Please provide the complete list sorted by:**
1. Base modules first
2. Then materials (Gebäudehülle, Innenverkleidung, Fussboden)
3. Then add-ons (Windows, PV, etc.)
4. Then services (Planning, Grundstückscheck)

---

## 📊 SECTION 2: BOOK5 CALCULATION SHEET - FORMULA LOGIC

### **Question 2.1: Calculation Method**

In the book5 Excel sheet, what formula is used to calculate the total price?

```
Example formats:
A. =Base_Price + (Modules × Per_Module_Price) + Add_Ons
B. =Nest_Size_m2 × Price_Per_m2 + Material_Upgrades
C. =SUM(Multiple_Line_Items)
D. Something else
```

**Your Answer:** _____________

**Follow-up:** Can you share the actual Excel formula(s) from key cells?

---

### **Question 2.2: Size Dependency**

Which components in book5 scale with nest size?

Check all that apply:
- [ ] Base module price
- [ ] Gebäudehülle
- [ ] Innenverkleidung  
- [ ] Fussboden
- [ ] Windows/glazing
- [ ] Heating systems
- [ ] Fundament
- [ ] PV panels
- [ ] Other: _____________

**For each checked item, what's the scaling formula?**

---

### **Question 2.3: Material Upgrade Logic**

How does book5 calculate material upgrades?

For example, if base is "Trapezblech + Kiefer + Parkett":

```
Scenario 1: User upgrades to Eiche Innenverkleidung
Current logic shows: +€X
New logic should show: ____________

Scenario 2: User upgrades to Holzlattung Gebäudehülle
Current logic shows: +€Y
New logic should show: ____________

Scenario 3: User adds Kalkstein Fussboden
Current logic shows: +€Z
New logic should show: ____________
```

**Question:** Do upgrade prices depend on the nest size?
- [ ] Yes, upgrades scale with size
- [ ] No, upgrades are fixed amounts
- [ ] Some upgrades scale, others don't (please specify which)

---

## 🪟 SECTION 3: DEPENDENT PRICING (Key Question!)

### **Question 3.1: Window Material Impact**

In the NEW pricing, does the window material choice affect other prices?

Currently: Window material affects Belichtungspaket and Stirnseite prices.

```
New logic:
When user selects "PVC Fenster" (€280/m²):
- Belichtungspaket Light calculation: _____________
- Belichtungspaket Medium calculation: _____________
- Belichtungspaket Bright calculation: _____________
- Stirnseite Verglasung calculation: _____________

When user selects "Aluminium Fenster" (€700/m²):
- Belichtungspaket Light calculation: _____________
- Belichtungspaket Medium calculation: _____________
- Belichtungspaket Bright calculation: _____________
- Stirnseite Verglasung calculation: _____________
```

**Question:** Are these calculations the same as before, or changed?

---

### **Question 3.2: Nest Size Impact**

Which components should show different prices based on nest size?

For **Nest 80** vs **Nest 160**:

```
Component: Elektrische Fußbodenheizung
Nest 80 price: _____________
Nest 160 price: _____________
Formula: _____________

Component: Belichtungspaket Medium
Nest 80 price: _____________
Nest 160 price: _____________
Formula: _____________

Component: Geschossdecke (1 unit)
Nest 80 price: _____________
Nest 160 price: _____________
Formula: _____________
```

---

### **Question 3.3: Cross-Dependencies**

Are there any NEW dependencies in the pricing?

```
Example: "If user selects Holzverbundplatten, then Fenster must be Aluminium"
or: "Stirnseite Vollverglasung only available with Nest 120+"

Please list any NEW rules:
1. _____________
2. _____________
3. _____________
```

---

## 🧮 SECTION 4: SPECIFIC COMPONENT PRICING

### **Question 4.1: Belichtungspaket (Glazing Package)**

What is the NEW pricing structure for Belichtungspaket?

```
Current formula: nest_size_m² × percentage × fenster_material_price_per_m²

Light (12%):
- Calculation method: _____________
- Example for Nest 80 + PVC: _____________

Medium (16%):
- Calculation method: _____________
- Example for Nest 80 + PVC: _____________

Bright (22%):
- Calculation method: _____________
- Example for Nest 80 + PVC: _____________
```

**Is this formula still correct, or changed?**

---

### **Question 4.2: Stirnseite Verglasung**

What is the NEW pricing for front glazing options?

```
Current areas:
- Verglasung Oben: 8 m²
- Einfache Schiebetür: 8.5 m²
- Doppelte Schiebetür: 17 m²
- Vollverglasung: 25 m²

Formula: area × fenster_material_price

Are these areas still correct? _____________
Is the formula still correct? _____________

If changed, new pricing:
- Verglasung Oben: _____________
- Einfache Schiebetür: _____________
- Doppelte Schiebetür: _____________
- Vollverglasung: _____________
```

---

### **Question 4.3: Heating Systems (Bodenaufbau)**

What is the NEW pricing for heating systems?

```
Current:
- Ohne Heizung: €0
- Elektrische Fußbodenheizung: €5,000 base (Nest 80) + 25% per module
- Wassergeführte Fußbodenheizung: €7,500 base + 25% per module

New pricing from book5/Angebot:
- Ohne Heizung: _____________
- Elektrische: _____________
- Wassergeführte: _____________

Formula: _____________
```

---

### **Question 4.4: PV-Anlage**

What is the NEW pricing for solar panels?

```
Current: €390 per panel (quantity-based)

New from Angebot:
- Price per panel: _____________
- Or different structure: _____________
- Maximum panels per nest size: _____________
```

---

### **Question 4.5: Planungspaket**

What is the NEW pricing for planning packages?

```
Current:
- Basis: €8,900 (€0 in code - "inkludiert")
- Plus: €13,900
- Pro: €18,900

New from Angebot:
- Basis: _____________
- Plus: _____________
- Pro: _____________

Are these fixed prices, or do they scale with nest size? _____________
```

---

### **Question 4.6: Geschossdecke (Intermediate Floors)**

What is the NEW pricing for intermediate floors?

```
Current: €5,000 base × (1 + 0.25 × additional_modules) × quantity

New pricing:
- Formula: _____________
- Example for Nest 80 (1 unit): _____________
- Example for Nest 160 (2 units): _____________
- Maximum units per nest size: _____________
```

---

### **Question 4.7: Fundament**

What is the NEW pricing for foundation?

```
Current: €5,000 base × (1 + 0.25 × additional_modules)

New pricing:
- Formula: _____________
- Example for Nest 80: _____________
- Example for Nest 160: _____________
```

---

### **Question 4.8: Other Components**

Any NEW components in the Angebot not in the current configurator?

```
New Component 1: _____________
Price: _____________
Calculation: _____________

New Component 2: _____________
Price: _____________
Calculation: _____________
```

---

## 🎯 SECTION 5: CONFIGURATOR DISPLAY LOGIC

### **Question 5.1: When to Show Upgrade Prices**

Currently, the configurator shows:
- "Inkludiert" (included) for base options
- "+€X" for upgrades
- "€Y/Monat" for monthly payment

Should this change with the new pricing?

```
Example: User is on Nest 80, Trapezblech, Kiefer, Parkett

When viewing Eiche option, should show:
Option A: "+€X" (upgrade from current selection)
Option B: "€Y" (absolute price for this option)
Option C: Something else: _____________

When viewing Holzlattung option, should show:
Option A: "+€X" (upgrade from Trapezblech)
Option B: "€Y" (absolute price)
Option C: Something else: _____________
```

---

### **Question 5.2: Base Configuration**

What should be considered the "base" configuration for calculating upgrades?

```
Current assumption: Trapezblech + Kiefer + Parkett

New base: _____________

Or: Should each material type have its own base?
- [ ] Yes, each Gebäudehülle has its own base combination
- [ ] No, single base configuration for all
```

---

### **Question 5.3: Price Visibility**

Are there any options that should NOT show individual prices?

```
Example: Should "Fussboden ohne Belag" show:
Option A: "Inkludiert" (no additional cost)
Option B: "-€X" (reduction from base)
Option C: "€0" (explicit zero)

For material upgrades that scale with size:
Should the displayed price be for:
Option A: Currently selected nest size
Option B: Base nest size (Nest 80) with note
Option C: Show price range (€X - €Y)
```

---

## 📝 SECTION 6: MISSING INFORMATION

### **Question 6.1: Ohne Belag (No Flooring)**

The current Excel sheet has no "ohne Belag" combinations.

```
In the new Angebot/book5, is "ohne Belag" included?
- [ ] Yes, with prices: _____________
- [ ] No, not offered anymore
- [ ] Should use base price minus flooring cost

If yes, what's the price structure:
- Trapezblech + Kiefer + ohne_belag: _____________
- Trapezblech + Fichte + ohne_belag: _____________
- Trapezblech + Eiche + ohne_belag: _____________
- (etc. for all combinations)
```

---

### **Question 6.2: Fassadenplatten Colors**

The code has black and white Fassadenplatten, Excel has "Holzverbundplatten".

```
In the new Angebot, are these:
- [ ] Same product, different names
- [ ] Different products, different prices
- [ ] Only one color available

Pricing:
- Fassadenplatten Schwarz: _____________
- Fassadenplatten Weiss: _____________
- Or single "Holzverbundplatten": _____________
```

---

## 🔄 SECTION 7: FORMULA SUMMARY

Once you answer the above, please provide a summary:

### **Base Calculation Formula**

```
Total Price = _____________________________________________
```

### **Example Calculation**

```
Configuration: Nest 100, Holzlattung, Fichte, Kalkstein, PVC Fenster, 
               Belichtungspaket Medium, Stirnseite Doppelte Schiebetür,
               Elektrische Heizung, 1 Geschossdecke, Planung Plus

Step 1 (Base Module): _____________
Step 2 (Material Upgrades): _____________
Step 3 (Windows/Glazing): _____________
Step 4 (Heating): _____________
Step 5 (Geschossdecke): _____________
Step 6 (Planning): _____________
────────────────────────────────────────
TOTAL: _____________
```

---

## 🚀 NEXT STEPS

Once you complete this questionnaire, I will:

1. ✅ Update the `PriceCalculator.ts` with the new formulas
2. ✅ Adjust the `configurator.ts` constants
3. ✅ Modify the selection display logic
4. ✅ Update the price breakdown calculations
5. ✅ Test all combinations
6. ✅ Generate a migration plan

**Please fill in as many sections as you can from the Angebot PDF and book5 Excel sheet!**

The more detail you provide, the more accurately I can update the configurator pricing logic.

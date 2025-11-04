# 🎯 SIMPLE APPROACH: What I Need to Update the Configurator Pricing

---

## 📝 The Essential Questions

I need to understand **3 core things** from your producer pricing:

### **1. How is the BASE PRICE calculated?**

Fill in ONE of these:

```
Option A - Modular System:
   Base (Nest 80) = €_______
   Each additional module = €_______
   Formula: Base + (Modules - 1) × Per-Module
   
Option B - Per Square Meter:
   Price per m² = €_______
   Formula: Size_in_m² × Price
   
Option C - Fixed Per Size:
   Nest 80 = €_______
   Nest 100 = €_______
   Nest 120 = €_______
   Nest 140 = €_______
   Nest 160 = €_______
   
Option D - Something Else:
   Explain: _________________
```

---

### **2. How do MATERIALS affect the price?**

For each material type, tell me:

#### **Gebäudehülle (Exterior):**
```
Trapezblech: 
   □ Included in base
   □ Adds €_______ (fixed)
   □ Adds €_______ per module
   □ Other: _______

Holzlattung:
   □ Included in base
   □ Adds €_______ (fixed)
   □ Adds €_______ per module
   □ Other: _______

Fassadenplatten:
   □ Included in base
   □ Adds €_______ (fixed)
   □ Adds €_______ per module
   □ Other: _______
```

#### **Innenverkleidung (Interior):**
```
Kiefer:
   □ Included in base
   □ Adds €_______ (fixed)
   □ Adds €_______ per module

Fichte:
   □ Included in base
   □ Adds €_______ (fixed)
   □ Adds €_______ per module

Eiche:
   □ Included in base
   □ Adds €_______ (fixed)
   □ Adds €_______ per module
```

#### **Fussboden (Flooring):**
```
Parkett:
   □ Included in base
   □ Adds €_______ (fixed)
   □ Adds €_______ per module

Kalkstein:
   □ Included in base
   □ Adds €_______ (fixed)
   □ Adds €_______ per module

Schiefer:
   □ Included in base
   □ Adds €_______ (fixed)
   □ Adds €_______ per module

Ohne Belag:
   □ Included in base
   □ Reduces €_______ (saves money)
   □ Not offered
```

---

### **3. How do ADD-ONS work?**

#### **Window Material (affects glazing prices):**
```
PVC: €_______ per m²
Holz: €_______ per m²
Eiche: €_______ per m²
Aluminium: €_______ per m²
```

#### **Belichtungspaket:**
```
Does the formula STILL work this way?
   Price = Nest_Size_m² × Percentage × Window_Material_Price

   □ Yes, same formula
   □ No, new formula: _________________

Percentages:
   Light: _____%
   Medium: _____%
   Bright: _____%
```

#### **Stirnseite (Front Glazing):**
```
Does the formula STILL work this way?
   Price = Area_m² × Window_Material_Price

   □ Yes, same formula
   □ No, new formula: _________________

Areas:
   Verglasung Oben: _____ m²
   Einfache Schiebetür: _____ m²
   Doppelte Schiebetür: _____ m²
   Vollverglasung: _____ m²
```

#### **Heating (Bodenaufbau):**
```
Elektrische Fußbodenheizung:
   Nest 80: €_______
   Nest 160: €_______
   OR Formula: _________________

Wassergeführte Fußbodenheizung:
   Nest 80: €_______
   Nest 160: €_______
   OR Formula: _________________
```

#### **Fundament:**
```
Nest 80: €_______
Nest 160: €_______
OR Formula: _________________
```

#### **Geschossdecke:**
```
Price for 1 unit:
   Nest 80: €_______
   Nest 160: €_______
OR Formula: _________________
```

#### **PV-Anlage:**
```
€_______ per panel
OR €_______ per kWp
```

#### **Planungspaket:**
```
Basis: €_______ (or included)
Plus: €_______
Pro: €_______
```

#### **Other:**
```
Grundstückscheck: €_______
Kamindurchzug: €_______
Any new items: _________________
```

---

## 🎯 The ONLY Thing That Matters

**I need to know:**

1. What price to show for **each option** when the user hovers/selects it
2. How that price **changes** based on:
   - Current nest size
   - Current material selections
   - Current add-on selections

**Example scenario:**

```
User state:
- Nest 100 selected
- Trapezblech + Kiefer + Parkett selected
- PVC Fenster selected

User hovers over "Eiche" option:
   Should show: "+€_______"
   
User hovers over "Holzlattung" option:
   Should show: "+€_______"

User hovers over "Belichtungspaket Medium":
   Should show: "€_______"

User changes to Nest 120:
   Belichtungspaket Medium price changes to: "€_______"
```

---

## 📋 SIMPLIFIED DATA REQUEST

**Just give me this table filled out:**

### **Complete Configurations (Examples)**

Calculate a few full examples so I can reverse-engineer the formula:

```
Example 1:
Nest 80 + Trapezblech + Kiefer + Parkett
= €_______

Example 2:
Nest 80 + Trapezblech + Kiefer + Kalkstein
= €_______

Example 3:
Nest 80 + Trapezblech + Eiche + Parkett
= €_______

Example 4:
Nest 80 + Holzlattung + Kiefer + Parkett
= €_______

Example 5:
Nest 100 + Trapezblech + Kiefer + Parkett
= €_______

Example 6:
Nest 120 + Holzlattung + Eiche + Kalkstein
= €_______

Example 7:
Nest 100 + Trapezblech + Kiefer + Parkett + Belichtungspaket Medium + PVC Fenster
= €_______

Example 8:
Nest 120 + Holzlattung + Eiche + Parkett + Elektrische Heizung + 1 Geschossdecke
= €_______
```

**With these examples, I can determine:**
- Base pricing formula
- Material upgrade logic
- Size scaling factors
- Add-on calculations

---

## ✅ Next Steps

Once you provide the above information, I will:

1. **Update `PriceCalculator.ts`** with new formulas
2. **Update `configurator.ts`** with new prices
3. **Test** all combinations
4. **Show you** a before/after comparison
5. **Deploy** the changes

**That's it!** No complex questionnaire needed if you just give me:
- A few example full calculations
- The window material prices (affects glazing)
- Any formula changes

🚀 **Ready when you are!**

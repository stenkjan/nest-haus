# Hoam-House Pricing Structure Analysis
## Current vs. Producer Pricing Mapping

**Generated:** 2025-11-04  
**Status:** Awaiting producer pricing files (Angebot_-_15014024.pdf, book5.xlsx)

---

## 📊 Current Configurator Pricing Structure

### **Base Module Combinations (27 total)**

Our configurator uses a **modular pricing formula**:
```
Total Price = Base Price (Nest 80) + (Additional Modules × Per-Module Price)
```

#### **Price Categories:**

| Gebäudehülle | Innenverkleidung | Fussboden | Count | Price Range |
|--------------|------------------|-----------|-------|-------------|
| Trapezblech | Kiefer, Fichte, Eiche | 3 floors | 9 | €155,500 - €171,400 |
| Holzlattung Laerche | Kiefer, Fichte, Eiche | 3 floors | 9 | €165,100 - €181,000 |
| Holzverbundplatten | Kiefer, Fichte, Eiche | 3 floors | 9 | €191,900 - €207,800 |

**Fussboden Types:**
- Fischgraetparkett Eiche
- Kalkstein
- Feinsteinzeug Schiefer

**Missing Combinations:**
- ⚠️ **"ohne_belag"** (without flooring) - currently uses hardcoded logic in `configurator.ts` but NOT in Excel sheet
- This suggests the Excel sheet is incomplete or we need to add "ohne_belag" entries

---

## 🔧 Add-On Components (Current Pricing)

| Component | Current Price | Unit | Type |
|-----------|--------------|------|------|
| **PV-Anlage** | €390 | per panel | Quantity-based |
| **Fenster PVC** | €280 | per m² | Material |
| **Fenster Fichte** | €400 | per m² | Material |
| **Fenster Eiche** | €550 | per m² | Material |
| **Fenster ALU** | €700 | per m² | Material |
| **Planung Basis** | €8,900 | fixed | Planning package |
| **Planung Plus** | €13,900 | fixed | Planning package |
| **Planung Pro** | €18,900 | fixed | Planning package |
| **Grundstückscheck** | €490 | fixed | Service |

**⚠️ Discrepancy Found:**
- Excel shows Grundstückscheck: €490
- Code has: €1,000 (with comment "was 3000, now 1000 with 50% discount")
- **Action needed:** Clarify which is correct

---

## 🧮 Size-Dependent Pricing (Not in Excel)

These are defined in code (`SIZE_DEPENDENT_BASE_PRICES`) but **NOT in the Excel sheet**:

| Component | Base (Nest 80) | Scaling | Formula |
|-----------|----------------|---------|---------|
| Elektrische Fußbodenheizung | €5,000 | +25% per module | `base * (1 + 0.25 * additional_modules)` |
| Wassergeführte Fußbodenheizung | €7,500 | +25% per module | `base * (1 + 0.25 * additional_modules)` |
| Fundament | €5,000 | +25% per module | `base * (1 + 0.25 * additional_modules)` |
| Geschossdecke | €5,000 | +25% per module × qty | `base * (1 + 0.25 * additional_modules) * quantity` |

**⚠️ Missing from Excel:** These prices need to be added to the producer price list.

---

## 📐 Percentage-Based Pricing (Belichtungspaket)

**Formula:** `nest_size_m² × percentage × fenster_material_price_per_m²`

| Package | Percentage | Example (Nest 80, PVC) |
|---------|-----------|------------------------|
| Light | 12% | 80m² × 0.12 × €280 = €2,688 |
| Medium | 16% | 80m² × 0.16 × €280 = €3,584 |
| Bright | 22% | 80m² × 0.22 × €280 = €4,928 |

**Dynamic Factors:**
1. Nest size (80-160m²)
2. Fenster material price (€280-€700/m²)

**⚠️ Missing from Excel:** Belichtungspaket logic needs to be documented for producer.

---

## 🪟 Stirnseite Verglasung Pricing

**Formula:** `area_m² × fenster_material_price_per_m²`

| Option | Area (m²) | Example (PVC €280/m²) |
|--------|-----------|----------------------|
| Verglasung Oben | 8 m² | €2,240 |
| Einfache Schiebetür | 8.5 m² | €2,380 |
| Doppelte Schiebetür | 17 m² | €4,760 |
| Vollverglasung | 25 m² | €7,000 |

**⚠️ Missing from Excel:** Stirnseite areas need to be in price list.

---

## 🔍 Configurator vs. Excel Mapping Issues

### **1. Naming Discrepancies**

| Configurator Code | Excel Name | Status |
|-------------------|------------|--------|
| `trapezblech` | Trapezblech | ✅ Match |
| `holzlattung` | Holzlattung Laerche | ⚠️ Needs clarification |
| `fassadenplatten_schwarz` | Holzverbundplatten | ❌ **MISMATCH** |
| `fassadenplatten_weiss` | *(missing)* | ❌ **NOT IN EXCEL** |
| `kiefer` | Kiefer | ✅ Match |
| `fichte` | Fichte | ✅ Match |
| `steirische_eiche` | Eiche | ⚠️ Needs clarification |
| `parkett` | Fischgraetparkett Eiche | ⚠️ Needs clarification |
| `kalkstein_kanafar` | Kalkstein | ⚠️ Needs clarification |
| `schiefer_massiv` | Feinsteinzeug Schiefer | ⚠️ Needs clarification |
| `ohne_belag` | *(missing)* | ❌ **NOT IN EXCEL** |

### **2. Major Issues to Resolve**

#### **Issue #1: Fassadenplatten = Holzverbundplatten?**
- Code has: `fassadenplatten_schwarz` and `fassadenplatten_weiss`
- Excel has: `Holzverbundplatten` (no color distinction)
- **Question:** Are black and white panels the same price?

#### **Issue #2: Missing "ohne_belag" in Excel**
- Code has logic for flooring without covering
- Excel only has 3 flooring options (parkett, kalkstein, schiefer)
- **Action:** Add "ohne_belag" combinations to price list

#### **Issue #3: Add-Ons Not Comprehensive**
- Missing: Bodenaufbau (heating systems)
- Missing: Fundament
- Missing: Geschossdecke
- Missing: Kamindurchzug
- Missing: Belichtungspaket percentages
- Missing: Stirnseite areas

---

## 🎯 Recommendations for Producer Price List

### **Required Structure:**

#### **1. Base Module Pricing Tab**
```
Columns:
- Gebäudehülle (exact name as in configurator)
- Innenverkleidung (exact name as in configurator)
- Fussboden (exact name as in configurator)
- Base Price (Nest 80, 4 modules)
- Per Module Price (for Nest 100+)
```

#### **2. Fenster Materials Tab**
```
Columns:
- Material (PVC, Holz, Eiche, Aluminium Schwarz, Aluminium Weiss)
- Price per m²
- Notes
```

#### **3. Size-Dependent Components Tab**
```
Columns:
- Component Name
- Base Price (Nest 80)
- Scaling Factor (e.g., 0.25 = 25% per module)
- Max Quantity (for geschossdecke)
```

#### **4. Fixed Add-Ons Tab**
```
Columns:
- Component Name
- Price
- Unit
- Notes
```

#### **5. Percentage-Based Components Tab**
```
Columns:
- Component (Belichtungspaket)
- Option (Light/Medium/Bright)
- Percentage (12%/16%/22%)
- Calculation Method
```

#### **6. Area-Based Components Tab**
```
Columns:
- Component (Stirnseite)
- Option
- Area (m²)
- Calculation Method (area × fenster_material_price)
```

---

## 📋 Questions for Producer Price List Review

When you receive the producer pricing, check for:

1. **Base Pricing:**
   - [ ] All 3 Gebäudehülle types covered?
   - [ ] All 3 Innenverkleidung types covered?
   - [ ] All 4 Fussboden types covered (including ohne_belag)?
   - [ ] Price difference between Fassadenplatten colors?

2. **Module Scaling:**
   - [ ] Is the per-module price increase consistent?
   - [ ] Does it follow the formula: Base + (modules - 1) × PerModulePrice?
   - [ ] Are there different rates for different combinations?

3. **Fenster Materials:**
   - [ ] Prices per m² for all 5 materials?
   - [ ] Any volume discounts?

4. **Size-Dependent Options:**
   - [ ] Heating system base prices + scaling?
   - [ ] Fundament pricing + scaling?
   - [ ] Geschossdecke pricing + scaling?

5. **New Components:**
   - [ ] Any new options not in current configurator?
   - [ ] Any removed options?
   - [ ] Price changes > 20% (flag for review)?

---

## 🚀 Next Steps

1. **Upload Files:**
   ```bash
   # Place in /workspace/preiskalkulation/
   - Angebot_-_15014024.pdf
   - book5.xlsx
   ```

2. **Run Analysis:**
   ```bash
   cd /workspace/preiskalkulation
   python3 analyze_new_pricing.py
   ```

3. **Review Output:**
   - `pricing_comparison_report.json` - Detailed comparison
   - `google_sheets_pricing_template.json` - Import template

4. **Validate Mappings:**
   - Check all component names match
   - Verify formulas are correct
   - Test with sample configurations

5. **Implement Sync:**
   - Create Google Sheet with structure
   - Set up automated sync (using existing GoogleDriveSync infrastructure)
   - Deploy to configurator

---

## 📞 Contact

For questions about this analysis or the pricing structure:
- Review the generated JSON files
- Check `/workspace/preiskalkulation/` for all outputs
- Run `python3 analyze_new_pricing.py` after uploading producer files

**Status:** Awaiting producer pricing documents for full comparison.

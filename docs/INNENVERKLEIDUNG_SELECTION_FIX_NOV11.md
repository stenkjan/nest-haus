# Critical Fix: Use Actual Innenverkleidung Selection - November 11, 2025

## 🐛 Critical Bug

**Issue**: The price calculation for `gebaeudehuelle` and `fussboden` options was **always using "fichte"** as the innenverkleidung, regardless of what the user actually selected.

**Impact**: 
- ❌ Incorrect prices shown when user selects Lärche or Eiche
- ❌ Price calculations don't reflect user's actual configuration
- ❌ Total prices in summary are wrong if user chose non-default innenverkleidung

---

## 🔍 Root Cause

In the `getItemPrice` function for gebaeudehuelle/fussboden, the code was using a hardcoded default:

```typescript
// ❌ BEFORE (Line 153):
const testInnenverkleidung = baseInnenverkleidung;  // Always "fichte"!
```

This meant that when calculating the price contribution of a gebaeudehuelle or fussboden option, the calculation **always assumed Fichte** was selected, even if the user chose Lärche (31,921€) or Eiche (37,235€).

---

## ✅ Solution

Use the **actual user selection** from the configuration:

```typescript
// ✅ AFTER (Line 154):
const testInnenverkleidung = configuration.innenverkleidung?.value || baseInnenverkleidung;
```

Now the calculation uses:
1. The user's actual innenverkleidung selection if they made one
2. Falls back to "fichte" (default) if no selection yet

---

## 📊 Example of the Bug

### **Scenario**: User selects Lärche interior + Lärche exterior

**Before Fix (WRONG)**:
```
Configuration:
- Innenverkleidung: Lärche (31,921€)
- Gebäudehülle: Lärche (24,413€)

Price Calculation:
- Base: Nest + Trapezblech + Fichte (23,020€) + Standard
- With Lärche exterior: Nest + Lärche (24,413€) + Fichte (23,020€) + Standard
  ❌ Still using Fichte (23,020€) instead of Lärche (31,921€)!
- Difference shown: INCORRECT (doesn't account for interior upgrade)
```

**After Fix (CORRECT)**:
```
Configuration:
- Innenverkleidung: Lärche (31,921€)
- Gebäudehülle: Lärche (24,413€)

Price Calculation:
- Base: Nest + Trapezblech + Fichte (23,020€) + Standard
- With Lärche exterior: Nest + Lärche (24,413€) + Lärche (31,921€) + Standard
  ✅ Correctly uses Lärche (31,921€) that user selected!
- Difference shown: CORRECT (accounts for both upgrades)
```

---

## 🔧 Technical Details

### **What Changed**:

```typescript
// Line 151-158 BEFORE:
// Calculate combination price with this specific option
let testGebaeudehuelle = baseGebaeudehuelle;
const testInnenverkleidung = baseInnenverkleidung;  // ❌ Always default
let testFussboden = baseFussboden;

if (key === "gebaeudehuelle") testGebaeudehuelle = selection.value;
if (key === "fussboden") testFussboden = selection.value;

// Line 151-158 AFTER:
// Calculate combination price with this specific option
// IMPORTANT: Use actual user selections, not just defaults!
let testGebaeudehuelle = baseGebaeudehuelle;
const testInnenverkleidung = configuration.innenverkleidung?.value || baseInnenverkleidung;  // ✅ Actual selection
let testFussboden = baseFussboden;

if (key === "gebaeudehuelle") testGebaeudehuelle = selection.value;
if (key === "fussboden") testFussboden = selection.value;
```

### **Why This Matters**:

The `calculateCombinationPrice` function calculates the TOTAL price of a configuration:
```
Total = Nest + Gebäudehülle + Innenverkleidung + Fussboden
```

To calculate the **contribution** of just one option (e.g., gebäudehülle), we compare:
- Base configuration (all defaults)
- Test configuration (with the specific option changed)

**The bug**: The "test configuration" was always using default Fichte, not the user's actual innenverkleidung choice. This made the price difference calculation wrong.

---

## 🧪 Testing

### **Test Case 1: Default (Fichte)**
1. Select Nest 80
2. Keep Fichte selected (default)
3. Select Lärche exterior
4. Verify price matches expected difference

✅ **Expected**: Same behavior as before (since Fichte is default)

### **Test Case 2: Lärche Interior**
1. Select Nest 80
2. **Select Lärche interior** (31,921€ instead of 23,020€)
3. Select Lärche exterior (24,413€)
4. Verify prices reflect BOTH upgrades

✅ **Expected**: Price now correctly accounts for Lärche interior being selected

### **Test Case 3: Eiche Interior**
1. Select Nest 80
2. **Select Eiche interior** (37,235€)
3. Select different flooring
4. Verify flooring price reflects Eiche being selected

✅ **Expected**: Flooring prices now correctly account for Eiche interior

---

## 📝 Affected Calculations

This fix affects price calculations for:
- ✅ **Gebäudehülle options** (Lärche, Platte Black, Platte White)
- ✅ **Fussboden options** (Parkett Eiche, Kalkstein, Schiefer)

It does NOT affect:
- ✅ Nest prices (direct from sheet)
- ✅ Innenverkleidung prices (already fixed separately)
- ✅ PV-Anlage (quantity-based)
- ✅ Other options (direct pricing)

---

## 🎯 Impact

### **Before Fix**:
- ❌ Prices shown were incorrect if user selected non-default innenverkleidung
- ❌ Summary panel showed wrong totals
- ❌ User couldn't see accurate pricing for their configuration

### **After Fix**:
- ✅ Prices correctly reflect ALL user selections
- ✅ Summary panel shows accurate totals
- ✅ Dynamic pricing works correctly across all interdependent options

---

**Critical Bug Fixed!** The summary panel now correctly uses the user's actual innenverkleidung selection when calculating prices for gebaeudehülle and fussboden options. 🎉


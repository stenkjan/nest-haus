# Quick Start: Upload Producer Files

## 📤 How to Upload Files

### **Option 1: Direct Upload (Recommended)**

If you have the files locally:

1. Drag and drop to `/workspace/preiskalkulation/`
2. Or use file upload in your IDE
3. Ensure exact filenames:
   - `Angebot_-_15014024.pdf`
   - `book5.xlsx`

### **Option 2: Alternative Filenames**

If your files have different names, just let me know and I'll adapt the script. For example:

```bash
# If your files are named differently:
mv your_pdf_name.pdf Angebot_-_15014024.pdf
mv your_excel_name.xlsx book5.xlsx
```

### **Option 3: Google Drive Link**

If files are in Google Drive, share the link and I can download them.

---

## 🚀 Running the Analysis

### **Automatic (Recommended)**

Once files are uploaded, just run:

```bash
cd /workspace/preiskalkulation
python3 analyze_new_pricing.py
```

### **What Happens Next**

The script will:

1. **Load current pricing** from `Preiskalkulation.xlsx` ✅ (already done)
2. **Extract producer pricing** from `book5.xlsx` ⏳ (waiting for file)
3. **Parse PDF offer** from `Angebot_-_15014024.pdf` ⏳ (waiting for file)
4. **Compare prices** (old vs new)
5. **Generate reports**:
   - Detailed comparison (JSON)
   - Price change summary (Markdown)
   - Mapping recommendations
   - Import-ready Google Sheets data

---

## 📊 What You'll Get

### **1. Comparison Report**

```json
{
  "changes": [
    {
      "component": "Trapezblech + Kiefer + Parkett",
      "old_price": 155500,
      "new_price": 162000,  // Example
      "change": 6500,
      "change_percent": 4.18,
      "flag": "review"  // if change > 20%
    }
  ]
}
```

### **2. Mapping Recommendations**

```
Producer Term          → Configurator ID        Status
─────────────────────────────────────────────────────
Trapezblech            → trapezblech           ✅ Match
Fassadenplatten Schwarz→ fassadenplatten_schwarz ⚠️  Verify
Ohne Parkett           → ohne_belag            ❌ Missing
```

### **3. Implementation Checklist**

```
[ ] Add missing "ohne_belag" combinations
[ ] Verify Fassadenplatten naming
[ ] Update size-dependent base prices
[ ] Add Belichtungspaket percentages
[ ] Validate all formulas
[ ] Test sample configurations
```

---

## 🔍 If Files Can't Be Parsed

If the PDF or Excel has unusual formatting:

### **Plan B: Manual Data Entry**

1. I'll provide you with a structured template
2. You fill in the pricing data
3. We import it directly to Google Sheets
4. Skip the comparison step (optional)

### **Plan C: Hybrid Approach**

1. Extract what we can automatically
2. Flag unclear items
3. You manually review and confirm
4. We proceed with validated data

---

## 📞 Ready When You Are

Just upload the files and let me know! I'll immediately:

- Parse both documents
- Generate the comparison
- Show you exactly what changes
- Provide clear next steps

**No further questions needed** - the analysis will handle everything automatically! 🚀

# Configurator Image Logic Analysis

## Overview

This document analyzes the differences between the **Old Konfigurator** image logic and the **New Implementation** image logic in the NEST Haus configurator. It maps out which combinations trigger what images and identifies potential gaps or issues.

---

## 🏗️ **Architecture Comparison**

### **Old Configurator (konfigurator_old/)**

- **Function**: `getPreviewImagePath(selections, viewIndex)`
- **Views**: Numeric indices (1=exterior, 2=interior, 3=PV, 4=fenster)
- **Logic**: Switch statements with direct `IMAGES.configurations` lookups
- **State**: `activeViewIndex`, `hasPart2BeenActive`, `hasPart3BeenActive`

### **New Implementation (src/app/konfigurator/)**

- **Class**: `ImageManager.getPreviewImage(configuration, view)`
- **Views**: String-based ViewType ('exterior', 'interior', 'pv', 'fenster')
- **Logic**: Method-based architecture with security validation and caching
- **State**: `Configuration` object with typed selections

---

## 🎯 **View Availability Logic**

### **Old System**

```typescript
const getAvailableViews = () => {
  const views = [1]; // Always exterior
  if (hasPart2BeenActive) views.push(2); // Interior
  if (hasPart3BeenActive) {
    if (selections.pvanlage) views.push(3); // PV view
    if (selections.fenster) views.push(4); // Fenster view
  }
  return views;
};
```

### **New System**

```typescript
static getAvailableViews(configuration, hasPart2BeenActive, hasPart3BeenActive): ViewType[] {
    const views: ViewType[] = ['exterior']; // Always available
    if (hasPart2BeenActive) views.push('interior');
    if (hasPart3BeenActive) {
        if (configuration.pvanlage) views.push('pv');
        if (configuration.fenster) views.push('fenster');
    }
    return views;
}
```

**✅ Status**: **IDENTICAL LOGIC** - Both systems match perfectly.

---

## 🏠 **Exterior View Image Logic**

### **Old System (via getPreviewImagePath)**

```typescript
case 1: // Exterior view
    const exteriorPath = getPreviewImagePath(selections, 1);
    return exteriorPath;
```

### **New System**

```typescript
private static getExteriorImage(configuration: Configuration): string {
    const nest = configuration.nest?.value || 'nest80';
    const gebaeude = configuration.gebaeudehuelle?.value || 'trapezblech';

    // Map nest values to image sizes
    const nestSizeMap = {
        'nest80': '75',   // nest80 -> 75 in images
        'nest100': '95',  // nest100 -> 95 in images
        'nest120': '115', // nest120 -> 115 in images
        'nest140': '135', // nest140 -> 135 in images
        'nest160': '155'  // nest160 -> 155 in images
    };

    const gebaeudeImageMap = {
        'trapezblech': 'trapezblech',
        'holzlattung': 'holzlattung',
        'fassadenplatten_schwarz': 'plattenschwarz',
        'fassadenplatten_weiss': 'plattenweiss'
    };

    // Result: nest{size}_{gebaeude}
    const imageKey = `nest${imageSize}_${gebaeudeImageName}`;
    return IMAGES.configurations[imageKey];
}
```

### **Image Mapping Table - Exterior View**

| Nest Model | Gebäudehülle            | Expected Image Key       | Available in constants? |
| ---------- | ----------------------- | ------------------------ | ----------------------- |
| nest80     | trapezblech             | `nest75_trapezblech`     | ✅ Yes                  |
| nest80     | holzlattung             | `nest75_holzlattung`     | ✅ Yes                  |
| nest80     | fassadenplatten_schwarz | `nest75_plattenschwarz`  | ✅ Yes                  |
| nest80     | fassadenplatten_weiss   | `nest75_plattenweiss`    | ✅ Yes                  |
| nest100    | trapezblech             | `nest95_trapezblech`     | ✅ Yes                  |
| nest100    | holzlattung             | `nest95_holzlattung`     | ✅ Yes                  |
| nest100    | fassadenplatten_schwarz | `nest95_plattenschwarz`  | ✅ Yes                  |
| nest100    | fassadenplatten_weiss   | `nest95_plattenweiss`    | ✅ Yes                  |
| nest120    | trapezblech             | `nest115_trapezblech`    | ✅ Yes                  |
| nest120    | holzlattung             | `nest115_holzlattung`    | ✅ Yes                  |
| nest120    | fassadenplatten_schwarz | `nest115_plattenschwarz` | ✅ Yes                  |
| nest120    | fassadenplatten_weiss   | `nest115_plattenweiss`   | ✅ Yes                  |
| nest140    | trapezblech             | `nest135_trapezblech`    | ✅ Yes                  |
| nest140    | holzlattung             | `nest135_holzlattung`    | ✅ Yes                  |
| nest140    | fassadenplatten_schwarz | `nest135_plattenschwarz` | ✅ Yes                  |
| nest140    | fassadenplatten_weiss   | `nest135_plattenweiss`   | ✅ Yes                  |
| nest160    | trapezblech             | `nest155_trapezblech`    | ✅ Yes                  |
| nest160    | holzlattung             | `nest155_holzlattung`    | ✅ Yes                  |
| nest160    | fassadenplatten_schwarz | `nest155_plattenschwarz` | ✅ Yes                  |
| nest160    | fassadenplatten_weiss   | `nest155_plattenweiss`   | ✅ Yes                  |

**✅ Status**: **COMPLETE COVERAGE** - All exterior combinations have corresponding images.

---

## 🎨 **Interior View Image Logic**

### **New System**

```typescript
private static getInteriorImage(configuration: Configuration): string {
    const gebaeude = configuration.gebaeudehuelle?.value || 'trapezblech';
    const innenverkleidung = configuration.innenverkleidung?.value || 'kiefer';
    const fussboden = configuration.fussboden?.value || 'parkett';

    // Construct: {gebaeude}_{innen}_{fussboden}
    const imageKey = `${gebaeudePrefix}_${innenPart}_${fussbodenPart}`;
}
```

### **Image Mapping Table - Interior View**

| Gebäudehülle            | Innenverkleidung | Fußboden          | Expected Image Key                   | Available?     |
| ----------------------- | ---------------- | ----------------- | ------------------------------------ | -------------- |
| trapezblech             | kiefer           | parkett           | `trapezblech_holznatur_parkett`      | ✅ Yes         |
| trapezblech             | kiefer           | kalkstein_kanafar | `trapezblech_holznatur_kalkstein`    | ✅ Yes         |
| trapezblech             | kiefer           | schiefer_massiv   | `trapezblech_holznatur_granit`       | ✅ Yes         |
| trapezblech             | fichte           | parkett           | `trapezblech_holzweiss_parkett`      | ✅ Yes         |
| trapezblech             | fichte           | kalkstein_kanafar | `trapezblech_holzweiss_kalkstein`    | ✅ Yes         |
| trapezblech             | fichte           | schiefer_massiv   | `trapezblech_holzweiss_granit`       | ✅ Yes         |
| trapezblech             | steirische_eiche | parkett           | `trapezblech_eiche_parkett`          | ✅ Yes         |
| trapezblech             | steirische_eiche | kalkstein_kanafar | `trapezblech_eiche_kalkstein`        | ✅ Yes         |
| trapezblech             | steirische_eiche | schiefer_massiv   | `trapezblech_eiche_granit`           | ✅ Yes         |
| fassadenplatten_schwarz | kiefer           | parkett           | `plattenschwarz_holznatur_parkett`   | ✅ Yes         |
| fassadenplatten_schwarz | kiefer           | kalkstein_kanafar | `plattenschwarz_holznatur_kalkstein` | ✅ Yes         |
| fassadenplatten_schwarz | kiefer           | schiefer_massiv   | `plattenschwarz_holznatur_granit`    | ✅ Yes         |
| fassadenplatten_schwarz | fichte           | parkett           | `plattenschwarz_holzweiss_parkett`   | ✅ Yes         |
| fassadenplatten_schwarz | fichte           | kalkstein_kanafar | `plattenschwarz_holzweiss_kalkstein` | ✅ Yes         |
| fassadenplatten_schwarz | fichte           | schiefer_massiv   | `plattenschwarz_holzweiss_granit`    | ✅ Yes         |
| fassadenplatten_schwarz | steirische_eiche | parkett           | `plattenschwarz_eiche_parkett`       | ✅ Yes         |
| fassadenplatten_schwarz | steirische_eiche | kalkstein_kanafar | `plattenschwarz_eiche_kalkstein`     | ✅ Yes         |
| fassadenplatten_schwarz | steirische_eiche | schiefer_massiv   | `plattenschwarz_eiche_granit`        | ✅ Yes         |
| fassadenplatten_weiss   | kiefer           | parkett           | `plattenweiss_holznatur_parkett`     | ✅ Yes         |
| fassadenplatten_weiss   | kiefer           | kalkstein_kanafar | `plattenweiss_holznatur_kalkstein`   | ✅ Yes         |
| fassadenplatten_weiss   | kiefer           | schiefer_massiv   | `plattenweiss_holznatur_granit`      | ✅ Yes         |
| fassadenplatten_weiss   | fichte           | parkett           | `plattenweiss_holzweiss_parkett`     | ✅ Yes         |
| fassadenplatten_weiss   | fichte           | kalkstein_kanafar | `plattenweiss_holzweiss_kalkstein`   | ✅ Yes         |
| fassadenplatten_weiss   | fichte           | schiefer_massiv   | `plattenweiss_holzweiss_granit`      | ✅ Yes         |
| fassadenplatten_weiss   | steirische_eiche | parkett           | `plattenweiss_eiche_parkett`         | ✅ Yes         |
| fassadenplatten_weiss   | steirische_eiche | kalkstein_kanafar | `plattenweiss_eiche_kalkstein`       | ✅ Yes         |
| fassadenplatten_weiss   | steirische_eiche | schiefer_massiv   | `plattenweiss_eiche_granit`          | ✅ Yes         |
| holzlattung             | kiefer           | parkett           | `holzlattung_holznatur_parkett`      | ❌ **MISSING** |
| holzlattung             | kiefer           | kalkstein_kanafar | `holzlattung_holznatur_kalkstein`    | ❌ **MISSING** |
| holzlattung             | kiefer           | schiefer_massiv   | `holzlattung_holznatur_granit`       | ❌ **MISSING** |
| holzlattung             | fichte           | parkett           | `holzlattung_holzweiss_parkett`      | ❌ **MISSING** |
| holzlattung             | fichte           | kalkstein_kanafar | `holzlattung_holzweiss_kalkstein`    | ❌ **MISSING** |
| holzlattung             | fichte           | schiefer_massiv   | `holzlattung_holzweiss_granit`       | ❌ **MISSING** |
| holzlattung             | steirische_eiche | parkett           | `holzlattung_eiche_parkett`          | ❌ **MISSING** |
| holzlattung             | steirische_eiche | kalkstein_kanafar | `holzlattung_eiche_kalkstein`        | ❌ **MISSING** |
| holzlattung             | steirische_eiche | schiefer_massiv   | `holzlattung_eiche_granit`           | ❌ **MISSING** |

**⚠️ Status**: **MISSING IMAGES** - All holzlattung interior combinations are missing (9 images).

**Current Fallback**: Falls back to `holzlattung_interior: '166-NEST-Haus-Konfigurator-Modul-Holzfassade-Holz-Natur-Kalkstein'`

---

## ⚡ **PV View Image Logic**

### **Old System**

```typescript
case 3: // PV view
    return selections.pvanlage
        ? IMAGES.configurations.photovoltaik_holz
        : getPreviewImagePath(selections, 1);
```

### **New System**

```typescript
private static getPvImage(configuration: Configuration): string {
    const gebaeude = configuration.gebaeudehuelle?.value || 'trapezblech';

    const pvImageMap = {
        'trapezblech': 'pv_trapezblech',
        'holzlattung': 'pv_holzfassade',
        'fassadenplatten_schwarz': 'pv_plattenschwarz',
        'fassadenplatten_weiss': 'pv_plattenweiss'
    };
}
```

### **PV Image Mapping**

| Gebäudehülle            | Old Logic           | New Logic           | Image Key                                                                          | Available? |
| ----------------------- | ------------------- | ------------------- | ---------------------------------------------------------------------------------- | ---------- |
| trapezblech             | `photovoltaik_holz` | `pv_trapezblech`    | `'135-NEST-Haus-Konfigurator-Modul-Fassade-Trapezblech-Photovoltaik-PV-Panel'`     | ✅ Yes     |
| holzlattung             | `photovoltaik_holz` | `pv_holzfassade`    | `'134-NEST-Haus-Konfigurator-Modul-Fassade-Holzfassade-Photovoltaik-PV-Panel'`     | ✅ Yes     |
| fassadenplatten_schwarz | `photovoltaik_holz` | `pv_plattenschwarz` | `'151-NEST-Haus-Konfigurator-Modul-Fassadenplatten-Schwarz-Photovoltaik-PV-Panel'` | ✅ Yes     |
| fassadenplatten_weiss   | `photovoltaik_holz` | `pv_plattenweiss`   | `'161-NEST-Haus-Konfigurator-Modul-Fassadenplatten-Weiss-Photovoltaik-PV-Panel'`   | ✅ Yes     |

**🔄 Status**: **IMPROVED LOGIC** - New system shows gebäudehülle-specific PV images instead of generic holz image.

---

## 🪟 **Fenster View Image Logic**

### **Old System**

```typescript
case 4: // Fenster view
    if (selections.fenster) {
        const fensterImageKey = selections.fenster.value === 'kunststoffverkleidung' ? 'fensterPvc' :
                              selections.fenster.value === 'aluminium' ? 'fensterAluminium' :
                              selections.fenster.value === 'eiche' ? 'fensterEiche' :
                              'fensterFichte';
        return IMAGES.configurations[fensterImageKey];
    }
    return getPreviewImagePath(selections, 1);
```

### **New System**

```typescript
private static getFensterImage(configuration: Configuration): string {
    const fensterImageMap = {
        // New configurator IDs
        'pvc_fenster': 'fenster_pvc',
        'fichte': 'fenster_holz_fichte',
        'steirische_eiche': 'fenster_holz_eiche',
        'aluminium': 'fenster_aluminium',
        // Old configurator IDs (compatibility)
        'kunststoffverkleidung': 'fenster_pvc',
        'eiche': 'fenster_holz_eiche'
    };

    // Fallback to stirnseite view
    const stirnseiteMap = {
        'trapezblech': 'TRAPEZBLECH',
        'holzlattung': 'HOLZFASSADE',
        'fassadenplatten_schwarz': 'PLATTEN_SCHWARZ',
        'fassadenplatten_weiss': 'PLATTEN_WEISS'
    };
}
```

### **Fenster Image Mapping**

| Selection        | Old System         | New System            | Image Key                                                                          | Available? |
| ---------------- | ------------------ | --------------------- | ---------------------------------------------------------------------------------- | ---------- |
| pvc_fenster      | `fensterPvc`       | `fenster_pvc`         | `'177-NEST-Haus-Fenster-Kunststoff-PVC-Fenster-Weiß-Kunststofffenster-PVCFenster'` | ✅ Yes     |
| fichte           | `fensterFichte`    | `fenster_holz_fichte` | `'175-NEST-Haus-Fenster-Holz-Fichte-Holzfenster-Fichtenfenster'`                   | ✅ Yes     |
| steirische_eiche | `fensterEiche`     | `fenster_holz_eiche`  | `'174-NEST-Haus-Fenster-Holz-Eiche-Holzfenster-Eichenfenster'`                     | ✅ Yes     |
| aluminium        | `fensterAluminium` | `fenster_aluminium`   | `'176-NEST-Haus-Fenster-Aluminium-Fenster-Aluminiumfenster-Metallfenster'`         | ✅ Yes     |

**✅ Status**: **COMPATIBLE** - New system supports both old and new selection IDs.

---

## 🚨 **Critical Issues & Missing Images**

### **1. ✅ RESOLVED: Holzlattung Interior Images**

**STATUS: COMPLETED & BUG FIXES APPLIED**

**Added Images**: 9 combinations for holzlattung interior views with corrected mapping logic:

- `holzlattung_kalkstein` (kiefer + kalkstein) = `'166-NEST-Haus-Konfigurator-Modul-Holzfassade-Holz-Natur-Kalkstein'`
- `holzlattung_schiefer` (kiefer + schiefer_massiv) = `'165-NEST-Haus-Konfigurator-Modul-Holzfassade-Holz-Natur-Schiefer'`
- `holzlattung_eiche` (kiefer + parkett) = `'167-NEST-Haus-Konfigurator-Modul-Holzfassade-Holz-Natur-Parkett-Eiche'`
- `holzlattung_weiss_kalkstein` (fichte + kalkstein) = `'169-NEST-Haus-Konfigurator-Modul-Holzfassade-Holz-weiss-gekalkt-Kalkstein'`
- `holzlattung_weiss_schiefer` (fichte + schiefer_massiv) = `'168-NEST-Haus-Konfigurator-Modul-Holzfassade-Holz-weiss-gekalkt-Schiefer'`
- `holzlattung_weiss_parkett` (fichte + parkett) = `'170-NEST-Haus-Konfigurator-Modul-Holzfassade-Holz-weiss-gekalkt-Parkett-Eiche'`
- `holzlattung_eiche_kalkstein` (steirische_eiche + kalkstein) = `'172-NEST-Haus-Konfigurator-Modul-Holzfassade-Steirische-Eiche-Kalkstein'`
- `holzlattung_eiche_schiefer` (steirische_eiche + schiefer_massiv) = `'171-NEST-Haus-Konfigurator-Modul-Holzfassade-Steirische-Eiche-Schiefer'`
- `holzlattung_eiche_parkett` (steirische_eiche + parkett) = `'173-NEST-Haus-Konfigurator-Modul-Holzfassade-Steirische-Eiche-Parkett-Eiche'`

**🐛 BUG FIXES APPLIED**:

- ✅ **Fixed `schiefer_massiv` mapping** to `schiefer` (was causing fichte + schiefer_massiv image not found)
- ✅ **Corrected parkett mapping** to use `parkett` not `eiche` for proper image key construction
- ✅ **Fixed kiefer + parkett special case** to use `holzlattung_eiche` image key correctly
- ✅ **Added debug logging** to track image mapping decisions and identify issues faster

**Code Updates**: Updated `ImageManager.getInteriorImage()` method with corrected holzlattung mapping logic and bug fixes.

### **2. ✅ RESOLVED: Interior Image Gebäudehülle Selection Issue**

**STATUS: COMPLETED (January 2025)**

**Problem**: When selecting interior options (innenverkleidung OR fussboden), the system always used trapezblech for the gebäudehülle, even when a different material was already selected.

**Fix**: Modified `ImageManager.getInteriorImage()` to respect the selected gebäudehülle instead of always defaulting to trapezblech.

**Example**: User selects "Fassadenplatten Schwarz" → then "Parkett Eiche" now correctly shows `plattenschwarz_holznatur_parkett` instead of `trapezblech_holznatur_parkett`.

### **3. Selection ID Mapping Issues (MEDIUM PRIORITY)**

#### **Old vs New Configurator Selection IDs**

| Category         | Old ID                  | New ID             | Status                               |
| ---------------- | ----------------------- | ------------------ | ------------------------------------ |
| Fenster          | `kunststoffverkleidung` | `pvc_fenster`      | ✅ Handled via compatibility mapping |
| Fenster          | `eiche`                 | `steirische_eiche` | ✅ Handled via compatibility mapping |
| Gebäudehülle     | All match               | All match          | ✅ Compatible                        |
| Innenverkleidung | All match               | All match          | ✅ Compatible                        |
| Fußboden         | All match               | All match          | ✅ Compatible                        |

### **4. Constants Inconsistencies (LOW PRIORITY)**

| Issue            | Old Reference       | New Reference | Status                                |
| ---------------- | ------------------- | ------------- | ------------------------------------- |
| PV generic image | `photovoltaik_holz` | Not defined   | ⚠️ Old key not found in new constants |

---

## 🔧 **Recommendations**

### **Priority 1: Add Missing Holzlattung Interior Images**

1. **Create 9 missing interior combination images** for holzlattung
2. **Add image constants** to `src/constants/images.ts`
3. **Update image blob storage** with new images

### **Priority 2: Verify PV Image Logic**

1. **Test PV view switching** between different gebäudehülle selections
2. **Confirm all PV images are loading correctly**
3. **Check old `photovoltaik_holz` reference removal**

### **Priority 3: Selection ID Compatibility**

1. **Document all selection ID mappings**
2. **Test old configurator state import/export** compatibility
3. **Ensure session restoration works** with both ID systems

---

## 📊 **Image Coverage Summary**

| View Type               | Total Combinations | Images Available | Missing | Coverage |
| ----------------------- | ------------------ | ---------------- | ------- | -------- |
| **Exterior**            | 20                 | 20               | 0       | ✅ 100%  |
| **Interior**            | 36                 | 36               | 0       | ✅ 100%  |
| **PV**                  | 4                  | 4                | 0       | ✅ 100%  |
| **Fenster**             | 4                  | 4                | 0       | ✅ 100%  |
| **Stirnseite Fallback** | 4                  | 4                | 0       | ✅ 100%  |

**Overall Coverage**: **64 of 64 combinations (100%)**

---

## 🔍 **Testing Checklist**

### **Exterior View Testing**

- [ ] nest80 + trapezblech = `nest75_trapezblech`
- [ ] nest100 + holzlattung = `nest95_holzlattung`
- [ ] nest120 + fassadenplatten_schwarz = `nest115_plattenschwarz`
- [ ] nest140 + fassadenplatten_weiss = `nest135_plattenweiss`
- [ ] nest160 + trapezblech = `nest155_trapezblech`

### **Interior View Testing**

- [ ] trapezblech + kiefer + parkett = `trapezblech_holznatur_parkett`
- [ ] fassadenplatten_schwarz + fichte + kalkstein = `plattenschwarz_holzweiss_kalkstein`
- [ ] fassadenplatten_weiss + steirische_eiche + schiefer = `plattenweiss_eiche_granit`
- [x] **holzlattung + kiefer + kalkstein** = `holzlattung_kalkstein` ✅ FIXED
- [x] **holzlattung + kiefer + parkett** = `holzlattung_eiche` ✅ FIXED (special case)
- [x] **holzlattung + fichte + schiefer_massiv** = `holzlattung_weiss_schiefer` ✅ FIXED
- [x] **holzlattung + fichte + parkett** = `holzlattung_weiss_parkett` ✅ FIXED
- [x] **holzlattung + steirische_eiche + schiefer_massiv** = `holzlattung_eiche_schiefer` ✅ FIXED

### **PV View Testing**

- [ ] trapezblech + PV = `pv_trapezblech`
- [ ] holzlattung + PV = `pv_holzfassade`
- [ ] fassadenplatten_schwarz + PV = `pv_plattenschwarz`
- [ ] fassadenplatten_weiss + PV = `pv_plattenweiss`

### **Fenster View Testing**

- [ ] pvc_fenster = `fenster_pvc`
- [ ] fichte = `fenster_holz_fichte`
- [ ] steirische_eiche = `fenster_holz_eiche`
- [ ] aluminium = `fenster_aluminium`
- [ ] No fenster selection = stirnseite fallback

---

## 📝 **Next Steps**

1. **Review this analysis** with the development team
2. **Prioritize missing holzlattung interior images** creation
3. **Test all image combinations** in development environment
4. **Update image constants** with missing keys
5. **Document final image mapping** for future reference

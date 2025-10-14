# Section Catalog

**Your reference library for moving sections across your website.**

## 🎯 Purpose

This catalog is your **"section menu"** - a place where you can:

- ✅ See all your unique sections
- ✅ Copy complete code for any section
- ✅ Easily move sections between pages
- ✅ Track where sections are used

## 📖 How It Works

### 1. Browse `CATALOG.md`

All your sections are documented in one place with:

- What the section is
- Where it's currently used
- Complete copy-paste ready code
- Required imports
- How to customize it

### 2. Copy & Paste

Find the section you need → copy the code → paste on any page

### 3. Add Catalog Reference

Mark where sections come from:

```tsx
{
  /* 📚 Catalog: @sections/catalog/CATALOG.md → "Section Name" */
}
<section>...</section>;
```

### 4. Easy to Move

Want to move a section to another page?

1. Copy it from the catalog (or from current page)
2. Paste it where you need it
3. Done!

## 🔧 When to Add to Catalog

Add a section when:

- ✅ It's a unique, complete piece of content
- ✅ You might want to reuse or move it
- ✅ It combines multiple components (header + content)

Don't add:

- ❌ Single component usage
- ❌ Page-specific layout sections
- ❌ Highly variable sections

## 📝 Structure

```
catalog/
├── README.md (this file)
└── CATALOG.md (all sections listed here)
```

**Keep it simple:** Everything in one CATALOG.md file for easy browsing!

## 💡 Why This Approach?

**Better than components:**

- See the code directly on the page
- Easy to customize per page
- No prop drilling
- Less abstraction

**Better than nothing:**

- Don't have to remember where sections live
- Easy to copy complete sections
- Documentation of what exists
- Consistency across pages

# Configurator State Management Integration

## 🎯 Overview

This document shows how to integrate your new configurator component with the backend state management system. The state management handles:

- ✅ **Session tracking** with Redis/PostgreSQL
- ✅ **Price calculations** via backend APIs
- ✅ **Cart management** across the app
- ✅ **Order processing** when user checks out

---

## 🏗️ State Management Architecture

### **Two Main Stores**

1. **`useConfiguratorStore`** - Handles current configuration
2. **`useCartStore`** - Handles cart items and orders

### **Data Flow**
```
User Selection → Configurator Store → Backend APIs → Cart Store → Order
```

---

## 🔗 Integration Example

### **Basic Integration in Your Component**

```typescript
'use client'

import { useConfiguratorStore } from '../store/configuratorStore'
import { useCartStore } from '../store/cartStore'

export function YourConfiguratorComponent() {
  const {
    sessionId,
    configuration,
    currentPrice,
    isLoading,
    initializeSession,
    updateSelection,
    calculatePrice,
    isConfigurationComplete
  } = useConfiguratorStore()

  const {
    addConfigurationToCart,
    getCartCount
  } = useCartStore()

  // Initialize session on mount
  useEffect(() => {
    initializeSession()
  }, [initializeSession])

  // Handle user selection
  const handleOptionSelect = async (category: string, option: any) => {
    const configItem = {
      category,
      value: option.value,
      name: option.name,
      price: option.price,
      description: option.description,
      quantity: option.quantity, // for PV modules
      squareMeters: option.squareMeters // for windows
    }

    // This automatically:
    // 1. Updates local state
    // 2. Tracks with backend
    // 3. Recalculates price
    await updateSelection(configItem)
  }

  // Add to cart when ready
  const handleAddToCart = () => {
    if (isConfigurationComplete()) {
      const config = useConfiguratorStore.getState().getConfigurationForCart()
      if (config) {
        addConfigurationToCart(config)
        // Redirect to cart
        router.push('/warenkorb')
      }
    }
  }

  return (
    <div>
      {/* Your UI here */}
      
      {/* Example: Nest Selection */}
      <div>
        <h3>Nest Size</h3>
        {NEST_OPTIONS.map(option => (
          <button
            key={option.value}
            onClick={() => handleOptionSelect('nest', option)}
            className={configuration?.nest?.value === option.value ? 'selected' : ''}
          >
            {option.name} - {formatPrice(option.price)}
          </button>
        ))}
      </div>

      {/* Price Display */}
      <div>
        <h3>Total: {formatPrice(currentPrice)}</h3>
      </div>

      {/* Add to Cart */}
      <button 
        onClick={handleAddToCart}
        disabled={!isConfigurationComplete()}
      >
        Add to Cart ({getCartCount()})
      </button>
    </div>
  )
}
```

---

## 📋 Required Integration Steps

### **Step 1: Install Dependencies**
```bash
npm install zustand
```

### **Step 2: Import Stores**
```typescript
import { useConfiguratorStore } from '../store/configuratorStore'
import { useCartStore } from '../store/cartStore'
```

### **Step 3: Initialize Session**
```typescript
const { initializeSession } = useConfiguratorStore()

useEffect(() => {
  initializeSession()
}, [])
```

### **Step 4: Handle Selections**
```typescript
const { updateSelection } = useConfiguratorStore()

const handleSelection = async (category, option) => {
  await updateSelection({
    category,
    value: option.value,
    name: option.name,
    price: option.price
  })
}
```

### **Step 5: Add to Cart**
```typescript
const { addConfigurationToCart } = useCartStore()
const { getConfigurationForCart } = useConfiguratorStore()

const addToCart = () => {
  const config = getConfigurationForCart()
  if (config) addConfigurationToCart(config)
}
```

---

## 🎛️ Available Store Methods

### **Configurator Store**
```typescript
// Session management
initializeSession() // Call on mount
finalizeSession()   // Automatic on unmount

// Configuration updates
updateSelection(item)     // Add/update selection
removeSelection(category) // Remove selection
resetConfiguration()     // Start over

// Price calculations
calculatePrice()         // Recalculate total
currentPrice            // Current total price
priceBreakdown         // Detailed breakdown

// State checks
isConfigurationComplete() // Ready for cart?
getConfigurationForCart() // Get cart-ready config
```

### **Cart Store**
```typescript
// Cart management
addConfigurationToCart(config) // Add from configurator
removeFromCart(itemId)         // Remove specific item
clearCart()                    // Empty cart

// Order processing
setOrderDetails(details)       // Set customer info
processOrder()                 // Submit order

// State getters
getCartTotal()                 // Total price
getCartCount()                 // Number of items
canProceedToCheckout()         // Ready to order?
```

---

## 🔄 Automatic Features

### **Backend Integration (Automatic)**
- ✅ Session creation on component mount
- ✅ Selection tracking on every change
- ✅ Price calculation via backend APIs
- ✅ Session finalization on page leave

### **Cart Integration (Automatic)**
- ✅ Configuration auto-added when complete
- ✅ Price synchronization across app
- ✅ Persistent storage (localStorage)

### **Order Processing (Automatic)**
- ✅ Customer inquiry creation
- ✅ Session conversion tracking
- ✅ Database persistence

---

## 🎨 UI State Helpers

### **Loading States**
```typescript
const { isLoading } = useConfiguratorStore()
const { isProcessingOrder } = useCartStore()

// Show loading indicators
{isLoading && <LoadingSpinner />}
{isProcessingOrder && <OrderProcessing />}
```

### **Validation States**
```typescript
const { isConfigurationComplete } = useConfiguratorStore()
const { canProceedToCheckout } = useCartStore()

// Enable/disable buttons
<button disabled={!isConfigurationComplete()}>
  Add to Cart
</button>

<button disabled={!canProceedToCheckout()}>
  Place Order
</button>
```

### **Price Display**
```typescript
const { currentPrice, priceBreakdown } = useConfiguratorStore()
const { getCartTotal } = useCartStore()

// Show current price
<div>Current: {formatPrice(currentPrice)}</div>

// Show cart total
<div>Cart Total: {formatPrice(getCartTotal())}</div>

// Show breakdown
{priceBreakdown && (
  <div>
    <div>Base: {formatPrice(priceBreakdown.basePrice)}</div>
    {Object.entries(priceBreakdown.options).map(([key, option]) => (
      <div key={key}>{option.name}: {formatPrice(option.price)}</div>
    ))}
  </div>
)}
```

---

## ⚠️ Integration Requirements

### **MUST DO**
- ✅ Call `initializeSession()` on component mount
- ✅ Use `updateSelection()` for all user choices
- ✅ Use backend price calculations (automatic)
- ✅ Check `isConfigurationComplete()` before cart add

### **MUST NOT DO**
- ❌ Implement your own price calculations
- ❌ Skip session initialization
- ❌ Directly manipulate cart without store
- ❌ Forget to handle loading states

---

## 🧪 Testing Integration

### **Test Session Creation**
```typescript
// Check if session ID is created
console.log('Session ID:', useConfiguratorStore.getState().sessionId)
```

### **Test Selection Tracking**
```typescript
// Make a selection and check backend
await updateSelection({ category: 'nest', value: 'nest80', name: 'Nest 80', price: 155500 })
// Check Redis/PostgreSQL for tracking data
```

### **Test Price Calculation**
```typescript
// Verify prices match backend calculations
const { currentPrice } = useConfiguratorStore.getState()
console.log('Frontend price:', currentPrice)
// Compare with direct API call
```

### **Test Cart Integration**
```typescript
// Add to cart and verify persistence
addConfigurationToCart(config)
// Check localStorage and cart state
console.log('Cart items:', useCartStore.getState().items)
```

---

This integration ensures your configurator seamlessly works with the backend tracking and cart system while giving you complete UI/UX freedom! 
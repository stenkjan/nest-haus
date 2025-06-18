# Material Slider Dialogs

This directory contains a unified system for managing material slider dialogs. All dialogs that use the `MaterialsSlider` component now share the same structure and behavior, with only the content (titles, cards, and links) being different.

## Architecture

### Core Components

1. **`MaterialSliderDialog.tsx`** - The unified dialog component that handles all the UI logic
2. **`dialogConfigs.ts`** - Configuration file containing all dialog content
3. **Individual dialog files** - Thin wrappers that use the unified component
4. **`utils.ts`** - Helper functions for creating and validating configurations
5. **`index.ts`** - Centralized exports

### Benefits

- **DRY (Don't Repeat Yourself)**: All dialog logic is in one place
- **Consistency**: All dialogs behave exactly the same way
- **Easy maintenance**: Changes to dialog behavior only need to be made in one file
- **Type safety**: Full TypeScript support with proper interfaces
- **Easy to extend**: Adding new dialogs is just adding configuration

## Usage

### Using Existing Dialogs

```tsx
import { MaterialsDialog, FensterDialog, InnenverkleidungDialog, PhotovoltaikDialog } from '@/app/dialogs';

// Use any dialog component
<MaterialsDialog isOpen={isOpen} onClose={onClose} />
<FensterDialog isOpen={isOpen} onClose={onClose} />
```

### Using the Unified Component Directly

```tsx
import { MaterialSliderDialog, dialogConfigs } from '@/app/dialogs';

// Use with existing config
<MaterialSliderDialog 
  isOpen={isOpen} 
  onClose={onClose} 
  config={dialogConfigs.materials} 
/>

// Use with custom config
<MaterialSliderDialog 
  isOpen={isOpen} 
  onClose={onClose} 
  config={myCustomConfig} 
/>
```

## Adding New Dialogs

### Method 1: Add to Configuration File

1. **Add your configuration to `dialogConfigs.ts`:**

```typescript
export const dialogConfigs = {
  // ... existing configs
  
  myNewDialog: {
    title: {
      main: "My New Dialog",
      subtitle: "Subtitle Text"
    },
    sliderKey: "my-new-dialog-slider",
    actionButton: {
      text: "Learn More",
      href: "/my-new-page"
    },
    cards: [
      {
        id: 1,
        title: "Card Title",
        subtitle: "Card Subtitle",
        description: "Card description...",
        imagePath: IMAGES.path.to.image
      },
      // ... more cards
    ]
  }
};
```

2. **Create a wrapper component (optional):**

```typescript
// src/app/dialogs/MyNewDialog.tsx
'use client';

import React from 'react';
import MaterialSliderDialog from './MaterialSliderDialog';
import { dialogConfigs } from './dialogConfigs';

interface MyNewDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyNewDialog: React.FC<MyNewDialogProps> = ({ isOpen, onClose }) => {
  return (
    <MaterialSliderDialog
      isOpen={isOpen}
      onClose={onClose}
      config={dialogConfigs.myNewDialog}
    />
  );
};

export default MyNewDialog;
```

3. **Export in `index.ts`:**

```typescript
export { default as MyNewDialog } from './MyNewDialog';
```

### Method 2: Create Configuration Programmatically

```typescript
import { createDialogConfig, createMaterialCard, createResponsiveDescription } from '@/app/dialogs/utils';
import { IMAGES } from '@/constants/images';

const myConfig = createDialogConfig({
  title: {
    main: "My Dialog",
    subtitle: "My Subtitle"
  },
  sliderKey: "my-dialog-slider",
  actionButton: {
    text: "Learn More",
    href: "/my-page"
  },
  cards: [
    createMaterialCard({
      id: 1,
      title: "Card 1",
      subtitle: "Subtitle 1",
      description: createResponsiveDescription(
        "Short mobile description...",
        "Longer desktop description with more details..."
      ),
      imagePath: IMAGES.my.image1
    }),
    createMaterialCard({
      id: 2,
      title: "Card 2",
      description: "Same description for both mobile and desktop",
      imagePath: IMAGES.my.image2
    })
  ]
});

// Use directly
<MaterialSliderDialog isOpen={isOpen} onClose={onClose} config={myConfig} />
```

## Configuration Structure

### MaterialSliderDialogConfig

```typescript
interface MaterialSliderDialogConfig {
  title: {
    main: string;        // Main title (always visible)
    subtitle?: string;   // Subtitle (hidden on mobile, shown on desktop)
  };
  cards: MaterialCard[];
  actionButton: {
    text: string;        // Button text (e.g., "Mehr erfahren")
    href: string;        // Link destination
  };
  sliderKey: string;     // Unique key for React (e.g., "materials-slider")
}
```

### MaterialCard

```typescript
interface MaterialCard {
  id: number;
  title: string;
  subtitle?: string;
  description: string | {
    mobile: string;
    desktop: string;
  };
  imagePath: string;
}
```

**Responsive Descriptions**: You can provide different descriptions for mobile and desktop by using an object instead of a string:

```typescript
{
  id: 1,
  title: "Example Card",
  description: {
    mobile: "Short description for mobile",
    desktop: "Longer, more detailed description for desktop users"
  },
  imagePath: IMAGES.example
}
```

## Existing Dialogs

| Dialog | Config Key | Purpose |
|--------|------------|---------|
| MaterialsDialog | `materials` | General materials overview |
| InnenverkleidungDialog | `innenverkleidung` | Interior cladding materials |
| FensterDialog | `fenster` | Window types and options |
| PhotovoltaikDialog | `photovoltaik` | Solar panel information |

## Making Global Changes

To change behavior for ALL dialogs, edit `MaterialSliderDialog.tsx`. Common changes might include:

- **Styling**: Modify CSS classes or styles
- **Animation**: Change transition effects
- **Layout**: Adjust responsive behavior
- **Functionality**: Add new features like keyboard navigation

To change content for a specific dialog, edit the corresponding configuration in `dialogConfigs.ts`.

## Validation

Use the validation utility to ensure your configuration is correct:

```typescript
import { validateDialogConfig } from '@/app/dialogs/utils';

try {
  validateDialogConfig(myConfig);
  console.log('Configuration is valid!');
} catch (error) {
  console.error('Configuration error:', error.message);
}
```

## Responsive Descriptions

The system supports different descriptions for mobile and desktop devices. This is useful when you want to show shorter, more concise text on mobile devices and longer, more detailed descriptions on desktop.

### Usage

```typescript
// Option 1: Using the helper function
import { createResponsiveDescription } from '@/app/dialogs/utils';

const card = {
  id: 1,
  title: "Material Name",
  description: createResponsiveDescription(
    "Short mobile text",
    "Longer desktop description with more details"
  ),
  imagePath: IMAGES.material.example
};

// Option 2: Direct object
const card = {
  id: 1,
  title: "Material Name",
  description: {
    mobile: "Short mobile text",
    desktop: "Longer desktop description with more details"
  },
  imagePath: IMAGES.material.example
};

// Option 3: Same text for both (backward compatible)
const card = {
  id: 1,
  title: "Material Name",
  description: "Same text for both mobile and desktop",
  imagePath: IMAGES.material.example
};
```

### Breakpoint

The system uses a breakpoint of **768px** to determine mobile vs desktop:
- **Mobile**: `window.innerWidth < 768px` - shows `description.mobile`
- **Desktop**: `window.innerWidth >= 768px` - shows `description.desktop`

## Best Practices

1. **Unique slider keys**: Always use unique `sliderKey` values
2. **Consistent image paths**: Use the `IMAGES` constant for all image references
3. **Descriptive titles**: Make titles clear and descriptive
4. **Reasonable card counts**: 3-11 cards work best for the slider
5. **Consistent button text**: Use "Mehr erfahren" for consistency
6. **Validate configurations**: Use the validation utility during development
7. **Responsive descriptions**: Consider using shorter descriptions for mobile devices to improve readability 
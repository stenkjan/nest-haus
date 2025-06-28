import { MaterialSliderDialogConfig, MaterialCard } from './MaterialSliderDialog';

/**
 * Helper function to create a new dialog configuration
 * @param config - The dialog configuration object
 * @returns A complete MaterialSliderDialogConfig
 */
export function createDialogConfig(config: {
  title: {
    main: string;
    subtitle?: string;
  };
  cards: MaterialCard[];
  actionButton: {
    text: string;
    href: string;
  };
  sliderKey: string;
}): MaterialSliderDialogConfig {
  return {
    title: config.title,
    cards: config.cards,
    actionButton: config.actionButton,
    sliderKey: config.sliderKey,
  };
}

/**
 * Helper function to create a material card
 * @param card - The card data
 * @returns A complete MaterialCard
 */
export function createMaterialCard(card: {
  id: number;
  title: string;
  subtitle?: string;
  description: string | {
    mobile: string;
    desktop: string;
  };
  imagePath: string;
}): MaterialCard {
  return {
    id: card.id,
    title: card.title,
    subtitle: card.subtitle,
    description: card.description,
    imagePath: card.imagePath,
  };
}

/**
 * Helper function to create responsive descriptions
 * @param mobile - Description for mobile devices
 * @param desktop - Description for desktop devices
 * @returns Object with mobile and desktop descriptions
 */
export function createResponsiveDescription(mobile: string, desktop: string): { mobile: string; desktop: string } {
  return { mobile, desktop };
}

/**
 * Helper function to validate a dialog configuration
 * @param config - The dialog configuration to validate
 * @returns True if valid, throws error if invalid
 */
export function validateDialogConfig(config: MaterialSliderDialogConfig): boolean {
  if (!config.title?.main) {
    throw new Error('Dialog config must have a main title');
  }
  
  if (!config.cards || config.cards.length === 0) {
    throw new Error('Dialog config must have at least one card');
  }
  
  if (!config.actionButton?.text || !config.actionButton?.href) {
    throw new Error('Dialog config must have a valid action button with text and href');
  }
  
  if (!config.sliderKey) {
    throw new Error('Dialog config must have a unique slider key');
  }
  
  // Validate each card
  config.cards.forEach((card, index) => {
    if (!card.title) {
      throw new Error(`Card at index ${index} must have a title`);
    }
    if (!card.description) {
      throw new Error(`Card at index ${index} must have a description`);
    }
    if (typeof card.description === 'object') {
      if (!card.description.mobile || !card.description.desktop) {
        throw new Error(`Card at index ${index} must have both mobile and desktop descriptions when using object format`);
      }
    }
    if (!card.imagePath) {
      throw new Error(`Card at index ${index} must have an image path`);
    }
  });
  
  return true;
} 
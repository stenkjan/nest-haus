/**
 * Data transformation utility for converting old configurator dialog configs
 * to the new ContentCards format
 */

interface DialogCard {
  id: number;
  title: string;
  subtitle: string;
  description: {
    mobile: string;
    desktop: string;
  };
  imagePath: string;
}

interface DialogConfig {
  title: {
    main: string;
    subtitle: string;
  };
  sliderKey: string;
  actionButton: {
    text: string;
    href: string;
  };
  cards: DialogCard[];
}

interface ContentCard {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  mobileTitle?: string;
  mobileSubtitle?: string;
  mobileDescription?: string;
  image: string;
  backgroundColor: string;
}

interface TransformedDialogData {
  title: string;
  subtitle: string;
  cards: ContentCard[];
  actionButton?: {
    text: string;
    href: string;
  };
}

// Default background colors for different categories
const CATEGORY_COLORS = {
  materials: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8'],
  innenverkleidung: ['#fefcfb', '#fef7ed', '#fed7aa', '#fdba74', '#fb923c'],
  fenster: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80'],
  fussboden: ['#fefdf2', '#fef3c7', '#fde68a', '#f59e0b', '#d97706'],
  photovoltaik: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8'],
} as const;

/**
 * Transform old configurator dialog config to ContentCards format
 */
export function transformDialogConfig(
  categoryKey: keyof typeof CATEGORY_COLORS,
  dialogConfig: DialogConfig
): TransformedDialogData {
  const categoryColors = CATEGORY_COLORS[categoryKey];
  
  const transformedCards: ContentCard[] = dialogConfig.cards.map((card, _index) => ({
    id: card.id,
    title: card.title,
    subtitle: card.subtitle,
    description: card.description.desktop,
    mobileDescription: card.description.mobile,
    image: `/api/images?path=${encodeURIComponent(card.imagePath)}`,
    backgroundColor: categoryColors[0] // Use first color for all cards
  }));

  return {
    title: dialogConfig.title.main,
    subtitle: dialogConfig.title.subtitle,
    cards: transformedCards,
    actionButton: dialogConfig.actionButton
  };
}

/**
 * Get configurator dialog data for specific categories
 */
export async function getConfiguratorDialogData(categoryKey: keyof typeof CATEGORY_COLORS) {
  // Import the dialogConfigs from our new data structure
  const { dialogConfigs } = await import('../data/dialogConfigs');
  
  const config = dialogConfigs[categoryKey];
  if (!config) {
    throw new Error(`Dialog config not found for category: ${categoryKey}`);
  }

  return transformDialogConfig(categoryKey, config);
}

export type { TransformedDialogData, ContentCard }; 
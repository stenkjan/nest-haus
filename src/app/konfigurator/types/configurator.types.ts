/**
 * Core Configurator Types
 * 
 * TypeScript definitions for the new configurator architecture.
 * Extracted and cleaned up from legacy configurator types.
 */

// ===== CORE TYPES =====

export type ViewType = 'exterior' | 'interior' | 'pv' | 'fenster';

export type SelectionCategory = 
  | 'nest' 
  | 'gebaeudehuelle' 
  | 'innenverkleidung' 
  | 'fussboden' 
  | 'pvanlage' 
  | 'fenster' 
  | 'paket' 
  | 'grundstueckscheck';

// ===== NEW MODULAR ARCHITECTURE TYPES =====

export interface ConfigurationItem {
  category: string;
  value: string;
  name: string;
  price: number;
  description?: string;
  quantity?: number;
  squareMeters?: number;
}

export interface ProcessedSelection {
  selection: ConfigurationItem;
  priceImpact: PriceImpact;
  recommendedView: string;
  nextSuggestions: ConfigurationItem[];
  performance: {
    processingTime: number;
    imagePreloadStatus?: string;
  };
}

export interface PriceImpact {
  totalChange: number;
  breakdown: {
    baseChange: number;
    optionChanges: Record<string, number>;
  };
}

export interface PriceImpactResult {
  totalChange: number;
  breakdown: {
    baseChange: number;
    optionChanges: Record<string, number>;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FullConfiguration {
  sessionId: string;
  selections: ConfigurationItem[];
  totalPrice: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface SelectionContext {
  currentConfiguration?: Record<string, unknown>;
  sessionId?: string | null;
  userAgent?: string;
  timestamp: number;
}

export interface OptimisticState {
  selection: ConfigurationItem;
  estimatedPrice: number;
  timestamp: number;
  processingStartTime: number;
}

// ===== EXISTING TYPES (PRESERVED) =====

export interface SelectionOption {
  value: string;
  name: string;
  category: SelectionCategory;
  description?: string;
  price: number;
  included?: boolean;
  imageKey?: string;
  
  // Optional quantity-based properties
  quantity?: number;
  squareMeters?: number;
}

export interface Selections {
  nest?: SelectionOption;
  gebaeudehuelle?: SelectionOption;
  innenverkleidung?: SelectionOption;
  fussboden?: SelectionOption;
  pvanlage?: SelectionOption & { quantity?: number };
  fenster?: SelectionOption & { squareMeters?: number };
  paket?: SelectionOption;
  grundstueckscheck?: SelectionOption;
}

export interface ConfigurationSelections {
  nest: string;
  gebaeudehuelle: string;
  innenverkleidung: string;
  fussboden: string;
}

// ===== CONFIGURATION TYPES =====

export interface Configuration {
  id: string;
  nest: string;
  gebaeudehuelle: string;
  innenverkleidung: string;
  fussboden: string;
  pvanlage?: string;
  fenster?: string;
  planungspaket?: string;
  selections: Selections;
  totalPrice: number;
  timestamp: number;
  status: 'active' | 'abandoned' | 'ordered' | 'completed';
}

export interface PriceBreakdown {
  basePrice: number;
  options: {
    [key: string]: {
      name: string;
      price: number;
    };
  };
  totalPrice: number;
}

// ===== UI STATE TYPES =====

export interface ConfiguratorState {
  selections: Selections;
  activeView: ViewType;
  totalPrice: number;
  isLoading: boolean;
  hasPart2BeenActive: boolean;
  hasPart3BeenActive: boolean;
}

export interface PreviewState {
  currentView: ViewType;
  availableViews: ViewType[];
  isImageLoading: boolean;
  imageError?: string;
}

// ===== COMPONENT PROPS =====

export interface ConfiguratorProps {
  initialModel?: string;
  onSelectionChange?: (selections: Selections) => void;
  onPriceChange?: (price: number) => void;
}

export interface SelectionBoxProps {
  option: SelectionOption;
  isSelected: boolean;
  onClick: (option: SelectionOption) => void;
  currentSelections?: Selections;
  disabled?: boolean;
}

export interface PreviewPanelProps {
  selections: Selections;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  availableViews: ViewType[];
}

export interface SummaryPanelProps {
  selections: Selections;
  totalPrice: number;
  priceBreakdown?: PriceBreakdown;
  onCheckout: () => void;
}

// ===== API TYPES =====

export interface ConfiguratorApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
} 
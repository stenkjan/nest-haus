// Export the unified dialog component and configuration
export { default as MaterialSliderDialog } from './MaterialSliderDialog';
export type { MaterialSliderDialogConfig, MaterialCard } from './MaterialSliderDialog';
export { dialogConfigs } from './dialogConfigs';

// Export utility functions
export { createDialogConfig, createMaterialCard, createResponsiveDescription, validateDialogConfig } from './utils';

// Export individual dialog components (now using the unified system)
export { default as MaterialsDialog } from './MaterialDialog';
export { default as InnenverkleidungDialog } from './InnenverkleidungDialog';
export { default as FensterDialog } from './FensterDialog';
export { default as PhotovoltaikDialog } from './PhotovoltaikDialog';

// Export other dialogs that don't use the material slider system
export { default as GenericDialog } from './GenericDialog'; 
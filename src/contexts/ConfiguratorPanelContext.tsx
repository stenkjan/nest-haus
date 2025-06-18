import { createContext, useContext, RefObject } from 'react';

export const ConfiguratorPanelContext = createContext<RefObject<HTMLDivElement | null> | null>(null);

export function useConfiguratorPanelRef() {
  return useContext(ConfiguratorPanelContext);
}

export const ConfiguratorPanelProvider = ConfiguratorPanelContext.Provider; 
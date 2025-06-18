// src/context/DialogContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import ConfiguratorDialogs from '@/dialogs/ConfiguratorDialogs';
import { DialogType } from '../types/dialog';

// Configurator specific state
interface ConfiguratorState {
  selectedPackage: string | null;
}

interface DialogContextType {
  isOpen: boolean;
  dialogType: DialogType;
  infoKey: string;
  configuratorState: ConfiguratorState;
  showExtendedInfo: boolean;
  openDialog: (type: DialogType, key?: string, showExtendedInfo?: boolean) => void;
  closeDialog: () => void;
  setSelectedPackage: (packageId: string | null) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [infoKey, setInfoKey] = useState('');
  const [showExtendedInfo, setShowExtendedInfo] = useState(false);

  // Configurator specific state
  const [configuratorState, setConfiguratorState] = useState<ConfiguratorState>({
    selectedPackage: null,
  });

  const openDialog = (type: DialogType, key: string = '', extendedInfo: boolean = false) => {
    console.log('Opening dialog:', type, key);
    setDialogType(type);
    setInfoKey(key);
    setShowExtendedInfo(extendedInfo);
    setIsOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when dialog is open
  };

  const closeDialog = () => {
    setIsOpen(false);
    document.body.style.overflow = ''; // Re-enable scrolling
    // Wait for animation to finish before resetting type
    setTimeout(() => {
      setDialogType(null);
      setInfoKey('');
      setShowExtendedInfo(false);
    }, 300);
  };

  const setSelectedPackage = (packageId: string | null) => {
    setConfiguratorState(prev => ({
      ...prev,
      selectedPackage: packageId
    }));
  };

  return (
    <DialogContext.Provider
      value={{
        isOpen,
        dialogType,
        infoKey,
        configuratorState,
        showExtendedInfo,
        openDialog,
        closeDialog,
        setSelectedPackage
      }}
    >
      {children}
      {isOpen && (
        <ConfiguratorDialogs
          isOpen={isOpen}
          dialogType={dialogType}
          infoKey={infoKey}
          onClose={closeDialog}
          showExtendedInfo={showExtendedInfo}
        />
      )}
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}
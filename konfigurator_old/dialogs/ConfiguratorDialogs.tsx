// src/components/dialogs/ConfiguratorDialogs.tsx
'use client';

import React, { useState, useEffect } from 'react';
import CarouselDialog from './CarouselDialog';
import CalendarDialog from './CalendarDialog';
import MaterialsDialog from './MaterialDialog';
import InnenverkleidungDialog from './InnenverkleidungDialog';
import PlanungspaketeDialog from './PlanungspaketeDialog';
import GenericDialog from './GenericDialog';
import PhotovoltaikDialog from './PhotovoltaikDialog';
import { useDialog } from '@/context/DialogContext';
import { DialogType } from '../types/dialog';
import GrundstueckCheckDialog from './GrundstueckCheckDialog';
import FensterDialog from './FensterDialog';

interface ConfiguratorDialogsProps {
  isOpen: boolean;
  dialogType: DialogType;
  infoKey?: string;
  onClose: () => void;
  showExtendedInfo?: boolean;
}

const ConfiguratorDialogs: React.FC<ConfiguratorDialogsProps> = ({
  isOpen,
  dialogType,
  infoKey = '',
  onClose,
  showExtendedInfo = false
}) => {
  const { setSelectedPackage } = useDialog();
  // Track dialog visibility with animation states
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowDialog(true);
    } else {
      // Add slight delay to allow for exit animations
      const timer = setTimeout(() => setShowDialog(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!showDialog || !dialogType) return null;

  // Handle package selection from dialog
  const handleSelectPackage = (packageId: string | null) => {
    setSelectedPackage(packageId);
    onClose();
  };

  const renderDialog = () => {
    switch (dialogType) {
      case 'carousel':
        return (
          <CarouselDialog
            isOpen={isOpen}
            onClose={onClose}
            infoKey={infoKey || ''}
          />
        );
      
      case 'calendar':
      case 'beratung':
        return (
          <CalendarDialog
            isOpen={isOpen}
            onClose={onClose}
          />
        );

      case 'contact':
      case 'grundcheck':
        return (
          <GrundstueckCheckDialog 
            isOpen={isOpen}
            onClose={onClose}
          />
        );

      case 'materialien':
        return (
          <MaterialsDialog 
            isOpen={isOpen}
            onClose={onClose}
          />
        );

      case 'innenverkleidung':
        return (
          <InnenverkleidungDialog 
            isOpen={isOpen}
            onClose={onClose}
          />
        );

      case 'photovoltaik':
        return (
          <PhotovoltaikDialog 
            isOpen={isOpen}
            onClose={onClose}
          />
        );

      case 'planungspaket':
        return (
          <PlanungspaketeDialog 
            isOpen={isOpen}
            onClose={onClose}
            onSelectPackage={handleSelectPackage}
            showExtendedInfo={showExtendedInfo}
          />
        );
        
      // Generic dialogs for simpler content
      case 'energie':
      case 'system': 
      case 'gemeinsam':
        return (
          <GenericDialog 
            isOpen={isOpen}
            onClose={onClose}
            dialogType={dialogType}
          />
        );
        
      case 'fenster':
        return (
          <FensterDialog
            isOpen={isOpen}
            onClose={onClose}
          />
        );
        
      default:
        return null;
    }
  };

  return renderDialog();
};

export default ConfiguratorDialogs;
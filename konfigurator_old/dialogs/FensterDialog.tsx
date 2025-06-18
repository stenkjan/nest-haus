'use client';

import React from 'react';
import MaterialSliderDialog from './MaterialSliderDialog';
import { dialogConfigs } from './dialogConfigs';

interface FensterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const FensterDialog: React.FC<FensterDialogProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <MaterialSliderDialog
      isOpen={isOpen}
      onClose={onClose}
      config={dialogConfigs.fenster}
    />
  );
};

export default FensterDialog; 
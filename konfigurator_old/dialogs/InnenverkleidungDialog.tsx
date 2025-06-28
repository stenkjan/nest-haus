// src/app/dialogs/InnenverkleidungDialog.tsx
'use client';

import React from 'react';
import MaterialSliderDialog from './MaterialSliderDialog';
import { dialogConfigs } from './dialogConfigs';

interface InnenverkleidungDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const InnenverkleidungDialog: React.FC<InnenverkleidungDialogProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <MaterialSliderDialog
      isOpen={isOpen}
      onClose={onClose}
      config={dialogConfigs.innenverkleidung}
    />
  );
};

export default InnenverkleidungDialog;
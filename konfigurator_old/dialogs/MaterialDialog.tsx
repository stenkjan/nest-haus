// src/app/dialogs/MaterialDialog.tsx
'use client';

import React from 'react';
import MaterialSliderDialog from './MaterialSliderDialog';
import { dialogConfigs } from './dialogConfigs';

interface MaterialsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const MaterialsDialog: React.FC<MaterialsDialogProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <MaterialSliderDialog
      isOpen={isOpen}
      onClose={onClose}
      config={dialogConfigs.materials}
    />
  );
};

export default MaterialsDialog;
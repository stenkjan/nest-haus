'use client';

import React from 'react';
import MaterialSliderDialog from './MaterialSliderDialog';
import { dialogConfigs } from './dialogConfigs';

interface PhotovoltaikDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const PhotovoltaikDialog: React.FC<PhotovoltaikDialogProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <MaterialSliderDialog
      isOpen={isOpen}
      onClose={onClose}
      config={dialogConfigs.photovoltaik}
    />
  );
};

export default PhotovoltaikDialog; 
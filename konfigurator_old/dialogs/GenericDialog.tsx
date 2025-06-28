// src/components/custom/dialogs/GenericDialog.tsx
'use client';

import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { DialogType } from '../types/dialog';

interface GenericDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dialogType: DialogType;
}

const GenericDialog: React.FC<GenericDialogProps> = ({
  isOpen,
  onClose,
  dialogType
}) => {
  // Title mapping based on dialog type
  const getTitleByType = () => {
    switch (dialogType) {
      case 'energie': return 'Energieausweis A++';
      case 'system': return 'Patentiertes System';
      case 'gemeinsam': return 'Gemeinsam Großes Schaffen';
      default: return 'Information';
    }
  };

  // Content mapping based on dialog type
  const getContentByType = () => {
    switch (dialogType) {
      case 'energie':
        return (
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="mb-4">Hier findest du alle wichtigen Informationen zum Energieausweis deines Nests.</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Heizungsart: Gasbrennwerttherme</li>
              <li>Primärenergiebedarf: 120 kWh/m²a</li>
              <li>Endenergiebedarf: 95 kWh/m²a</li>
              <li>CO₂-Emissionen: 25 kg/m²a</li>
              <li>Energieeffizienzklasse: A++</li>
              <li>Berechnungsnorm: DIN V 18599</li>
              <li>Skala: A+ bis H</li>
            </ul>
          </div>
        );

      case 'system':
        return (
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="mb-4">Details zur einzigartigen Technologie, die dein Nest transportabel macht.</p>
            <p>Die Technologie, die dein Nest transportabel macht, wird mittels unseres patentierten Systems sichergestellt. Unsere technischen Innovationen sind einzigartig am Markt und wurden in Kooperation mit der "Technical University of Graz" entwickelt.</p>
            <p className="mt-4">Erprobt im Labor für Bauphysik und getestet unter realen Bedingungen in Österreich. Dein Nest.</p>
          </div>
        );

      case 'gemeinsam':
        return (
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="mb-4">Wie du dein Nest individuell anpassen und optimieren kannst.</p>
            <p>Wir konzentrieren uns darauf, alle standardisierten Arbeitsprozesse zu optimieren und höchste Qualität zu fairen Preisen sicherzustellen.</p>
            <p className="mt-4">Darauf aufbauend machst du dein Nest individuell.</p>
          </div>
        );

      default:
        return <p>Keine Informationen verfügbar.</p>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl p-6 rounded-lg backdrop-blur-md fixed top-1/2 left-0 right-0 mx-auto -translate-y-1/2">
        <DialogTitle className="text-3xl font-light text-center mb-2">{getTitleByType()}</DialogTitle>
        <div className="mt-6 w-full max-h-full">
          {getContentByType()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenericDialog;
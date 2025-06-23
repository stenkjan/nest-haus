// src/app/providers.tsx
'use client';

import React from 'react';
import { DialogProvider } from '@/context/DialogContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DialogProvider>
      {children}
    </DialogProvider>
  );
}
"use client";

import { GrundstueckCheckDialog } from "@/components/dialogs";

// Client wrapper component to handle function props for server components
const GrundstueckCheckWrapper = () => {
  return (
    <GrundstueckCheckDialog 
      isOpen={true} 
      onClose={() => {}} 
    />
  );
};

export default GrundstueckCheckWrapper; 
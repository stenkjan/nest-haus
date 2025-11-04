"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui";

interface VorentwurfButtonProps {
  selectedNest: string | null;
  selectedFacade: string | null;
}

export default function VorentwurfButton({
  selectedNest,
  selectedFacade,
}: VorentwurfButtonProps) {
  const router = useRouter();
  const { setOhneNestMode } = useCartStore();

  const handleClick = useCallback(async () => {
    // Activate ohne nest mode
    setOhneNestMode(true);

    // Optionally save minimal configuration to session
    // We can skip this for now since we're in "ohne nest" mode
    // which means we're not configuring a full nest

    // Navigate to warenkorb with vorentwurf mode
    router.push('/warenkorb?mode=vorentwurf#übersicht');
  }, [router, setOhneNestMode]);

  // Button is always enabled - user can proceed even without selections
  return (
    <div className="pt-6 border-t border-gray-200">
      <Button
        onClick={handleClick}
        className="w-full py-4 text-lg font-semibold"
      >
        Direkt zum Vorentwurf
      </Button>
      
      {(!selectedNest || !selectedFacade) && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          Hinweis: Bitte wähle Größe und Fassade für eine bessere Beratung
        </p>
      )}
    </div>
  );
}




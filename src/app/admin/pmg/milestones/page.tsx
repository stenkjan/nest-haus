import { Metadata } from "next";
import MilestonesManager from "./components/MilestonesManager";

export const metadata: Metadata = {
  title: "Meilensteine - NEST-Haus Admin",
  description: "Verwaltung der wichtigen Projekt-Meilensteine",
};

export default function MilestonesPage() {
  return (
    <div className="min-h-screen bg-gray-50 mt-8">
      <MilestonesManager />
    </div>
  );
}

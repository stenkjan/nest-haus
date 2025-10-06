import { Metadata } from "next";
import ProjectManagementDashboard from "./components/ProjectManagementDashboard";

export const metadata: Metadata = {
  title: "Projekt Management Dashboard - NEST-Haus Admin",
  description: "Interaktives Dashboard für die Launch-Vorbereitung NEST-Haus",
};

export default function ProjectManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectManagementDashboard />
    </div>
  );
}

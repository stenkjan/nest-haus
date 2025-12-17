import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProjectManagementDashboard from "./components/ProjectManagementDashboard";

export const metadata: Metadata = {
  title: "Projekt Management Dashboard - NEST-Haus Admin",
  description: "Interaktives Dashboard für die Launch-Vorbereitung NEST-Haus",
};

export default async function ProjectManagementPage() {
  // Server-side authentication check
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("hoam-admin-auth");

    if (!authCookie || authCookie.value !== adminPassword) {
      redirect("/admin/auth?redirect=" + encodeURIComponent("/admin/pmg"));
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectManagementDashboard />
    </div>
  );
}

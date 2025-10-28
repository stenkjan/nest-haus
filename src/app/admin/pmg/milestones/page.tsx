import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MilestonesManager from "./components/MilestonesManager";

export const metadata: Metadata = {
  title: "Meilensteine - NEST-Haus Admin",
  description: "Verwaltung der wichtigen Projekt-Meilensteine",
};

export default async function MilestonesPage() {
  // Server-side authentication check
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("nest-haus-admin-auth");

    if (!authCookie || authCookie.value !== adminPassword) {
      redirect(
        "/admin/auth?redirect=" + encodeURIComponent("/admin/pmg/milestones")
      );
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 mt-8">
      <MilestonesManager />
    </div>
  );
}

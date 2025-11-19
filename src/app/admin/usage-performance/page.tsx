import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UsagePerformanceClient from "./Client";

export default async function UsagePerformancePage() {
  // Server-side authentication check
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("nest-haus-admin-auth");

    if (!authCookie || authCookie.value !== adminPassword) {
      redirect(
        "/admin/auth?redirect=" + encodeURIComponent("/admin/usage-performance")
      );
    }
  }

  return <UsagePerformanceClient />;
}


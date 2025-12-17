import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UsageClient from "./Client";

export default async function UsagePage() {
  // Server-side authentication check
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("hoam-admin-auth");

    if (!authCookie || authCookie.value !== adminPassword) {
      redirect("/admin/auth?redirect=" + encodeURIComponent("/admin/usage"));
    }
  }

  return <UsageClient />;
}

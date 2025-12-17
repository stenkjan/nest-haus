import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SyncClient from "./SyncClient";

export default async function SyncPage() {
  // Server-side authentication check
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("hoam-admin-auth");

    if (!authCookie || authCookie.value !== adminPassword) {
      redirect("/admin/auth?redirect=" + encodeURIComponent("/admin/sync"));
    }
  }

  return <SyncClient />;
}

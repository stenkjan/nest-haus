import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AlphaTestClient from "./AlphaTestClient";

// Server Component with authentication check
export default async function AlphaTestDemo() {
  // Server-side authentication check
  const correctPassword = process.env.SITE_PASSWORD;

  if (correctPassword) {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("nest-haus-auth");

    console.log("[ALPHA_TEST_SERVER] Password protection enabled");
    console.log("[ALPHA_TEST_SERVER] Auth cookie exists:", !!authCookie);

    if (!authCookie || authCookie.value !== correctPassword) {
      console.log("[ALPHA_TEST_SERVER] Redirecting to auth page");
      redirect("/auth?redirect=" + encodeURIComponent("/alpha-test"));
    }

    console.log("[ALPHA_TEST_SERVER] User authenticated, rendering alpha test");
  }

  return <AlphaTestClient />;
}

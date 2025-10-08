import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface AuthWrapperProps {
  children: ReactNode;
  redirectPath?: string;
}

/**
 * Server-side authentication wrapper component
 * Checks for password protection and redirects if not authenticated
 */
export default function AuthWrapper({ 
  children, 
  redirectPath = "/" 
}: AuthWrapperProps) {
  // Server-side authentication check
  const correctPassword = process.env.SITE_PASSWORD;
  
  if (correctPassword) {
    const cookieStore = cookies();
    const authCookie = cookieStore.get('nest-haus-auth');
    
    console.log('[AUTH_WRAPPER] Password protection enabled for:', redirectPath);
    console.log('[AUTH_WRAPPER] Auth cookie exists:', !!authCookie);
    
    if (!authCookie || authCookie.value !== correctPassword) {
      console.log('[AUTH_WRAPPER] Redirecting to auth page');
      redirect('/auth?redirect=' + encodeURIComponent(redirectPath));
    }
    
    console.log('[AUTH_WRAPPER] User authenticated, rendering content');
  }

  return <>{children}</>;
}

import { Suspense } from "react";
import AdminAuthForm from "./AdminAuthForm";

// Admin password protection

export default function AdminAuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">NEST-Haus Admin</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter the admin password to continue
          </p>
        </div>

        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <AdminAuthForm />
        </Suspense>
      </div>
    </div>
  );
}

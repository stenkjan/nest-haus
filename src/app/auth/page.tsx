import { Suspense } from "react";
import AuthForm from "./AuthForm";

// Password protection activated

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">NEST-Haus</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter the password to continue
          </p>
        </div>

        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}

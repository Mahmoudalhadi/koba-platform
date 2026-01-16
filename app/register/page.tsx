"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import AuthLayout from "@/components/ui/AuthLayout";
import AuthCard from "@/components/ui/AuthCard";
import TextField from "@/components/ui/TextField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import HelperLink from "@/components/ui/HelperLink";
import Alert from "@/components/ui/Alert";

// Helper function to build redirect URL with validation
function getRedirectUrl(redirectPath: string | null): string {
  const baseUrl = "https://kobaplc.com";
  
  // Validate redirect path: must start with "/" and be a relative path
  if (redirectPath && redirectPath.startsWith("/") && !redirectPath.includes("://")) {
    return `${baseUrl}${redirectPath}`;
  }
  
  // Default to base URL
  return baseUrl;
}

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Get redirect path from query params, default to "/"
    const redirectPath = searchParams.get("redirect") || "/";
    const redirectTo = getRedirectUrl(redirectPath);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data?.session) {
      // Session returned, redirect to main site (full URL required for cross-domain redirect)
      window.location.href = redirectTo;
    } else {
      // Email confirmation enabled, show message
      setSuccess("Check your email to confirm your account.");
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h2>

        {error && <Alert type="error" message={error} aria-live="assertive" />}
        {success && <Alert type="success" message={success} aria-live="polite" />}

        <form onSubmit={register} noValidate>
          <TextField
            id="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            autoComplete="email"
          />

          <TextField
            id="password"
            type="password"
            label="Password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            autoComplete="new-password"
          />

          <PrimaryButton type="submit" loading={loading}>
            {loading ? "Creating..." : "Create Account"}
          </PrimaryButton>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <HelperLink href="/login">Login</HelperLink>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <AuthLayout>
        <AuthCard>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h2>
          <div className="text-center text-gray-600">Loading...</div>
        </AuthCard>
      </AuthLayout>
    }>
      <RegisterForm />
    </Suspense>
  );
}

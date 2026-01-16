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

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Get redirect path from query params, default to "/"
    const redirectPath = searchParams.get("redirect") || "/";
    const redirectTo = getRedirectUrl(redirectPath);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // success: redirect to main site (full URL required for cross-domain redirect)
    window.location.href = redirectTo;
  };

  return (
    <AuthLayout>
      <AuthCard>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>

        {error && <Alert type="error" message={error} aria-live="assertive" />}

        <form onSubmit={login} noValidate>
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            autoComplete="current-password"
          />

          <PrimaryButton type="submit" loading={loading}>
            {loading ? "Logging in..." : "Login"}
          </PrimaryButton>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 text-sm text-gray-600">
            <HelperLink href="/forgot">Forgot password?</HelperLink>
            <span className="sm:inline hidden">•</span>
            <span>
              No account? <HelperLink href="/register">Create one</HelperLink>
            </span>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <AuthLayout>
        <AuthCard>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>
          <div className="text-center text-gray-600">Loading...</div>
        </AuthCard>
      </AuthLayout>
    }>
      <LoginForm />
    </Suspense>
  );
}

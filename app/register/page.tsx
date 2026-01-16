"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import AuthLayout from "@/components/ui/AuthLayout";
import AuthCard from "@/components/ui/AuthCard";
import TextField from "@/components/ui/TextField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import HelperLink from "@/components/ui/HelperLink";
import Alert from "@/components/ui/Alert";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (data?.session) {
      // Session returned, redirect to home
      router.push("/");
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

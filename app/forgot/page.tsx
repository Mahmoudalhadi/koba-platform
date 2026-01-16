"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import AuthLayout from "@/components/ui/AuthLayout";
import AuthCard from "@/components/ui/AuthCard";
import TextField from "@/components/ui/TextField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import HelperLink from "@/components/ui/HelperLink";
import Alert from "@/components/ui/Alert";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const supabase = createSupabaseBrowserClient();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMsg(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://kobaplc.com/login",
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMsg("If an account exists for that email, a password reset link has been sent.");
  };

  return (
    <AuthLayout>
      <AuthCard>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {error && <Alert type="error" message={error} aria-live="assertive" />}
        {msg && <Alert type="success" message={msg} aria-live="polite" />}

        <form onSubmit={submit} noValidate>
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

          <PrimaryButton type="submit" loading={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </PrimaryButton>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            <HelperLink href="/login">Back to login</HelperLink>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}

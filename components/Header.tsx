"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export default function Header() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    router.push("/login");
  };

  return (
    <header style={{ padding: 12, borderBottom: "1px solid #eaeaea", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Image
            src="/logo.png.png"
            alt="Koba Logo"
            width={140}
            height={140}
            style={{ height: "auto", width: "auto", maxWidth: "140px" }}
            priority
            unoptimized
          />
        </Link>
      </div>
      <nav>
        {session?.user ? (
          <>
            <span style={{ marginRight: 12 }}>{session.user.email}</span>
            <button onClick={handleLogout} disabled={loading}>{loading ? "Signing out..." : "Logout"}</button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ marginRight: 12 }}>Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

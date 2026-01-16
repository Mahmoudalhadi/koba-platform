"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabaseBrowser";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
      return;
    }

    // Redirect to login after logout
    router.push("/login");
  };

  return (
    <button
      onClick={logout}
      className="
        px-6 py-2.5 rounded-lg font-medium
        bg-red-600 text-white
        hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        transition-colors duration-200
      "
    >
      Logout
    </button>
  );
}

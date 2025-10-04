"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useLogout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await authClient.signOut();

      // Redirect to login page after successful logout
      router.push("/login");
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed";
      setError(message);
      console.error("Logout error:", err);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading,
    error,
  };
}

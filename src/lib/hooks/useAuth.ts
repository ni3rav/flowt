"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Login failed");
        return { success: false, error: error.message };
      }

      // After successful login, check and set active organization
      try {
        const orgsResponse = await authClient.organization.list();
        if (orgsResponse.data && orgsResponse.data.length > 0) {
          // Set the first organization as active if none is set
          await authClient.organization.setActive({
            organizationId: orgsResponse.data[0].id,
          });
        }
      } catch (orgError) {
        console.error("Error setting active organization:", orgError);
        // Continue to dashboard even if this fails
      }

      // Successful login - redirect to dashboard
      router.push("/dashboard");
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        setError(error.message || "Signup failed");
        return { success: false, error: error.message };
      }

      // After signup, redirect to onboarding to create organization
      router.push("/onboarding");
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await authClient.signOut();
      router.push("/login");
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    isLoading,
    error,
  };
}

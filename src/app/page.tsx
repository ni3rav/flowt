"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (session) {
        // User is logged in - redirect to dashboard
        router.push("/dashboard");
      } else {
        // User is not logged in - redirect to login
        router.push("/login");
      }
    }
  }, [session, isPending, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Redirecting...</p>
    </div>
  );
}

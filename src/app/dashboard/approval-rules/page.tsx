"use client";

import ApprovalRulesForm from "@/components/approval-rules-section";
import { useSession } from "@/lib/auth-client";
import { usePermissions } from "@/lib/hooks/usePermissions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ApprovalRulesPage() {
  const { data: session, isPending } = useSession();
  const { canConfigureRules, isLoading: isPermissionsLoading } =
    usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
    if (!isPending && !isPermissionsLoading && session && !canConfigureRules) {
      router.push("/dashboard");
    }
  }, [session, isPending, canConfigureRules, isPermissionsLoading, router]);

  if (isPending || isPermissionsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session || !canConfigureRules) {
    return null;
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <ApprovalRulesForm />
      </div>
    </>
  );
}

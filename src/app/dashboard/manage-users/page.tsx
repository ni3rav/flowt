"use client";

import { useSession } from "@/lib/auth-client";
import { usePermissions } from "@/lib/hooks/usePermissions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PageTitle from "@/components/page-title";
import { ManageUsersSection } from "@/components/manage-users-section";

export default function ManageUsersPage() {
  const { data: session, isPending } = useSession();
  const { canManageUsers, isLoading: isPermissionsLoading } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
    if (!isPending && !isPermissionsLoading && session && !canManageUsers) {
      router.push("/dashboard");
    }
  }, [session, isPending, canManageUsers, isPermissionsLoading, router]);

  if (isPending || isPermissionsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session || !canManageUsers) {
    return null;
  }

  return (
    <>
      <PageTitle />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <ManageUsersSection />
      </div>
    </>
  );
}

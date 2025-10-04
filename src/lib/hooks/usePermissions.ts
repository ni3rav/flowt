"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export function usePermissions() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [activeMember, setActiveMember] = useState<any>(null);
  const [isMemberLoading, setIsMemberLoading] = useState(true);

  // Fetch active member when session is available
  useEffect(() => {
    const fetchActiveMember = async () => {
      if (!session?.session?.activeOrganizationId) {
        setIsMemberLoading(false);
        return;
      }

      try {
        const member = await authClient.organization.getActiveMember();
        setActiveMember(member.data);
      } catch (error) {
        console.error("Error fetching active member:", error);
      } finally {
        setIsMemberLoading(false);
      }
    };

    if (!isSessionPending) {
      fetchActiveMember();
    }
  }, [session?.session?.activeOrganizationId, isSessionPending]);

  // Map database role to app role (handle both "member" and "employee")
  const normalizeRole = (dbRole: string | undefined) => {
    if (!dbRole) return undefined;
    // Map "member" from database to "employee" in the app
    if (dbRole === "member") return "employee";
    return dbRole as "employee" | "manager" | "admin";
  };

  const role = normalizeRole(activeMember?.role);
  const isLoading = isSessionPending || isMemberLoading;

  const isEmployee = role === "employee";
  const isManager = role === "manager";
  const isAdmin = role === "admin";

  return {
    role,
    isLoading,
    isEmployee,
    isManager,
    isAdmin,
    isAuthenticated: !!session?.user,
    user: session?.user,
    organizationId: session?.session?.activeOrganizationId,

    // Expense permissions
    canCreateExpense: !!role, // All roles can create
    canViewOwnExpenses: !!role,
    canApproveExpenses: isManager || isAdmin,
    canViewAllExpenses: isAdmin,
    canOverrideApprovals: isAdmin,

    // Admin permissions
    canManageUsers: isAdmin,
    canManageRoles: isAdmin,
    canConfigureRules: isAdmin,
  };
}

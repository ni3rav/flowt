"use client";

import { authClient } from "@/lib/auth-client";

export function usePermissions() {
  const { data: session } = authClient.useSession();
  const { data: activeMember } = authClient.organization.useActiveMember();

  const role = activeMember?.role as
    | "employee"
    | "manager"
    | "admin"
    | undefined;
  const isEmployee = role === "employee";
  const isManager = role === "manager";
  const isAdmin = role === "admin";

  return {
    role,
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

"use client";

import * as React from "react";
import { Home, ListCheck, User, WalletMinimal } from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import { usePermissions } from "@/lib/hooks/usePermissions";
import { useLogout } from "@/lib/hooks/useLogout";
import { cn } from "@/lib/utils";

function AppSidebarContent() {
  const { data: session } = useSession();
  const permissions = usePermissions();
  const { role, isLoading: isPermissionsLoading } = permissions;
  const { logout, isLoading: isLoggingOut } = useLogout();
  const { state } = useSidebar();

  // Dynamic navigation items based on permissions
  const projects = React.useMemo(() => {
    const items = [
      {
        name: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
    ];

    if (permissions.canManageUsers) {
      items.push({
        name: "Manage Users",
        url: "/dashboard/manage-users",
        icon: User,
      });
    }

    if (permissions.canConfigureRules) {
      items.push({
        name: "Approval Rules",
        url: "/dashboard/approval-rules",
        icon: ListCheck,
      });
    }

    return items;
  }, [permissions.canManageUsers, permissions.canConfigureRules]);

  const handleLogout = async () => {
    await logout();
  };

  const user = session?.user
    ? {
        name: session.user.name || "User",
        email: session.user.email || "",
        avatar: session.user.image || undefined,
        role: isPermissionsLoading ? undefined : role,
      }
    : {
        name: "Guest",
        email: "",
        avatar: undefined,
        role: undefined,
      };

  const isCollapsed = state === "collapsed";

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "group/header relative",
                "hover:bg-sidebar-accent/50 transition-all duration-200",
                isCollapsed ? "justify-center px-2" : "px-3"
              )}
              tooltip={isCollapsed ? "Flowt" : undefined}
            >
              <div
                className={cn(
                  "flex items-center gap-3 transition-all duration-200",
                  isCollapsed && "justify-center"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center rounded-lg",
                    "bg-gradient-to-br from-primary to-primary/80",
                    "text-primary-foreground shadow-sm",
                    "transition-all duration-200",
                    "group-hover/header:shadow-md group-hover/header:scale-105",
                    isCollapsed ? "size-8" : "size-9"
                  )}
                >
                  <WalletMinimal
                    className={cn(
                      "transition-all duration-200",
                      isCollapsed ? "size-4" : "size-5"
                    )}
                  />
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <span className="text-base font-bold tracking-tight">
                      Flowt
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      Expense Management
                    </span>
                  </div>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={user}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      </SidebarFooter>
    </>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <AppSidebarContent />
      <SidebarRail />
    </Sidebar>
  );
}

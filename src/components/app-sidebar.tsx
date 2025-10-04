"use client";

import * as React from "react";
import { ListCheck, User, WalletMinimal } from "lucide-react";

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
import NavTitle from "./nav-title";
import { useSession } from "@/lib/auth-client";
import { usePermissions } from "@/lib/hooks/usePermissions";
import { useLogout } from "@/lib/hooks/useLogout";
import { cn } from "@/lib/utils";

const projects = [
  {
    name: "Manage Users",
    url: "#",
    icon: User,
  },
  {
    name: "Approval Rules",
    url: "#",
    icon: ListCheck,
  },
];

function AppSidebarContent() {
  const { data: session } = useSession();
  const { role, isLoading: isPermissionsLoading } = usePermissions();
  const { logout, isLoading: isLoggingOut } = useLogout();
  const { state } = useSidebar();

  const handleLogout = async () => {
    await logout();
  };

  const user = session?.user
    ? {
        name: session.user.name || "User",
        email: session.user.email || "",
        avatar: session.user.image,
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

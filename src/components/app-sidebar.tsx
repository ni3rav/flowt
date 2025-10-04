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
} from "@/components/ui/sidebar";
import NavTitle from "./nav-title";
import { useSession } from "@/lib/auth-client";
import { usePermissions } from "@/lib/hooks/usePermissions";
import { useLogout } from "@/lib/hooks/useLogout";

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const { role, isLoading: isPermissionsLoading } = usePermissions();
  const { logout, isLoading: isLoggingOut } = useLogout();

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

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-2 bg-accent text-xl"
            >
              <div className="">
                <WalletMinimal className="!size-6" />
                <span className="font-semibold">Flowt</span>
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
      <SidebarRail />
    </Sidebar>
  );
}

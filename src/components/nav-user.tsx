"use client";

import { LogOut, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function NavUser({
  user,
  onLogout,
  isLoggingOut,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  onLogout?: () => void;
  isLoggingOut?: boolean;
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  if (isCollapsed) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className={cn(
                  "flex items-center justify-center w-full rounded-md p-2",
                  "bg-sidebar-accent text-sidebar-accent-foreground transition hover:bg-sidebar-accent/80"
                )}
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.role ? (
                      <span className="capitalize">{user.role}</span>
                    ) : (
                      user.email
                    )}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogout}
                disabled={isLoggingOut}
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div
          className={cn(
            "flex items-center justify-between w-full rounded-md px-3 py-2",
            "bg-sidebar-accent text-sidebar-accent-foreground"
          )}
        >
          {/* Left: Avatar + Info */}
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar className="h-8 w-8 rounded-lg shrink-0">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">
                {user.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left overflow-hidden">
              <span className="truncate font-medium text-sm">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.role ? (
                  <span className="capitalize">{user.role}</span>
                ) : (
                  user.email
                )}
              </span>
            </div>
          </div>

          {/* Right: Logout */}
          <button
            onClick={onLogout}
            disabled={isLoggingOut}
            className="rounded-md p-2 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Log out"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
          </button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

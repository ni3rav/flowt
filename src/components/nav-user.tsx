"use client"

import { LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavUser({
  user,
  onLogout,
}: {
  user: {
    name: string
    email: string
    avatar?: string
  }
  onLogout?: () => void
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className={cn(
            "flex items-center justify-between w-full rounded-md px-3 py-2",
            "bg-sidebar-accent text-sidebar-accent-foreground transition"
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
                {user.email}
              </span>
            </div>
          </div>

          {/* Right: Logout */}
          <button
            onClick={onLogout}
            className="rounded-md p-2 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
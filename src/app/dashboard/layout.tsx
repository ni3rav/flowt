"use client";

import { AppSidebar } from "@/components/app-sidebar";
import PageTitle from "@/components/page-title";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageTitle />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

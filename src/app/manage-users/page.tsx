'use client'

import { AppSidebar } from '@/components/app-sidebar'
import ManageUsers from '@/components/manage-users-table'
import PageTitle from '@/components/page-title'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { usePermissions } from '@/lib/hooks/usePermissions'
import React from 'react'

const Page = () => {
    const { canManageUsers } = usePermissions()

    if (!canManageUsers) {
        return (
            <div className="flex items-center justify-center h-screen text-red-600 font-semibold text-lg">
                Access Denied
            </div>
        )
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <PageTitle />
                <div className="space-y-6 p-6">
                    <h1 className="text-2xl font-bold">Manage Users</h1>
                    <p className="text-sm text-muted-foreground">
                        Here you can manage all users of the application. Assign roles, update information, and control permissions for each user. The table below shows all registered users. Use the filters above the table to narrow down results.
                    </p>

                    {/* Table Container */}
                    <div className="shadow-sm rounded-lg border border-border p-4">
                        <ManageUsers />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Page
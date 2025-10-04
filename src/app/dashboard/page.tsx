"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import { usePermissions } from "@/lib/hooks/usePermissions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PageTitle from "@/components/page-title";
import { ManageUsersSection } from "@/components/manage-users-section";
import { ApprovalRulesSection } from "@/components/approval-rules-section";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const {
    role,
    canApproveExpenses,
    canManageUsers,
    canViewAllExpenses,
    canConfigureRules,
  } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <PageTitle />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="container mx-auto p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">
                Welcome, {session.user.name}!
              </h1>
              <p className="text-muted-foreground mt-2">
                Role:{" "}
                <span className="capitalize font-medium">
                  {role || "Loading..."}
                </span>
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Submit Expense</CardTitle>
                  <CardDescription>Create a new expense claim</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">New Expense</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My Expenses</CardTitle>
                  <CardDescription>View your expense history</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Expenses
                  </Button>
                </CardContent>
              </Card>

              {canApproveExpenses && (
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Approvals</CardTitle>
                    <CardDescription>
                      Review expenses waiting for approval
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      View Approvals
                    </Button>
                  </CardContent>
                </Card>
              )}

              {canManageUsers && (
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Users</CardTitle>
                    <CardDescription>
                      Add and manage team members
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Manage Users
                    </Button>
                  </CardContent>
                </Card>
              )}

              {canViewAllExpenses && (
                <Card>
                  <CardHeader>
                    <CardTitle>All Expenses</CardTitle>
                    <CardDescription>
                      View all organization expenses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      View All
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Owner/Admin Sections */}
            {canManageUsers && (
              <div id="manage-users" className="mt-8 scroll-mt-4">
                <ManageUsersSection />
              </div>
            )}

            {canConfigureRules && (
              <div id="approval-rules" className="mt-8 scroll-mt-4">
                <ApprovalRulesSection />
              </div>
            )}

            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Session Info (Debug)</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(
                      {
                        user: session.user,
                        role: role,
                        organizationId: session.session.activeOrganizationId,
                        permissions: {
                          canApproveExpenses: canApproveExpenses,
                          canViewAllExpenses: canViewAllExpenses,
                          canManageUsers: canManageUsers,
                          canConfigureRules: canConfigureRules,
                        },
                      },
                      null,
                      2
                    )}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

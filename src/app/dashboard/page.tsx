"use client";

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

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const permissions = usePermissions();
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
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {session.user.name}!</h1>
        <p className="text-muted-foreground mt-2">
          Role:{" "}
          <span className="capitalize font-medium">
            {permissions.isLoading
              ? "Loading..."
              : permissions.role || "No role assigned"}
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

        {permissions.canApproveExpenses && (
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

        {permissions.canManageUsers && (
          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
              <CardDescription>Add and manage team members</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Users
              </Button>
            </CardContent>
          </Card>
        )}

        {permissions.canViewAllExpenses && (
          <Card>
            <CardHeader>
              <CardTitle>All Expenses</CardTitle>
              <CardDescription>View all organization expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View All
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Debug Info</CardTitle>
            <CardDescription>
              Session and permission details (remove in production)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Role:</span>
                <span className="text-muted-foreground">
                  {permissions.role || "No role assigned"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Loading:</span>
                <span className="text-muted-foreground">
                  {permissions.isLoading ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Organization ID:</span>
                <span className="text-muted-foreground">
                  {permissions.organizationId || "None"}
                </span>
              </div>
              <div className="mt-4 border-t pt-4">
                <pre className="text-xs overflow-auto bg-muted p-3 rounded-md">
                  {JSON.stringify(
                    {
                      user: session.user,
                      role: permissions.role,
                      isLoading: permissions.isLoading,
                      organizationId: permissions.organizationId,
                      permissions: {
                        canApproveExpenses: permissions.canApproveExpenses,
                        canViewAllExpenses: permissions.canViewAllExpenses,
                        canManageUsers: permissions.canManageUsers,
                      },
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

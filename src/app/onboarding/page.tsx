"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { GalleryVerticalEnd } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Generate slug from company name
      const slug = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const { data, error } = await authClient.organization.create({
        name: companyName,
        slug: `${slug}-${Date.now()}`, // Add timestamp to ensure uniqueness
        metadata: JSON.stringify({ createdAt: new Date().toISOString() }),
      });

      if (error) {
        console.error("Organization creation error:", error);
        setError(error.message || "Failed to create organization");
        return;
      }

      console.log("Organization created successfully:", data);

      // Success - redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Flowt
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create Your Organization</CardTitle>
            <CardDescription>
              Set up your company to start managing expenses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateOrganization}>
              <FieldGroup>
                {error && (
                  <div className="bg-destructive/15 text-destructive text-sm rounded-md p-3">
                    {error}
                  </div>
                )}
                <Field>
                  <FieldLabel htmlFor="company-name">Company Name</FieldLabel>
                  <Input
                    id="company-name"
                    type="text"
                    placeholder="Acme Corp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <FieldDescription>
                    This will be your organization&apos;s display name
                  </FieldDescription>
                </Field>
                <Field>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Creating..." : "Create Organization"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

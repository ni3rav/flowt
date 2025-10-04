"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm rounded-lg bg-card p-8 shadow">
        <h1 className="mb-2 text-center text-2xl font-bold">Welcome!</h1>
        <p className="mb-6 text-center text-muted-foreground text-sm">
          Sign in or create an account to continue.
        </p>
        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
        >
          Continue with Google
        </Button>
      </div>
    </div>
  );
}

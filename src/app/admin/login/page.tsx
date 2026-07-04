"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="font-heading text-2xl uppercase tracking-wide mb-6 text-center">
        Admin Login
      </h1>
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required autoFocus />
        </div>
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" disabled={pending} className="mt-2">
          {pending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
}

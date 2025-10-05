"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AuthMode = "signin" | "signup";

function AuthForm({
  mode,
  onSuccess,
}: {
  mode: AuthMode;
  onSuccess: () => void;
}) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        const r = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!r.ok) throw new Error(await r.text());
      } else {
        if (password !== confirm) throw new Error("Passwords do not match.");
        const reg = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!reg.ok) throw new Error(await reg.text());
        const login = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!login.ok) throw new Error(await login.text());
      }
      onSuccess();
    } catch (e: any) {
      setErr(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{mode === "signin" ? "Sign in" : "Create account"}</CardTitle>
        <CardDescription>
          {mode === "signin" ? "Enter your email and password to sign in." : "Register with your email and password."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor={`${mode}-email`}>Email</Label>
            <Input
              id={`${mode}-email`}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete={mode === "signin" ? "username" : "email"}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={`${mode}-password`}>Password</Label>
            <Input
              id={`${mode}-password`}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </div>
          {mode === "signup" && (
            <div className="grid gap-2">
              <Label htmlFor="signup-password2">Confirm password</Label>
              <Input
                id="signup-password2"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          )}
          {err && <p className="text-sm text-red-600">{err}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait…</> : (mode === "signin" ? "Sign in" : "Sign up")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function SignInButton({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next");

  // Auto-open if redirected by middleware (?signin=1)
  React.useEffect(() => {
    if (search.get("signin") === "1") setOpen(true);
  }, [search]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="navbar" className={className}>Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px] p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Sign in</DialogTitle>
        </DialogHeader>
        <AuthForm
          mode="signin"
          onSuccess={() => {
            setOpen(false);
            router.replace(next || "/dashboard");
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export function SignUpButton({ className, variant = "start" }: { className?: string; variant?: any }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next");

  // Optional: auto-open via ?signup=1
  React.useEffect(() => {
    if (search.get("signup") === "1") setOpen(true);
  }, [search]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className={className}>Sign Up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px] p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Sign up</DialogTitle>
        </DialogHeader>
        <AuthForm
          mode="signup"
          onSuccess={() => {
            setOpen(false);
            router.replace(next || "/dashboard");
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

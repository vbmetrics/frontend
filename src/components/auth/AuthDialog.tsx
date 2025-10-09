"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/* -------------------- helpers: validation -------------------- */

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// min 8, przynajmniej 1 litera i 1 cyfra:
const passwordRe = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

function validateSignIn(values: { email: string; password: string }) {
  const errors: Partial<Record<keyof typeof values, string>> = {};
  if (!emailRe.test(values.email)) errors.email = "Please enter a valid email.";
  if (!passwordRe.test(values.password))
    errors.password = "Password must be at least 8 characters with letters and numbers.";
  return errors;
}

function validateSignUp(values: { full_name: string; email: string; password: string }) {
  const errors: Partial<Record<keyof typeof values, string>> = {};
  if (!values.full_name || values.full_name.trim().length < 2)
    errors.full_name = "Full name should be at least 2 characters.";
  if (!emailRe.test(values.email)) errors.email = "Please enter a valid email.";
  if (!passwordRe.test(values.password))
    errors.password = "Password must be at least 8 characters with letters and numbers.";
  return errors;
}

async function parseApiError(res: Response): Promise<{ message: string; fieldErrors?: Record<string, string> }> {
  try {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const j = await res.json();

      // Spróbuj rozmaitych konwencji backendu:
      // 1) { errors: { field: ["msg", ...] } }
      if (j?.errors && typeof j.errors === "object") {
        const fe: Record<string, string> = {};
        for (const [k, v] of Object.entries(j.errors)) {
          const arr = Array.isArray(v) ? v : [v];
          fe[k] = String(arr[0] ?? "Invalid value");
        }
        return { message: j.message || "Validation error", fieldErrors: fe };
      }

      // 2) FastAPI: { detail: [{ loc: ["body","email"], msg: "..." }, ...] }
      if (Array.isArray(j?.detail)) {
        const fe: Record<string, string> = {};
        for (const d of j.detail) {
          const loc = d?.loc;
          const field = Array.isArray(loc) ? String(loc[loc.length - 1]) : undefined;
          if (field) fe[field] = d?.msg || "Invalid value";
        }
        const msg = j.message || j.detail?.map?.((d: any) => d?.msg).join(", ") || "Validation error";
        return { message: msg, fieldErrors: Object.keys(fe).length ? fe : undefined };
      }

      // 3) { detail: "msg" } / { message: "msg" } / { error: "msg" }
      const msg = j.detail || j.message || j.error || JSON.stringify(j);
      return { message: String(msg) };
    } else {
      const t = await res.text();
      return { message: t || res.statusText || "Request failed" };
    }
  } catch {
    return { message: res.statusText || "Request failed" };
  }
}

/* -------------------- component -------------------- */

export function AuthDialog() {
  const router = useRouter();
  const sp = useSearchParams();

  const isOpen = sp.get("auth") === "1";
  const next = sp.get("next") || "/dashboard";
  const tabParam = sp.get("tab") === "signup" ? "signup" : "signin";
  const [tab, setTab] = React.useState<"signin" | "signup">(tabParam);

  React.useEffect(() => {
    setTab(tabParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam, isOpen]);

  const close = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("auth");
    url.searchParams.delete("tab");
    url.searchParams.delete("next");
    router.replace(url.pathname + url.search, { scroll: false });
  };

  const switchTab = (target: "signin" | "signup") => {
    const url = new URL(window.location.href);
    url.searchParams.set("auth", "1");
    url.searchParams.set("tab", target);
    if (next) url.searchParams.set("next", next);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  // form state
  const [signinValues, setSigninValues] = React.useState({ email: "", password: "" });
  const [signinErrors, setSigninErrors] = React.useState<Partial<typeof signinValues>>({});
  const [signupValues, setSignupValues] = React.useState({ full_name: "", email: "", password: "" });
  const [signupErrors, setSignupErrors] = React.useState<Partial<typeof signupValues>>({});
  const [formMessage, setFormMessage] = React.useState<string>(""); // aria-live
  const [pending, setPending] = React.useState(false);

  // show/hide password
  const [showSigninPass, setShowSigninPass] = React.useState(false);
  const [showSignupPass, setShowSignupPass] = React.useState(false);

  const focusFirstError = (ids: string[]) => {
    for (const id of ids) {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (el) {
        el.focus();
        break;
      }
    }
  };

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return; // blokada wielokliku
    setFormMessage("");
    setSigninErrors({});
    const errs = validateSignIn(signinValues);
    setSigninErrors(errs);
    if (Object.keys(errs).length) {
      setFormMessage("Please correct the errors and try again.");
      focusFirstError(["signin-email", "signin-password"]);
      return;
    }
    try {
      setPending(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(signinValues),
      });
      if (!res.ok) {
        const { message, fieldErrors } = await parseApiError(res);
        if (fieldErrors) setSigninErrors((prev) => ({ ...prev, ...fieldErrors }));
        throw new Error(message);
      }
      toast.success("Signed in");
      router.push(next);
    } catch (err: any) {
      const msg = err?.message || "Sign-in failed";
      setFormMessage(msg);
      toast.error(msg);
    } finally {
      setPending(false);
    }
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return; // blokada wielokliku
    setFormMessage("");
    setSignupErrors({});
    const errs = validateSignUp(signupValues);
    setSignupErrors(errs);
    if (Object.keys(errs).length) {
      setFormMessage("Please correct the errors and try again.");
      focusFirstError(["signup-full_name", "signup-email", "signup-password"]);
      return;
    }
    try {
      setPending(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(signupValues),
      });
      if (!res.ok) {
        const { message, fieldErrors } = await parseApiError(res);
        if (fieldErrors) setSignupErrors((prev) => ({ ...prev, ...fieldErrors }));
        throw new Error(message);
      }
      toast.success("Account created");
      router.push(next);
    } catch (err: any) {
      const msg = err?.message || "Sign-up failed";
      setFormMessage(msg);
      toast.error(msg);
    } finally {
      setPending(false);
    }
  }

  const tabTriggerClass = cn(
    "h-9 rounded-md px-3 text-sm transition-colors",
    "data-[state=inactive]:text-foreground/80 hover:bg-accent hover:text-foreground",
    "data-[state=active]:text-primary data-[state=active]:bg-primary/12",
    "dark:data-[state=active]:bg-primary/30",
    "data-[state=active]:ring-1 data-[state=active]:ring-primary/25"
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={(o) => (!o ? close() : null)}>
      <DialogContent
        className={cn(
          "sm:max-w-[360px] md:max-w-[520px] p-0 overflow-hidden rounded-2xl",
          "border border-border bg-card text-card-foreground"
        )}
      >
        <div className="grid gap-6 p-6 md:p-8">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              {tab === "signup" ? "Create your account" : "Welcome back"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {tab === "signup"
                ? "Join vbmetrics to store and analyze your volleyball data."
                : "Sign in to continue to your dashboard."}
            </p>
          </DialogHeader>

          <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 rounded-lg bg-muted/40">
              <TabsTrigger
                value="signin"
                disabled={pending}
                onClick={() => switchTab("signin")}
                className={tabTriggerClass}
              >
                Sign in
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                disabled={pending}
                onClick={() => switchTab("signup")}
                className={tabTriggerClass}
              >
                Sign up
              </TabsTrigger>
            </TabsList>

            {/* ARIA live region for form messages */}
            <div className="sr-only" role="status" aria-live="polite">
              {formMessage}
            </div>

            {/* ---------- SIGN IN ---------- */}
            <TabsContent value="signin" className="mt-4">
              <form onSubmit={handleSignIn} noValidate className="space-y-4">
                <div>
                  <label htmlFor="signin-email" className="mb-1 block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={signinValues.email}
                    onChange={(e) => setSigninValues((s) => ({ ...s, email: e.target.value }))}
                    aria-invalid={!!signinErrors.email || undefined}
                    aria-describedby={signinErrors.email ? "signin-email-error" : undefined}
                    disabled={pending}
                  />
                  {signinErrors.email && (
                    <p id="signin-email-error" className="mt-1 text-xs text-destructive">
                      {signinErrors.email}
                    </p>
                  )}
                </div>

                <div className="pb-10">
                  <label htmlFor="signin-password" className="mb-1 block text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      name="password"
                      type={showSigninPass ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="********"
                      value={signinValues.password}
                      onChange={(e) => setSigninValues((s) => ({ ...s, password: e.target.value }))}
                      aria-invalid={!!signinErrors.password || undefined}
                      aria-describedby={signinErrors.password ? "signin-password-error" : undefined}
                      disabled={pending}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSigninPass((v) => !v)}
                      aria-label={showSigninPass ? "Hide password" : "Show password"}
                      aria-pressed={showSigninPass}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                      disabled={pending}
                    >
                      {showSigninPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signinErrors.password && (
                    <p id="signin-password-error" className="mt-1 text-xs text-destructive">
                      {signinErrors.password}
                    </p>
                  )}
                </div>

                <Button className="w-full" type="submit" disabled={pending}>
                  {pending ? "Please wait…" : "Continue"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchTab("signup")}
                    className="underline underline-offset-4 text-primary"
                    disabled={pending}
                  >
                    Create one
                  </button>
                </p>
              </form>
            </TabsContent>

            {/* ---------- SIGN UP ---------- */}
            <TabsContent value="signup" className="mt-4">
              <form onSubmit={handleSignUp} noValidate className="space-y-4">
                <div>
                  <label htmlFor="signup-full_name" className="mb-1 block text-sm font-medium">
                    Full name
                  </label>
                  <Input
                    id="signup-full_name"
                    name="full_name"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    value={signupValues.full_name}
                    onChange={(e) => setSignupValues((s) => ({ ...s, full_name: e.target.value }))}
                    aria-invalid={!!signupErrors.full_name || undefined}
                    aria-describedby={signupErrors.full_name ? "signup-full_name-error" : undefined}
                    disabled={pending}
                  />
                  {signupErrors.full_name && (
                    <p id="signup-full_name-error" className="mt-1 text-xs text-destructive">
                      {signupErrors.full_name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="signup-email" className="mb-1 block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={signupValues.email}
                    onChange={(e) => setSignupValues((s) => ({ ...s, email: e.target.value }))}
                    aria-invalid={!!signupErrors.email || undefined}
                    aria-describedby={signupErrors.email ? "signup-email-error" : undefined}
                    disabled={pending}
                  />
                  {signupErrors.email && (
                    <p id="signup-email-error" className="mt-1 text-xs text-destructive">
                      {signupErrors.email}
                    </p>
                  )}
                </div>

                <div className="pb-10">
                  <label htmlFor="signup-password" className="mb-1 block text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      name="password"
                      type={showSignupPass ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      value={signupValues.password}
                      onChange={(e) => setSignupValues((s) => ({ ...s, password: e.target.value }))}
                      aria-invalid={!!signupErrors.password || undefined}
                      aria-describedby={signupErrors.password ? "signup-password-error" : undefined}
                      disabled={pending}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPass((v) => !v)}
                      aria-label={showSignupPass ? "Hide password" : "Show password"}
                      aria-pressed={showSignupPass}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                      disabled={pending}
                    >
                      {showSignupPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signupErrors.password && (
                    <p id="signup-password-error" className="mt-1 text-xs text-destructive">
                      {signupErrors.password}
                    </p>
                  )}
                </div>

                <Button className="w-full" type="submit" disabled={pending}>
                  {pending ? "Creating…" : "Create account"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchTab("signin")}
                    className="underline underline-offset-4 text-primary"
                    disabled={pending}
                  >
                    Sign in
                  </button>
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

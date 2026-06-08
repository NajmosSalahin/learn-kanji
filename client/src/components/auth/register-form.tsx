import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordStrengthMeter } from "./password-strength-meter";
import { toast } from "sonner";

const DISPOSABLE_DOMAINS = [
  "mailinator.com", "tempmail.com", "throwaway.email",
  "guerrillamail.com", "10minutemail.com", "sharklasers.com",
  "yopmail.com", "mailnator.com", "temp-mail.org",
];

function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? DISPOSABLE_DOMAINS.some((d) => domain.includes(d)) : false;
}

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showDisposableWarning, setShowDisposableWarning] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", displayName: "" },
  });

  const password = form.watch("password");
  const email = form.watch("email");

  function handleEmailBlur() {
    if (email && isDisposableEmail(email)) {
      setShowDisposableWarning(true);
    }
  }

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    setServerError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setServerError(json.error);
        } else {
          setServerError(json.error || "Registration failed.");
        }
        return;
      }

      setIsSuccess(true);
      toast.success("Account created! Check your email to verify.");
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Check your email</h1>
        <p className="mt-2 text-sm text-text-secondary">
          We&apos;ve sent a verification link to <strong>{email}</strong>.
          Click it to activate your account.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Create account</h1>
        <p className="mt-1 text-sm text-text-secondary">Start mastering kanji today</p>
      </div>

      {serverError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {serverError}
        </div>
      )}

      {showDisposableWarning && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-400">
          This looks like a disposable email address. You may need a real email to recover your account.
        </div>
      )}

      <Input
        id="displayName"
        label="Display name"
        placeholder="Your name"
        error={form.formState.errors.displayName?.message}
        {...form.register("displayName")}
      />

      <Input
        id="reg-email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={form.formState.errors.email?.message}
        {...form.register("email", { onBlur: handleEmailBlur })}
      />

      <div className="space-y-1">
        <Input
          id="reg-password"
          label="Password"
          type="password"
          placeholder="Create a strong password"
          error={form.formState.errors.password?.message}
          {...form.register("password")}
        />
        {password && <PasswordStrengthMeter password={password} />}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link to="/login" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

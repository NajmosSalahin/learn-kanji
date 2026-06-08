import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordStrengthMeter } from "./password-strength-meter";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: "" },
  });

  const password = form.watch("password");

  async function onSubmit(data: { token: string; password: string }) {
    setIsLoading(true);
    setServerError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error || "Something went wrong.");
        return;
      }

      setIsSuccess(true);
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Password reset!</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Your password has been reset successfully.
        </p>
        <Link
          to="/login"
          className="mt-4 inline-block rounded-lg bg-accent px-6 py-2 text-sm font-medium text-background hover:bg-accent-hover"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold text-text-primary">New password</h1>
        <p className="mt-1 text-sm text-text-secondary">Choose a new password for your account</p>
      </div>

      {serverError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {serverError}
        </div>
      )}

      <div className="space-y-1">
        <Input
          id="new-password"
          label="New password"
          type="password"
          placeholder="Enter new password"
          error={form.formState.errors.password?.message}
          {...form.register("password")}
        />
        {password && <PasswordStrengthMeter password={password} />}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Resetting..." : "Reset password"}
      </Button>
    </form>
  );
}

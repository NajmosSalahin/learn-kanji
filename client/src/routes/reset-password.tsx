import { createFileRoute, useSearch } from "@tanstack/react-router";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, string>) => ({
    token: search.token as string | undefined,
  }),
});

function ResetPasswordPage() {
  const { token } = useSearch({ from: "/reset-password" });

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <h1 className="font-heading text-2xl font-bold text-text-primary">Invalid link</h1>
            <p className="mt-2 text-sm text-text-secondary">
              This reset link is invalid or has expired.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-border bg-surface p-8">
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </div>
  );
}

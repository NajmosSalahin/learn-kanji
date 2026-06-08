import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router";
import { Suspense, useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";

export const Route = createFileRoute("/verify-email")({
  component: () => (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Suspense fallback={
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <h1 className="mt-4 font-heading text-xl font-bold text-text-primary">Loading...</h1>
          </div>
        }>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  ),
  validateSearch: (search: Record<string, string>) => ({
    token: search.token as string | undefined,
  }),
});

function VerifyEmailContent() {
  const { token } = useSearch({ from: "/verify-email" });
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    async function verify() {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const json = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage("Email verified! Redirecting...");
          setUser(json.user);
          setTimeout(() => navigate({ to: "/dashboard" }), 2000);
        } else {
          setStatus("error");
          setMessage(json.error || "Verification failed.");
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong.");
      }
    }

    verify();
  }, [token, navigate, setUser]);

  return (
    <div className="rounded-xl border border-border bg-surface p-8 text-center">
      {status === "verifying" && (
        <>
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <h1 className="mt-4 font-heading text-xl font-bold text-text-primary">Verifying your email...</h1>
        </>
      )}
      {status === "success" && (
        <>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
            <span className="text-2xl text-green-400">✓</span>
          </div>
          <h1 className="mt-4 font-heading text-xl font-bold text-text-primary">{message}</h1>
        </>
      )}
      {status === "error" && (
        <>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
            <span className="text-2xl text-red-400">!</span>
          </div>
          <h1 className="mt-4 font-heading text-xl font-bold text-text-primary">Verification failed</h1>
          <p className="mt-2 text-sm text-text-secondary">{message}</p>
        </>
      )}
    </div>
  );
}

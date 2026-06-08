import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth.store";
import { useQuery } from "@tanstack/react-query";
import { Settings, Trophy, LogOut, ChevronDown } from "lucide-react";
import type { ProgressResponse } from "@/types/api";

export function ProfileMenu() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: progress } = useQuery<ProgressResponse>({
    queryKey: ["progress"],
    queryFn: async () => {
      const res = await fetch("/api/progress");
      if (!res.ok) throw new Error("Failed to fetch progress");
      return res.json();
    },
    staleTime: 30000,
    enabled: open,
  });

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const initial = user?.displayName?.charAt(0)?.toUpperCase() || "?";

  async function handleLogout() {
    setOpen(false);
    await logout();
    navigate({ to: "/login" });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-surface/80"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
          {initial}
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-text-secondary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-surface shadow-lg shadow-black/10 z-50">
          <div className="p-4 border-b border-border">
            <p className="font-medium text-text-primary truncate">{user?.displayName || "User"}</p>
            <p className="text-xs text-text-secondary truncate mt-0.5">{user?.email}</p>
            {progress && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                  <span>Level {progress.user.level}</span>
                  <span>{progress.user.totalXP} XP</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${progress.user.xpProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-1">
            <Link
              to="/achievements"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface/80 hover:text-text-primary transition-colors"
            >
              <Trophy className="h-4 w-4" />
              Achievements
            </Link>
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface/80 hover:text-text-primary transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>

          <div className="border-t border-border p-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "@/components/layout/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { PasswordStrengthMeter } from "@/components/auth/password-strength-meter";
import { toast } from "sonner";

type Tab = "profile" | "preferences" | "account";

const TIMEZONES = (Intl as any).supportedValuesOf?.("timeZone") || [
  "UTC", "America/New_York", "America/Chicago", "America/Denver",
  "America/Los_Angeles", "Europe/London", "Europe/Paris", "Europe/Berlin",
  "Asia/Tokyo", "Asia/Seoul", "Asia/Shanghai", "Asia/Kolkata",
  "Australia/Sydney", "Pacific/Auckland",
];

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [timezone, setTimezone] = useState(user?.preferences.timezone || "UTC");

  const [dailyGoal, setDailyGoal] = useState(user?.preferences.dailyGoal || 20);
  const [newCardsPerDay, setNewCardsPerDay] = useState(user?.preferences.newCardsPerDay || 10);
  const [studyMode, setStudyMode] = useState(user?.preferences.studyMode || "mixed");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function saveProfile() {
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, timezone }),
      });
      if (res.ok) {
        toast.success("Profile updated");
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function savePreferences() {
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dailyGoal, newCardsPerDay, studyMode }),
      });
      if (res.ok) {
        toast.success("Preferences saved");
      } else {
        toast.error("Failed to save preferences");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function changePassword() {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (res.ok) {
        toast.success("Password changed");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(json.error || "Failed to change password");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "preferences", label: "Study Preferences" },
    { key: "account", label: "Account" },
  ];

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-2xl space-y-6">
            <div>
              <h1 className="font-heading text-2xl font-bold text-text-primary">Settings</h1>
              <p className="mt-1 text-sm text-text-secondary">Manage your account and preferences</p>
            </div>

            <div className="flex gap-1 rounded-lg border border-border bg-surface p-1">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    tab === t.key
                      ? "bg-accent text-background"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === "profile" && (
              <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
                <Input
                  id="displayName"
                  label="Display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-secondary">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {TIMEZONES.map((tz: string) => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
                <Button onClick={saveProfile}>Save changes</Button>
              </div>
            )}

            {tab === "preferences" && (
              <div className="space-y-6 rounded-xl border border-border bg-surface p-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary">
                    Daily goal: {dailyGoal} cards
                  </label>
                  <Slider value={dailyGoal} onChange={setDailyGoal} min={5} max={100} step={5} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary">
                    New cards per day: {newCardsPerDay}
                  </label>
                  <Slider value={newCardsPerDay} onChange={setNewCardsPerDay} min={1} max={50} step={1} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text-secondary">Study mode</label>
                  <div className="flex gap-2">
                    {(["flashcard", "quiz", "mixed"] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setStudyMode(mode)}
                        className={`rounded-lg px-4 py-2 text-sm capitalize transition-colors ${
                          studyMode === mode
                            ? "bg-accent text-background"
                            : "border border-border text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={savePreferences}>Save preferences</Button>
              </div>
            )}

            {tab === "account" && (
              <div className="space-y-4 rounded-xl border border-border bg-surface p-6">
                <h3 className="text-sm font-semibold text-text-primary">Change password</h3>
                <Input
                  id="currentPassword"
                  label="Current password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <div className="space-y-1">
                  <Input
                    id="newPassword"
                    label="New password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {newPassword && <PasswordStrengthMeter password={newPassword} />}
                </div>
                <Input
                  id="confirmPassword"
                  label="Confirm new password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button onClick={changePassword}>Change password</Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

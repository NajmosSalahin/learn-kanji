import { toast } from "sonner";

export async function reportFlag(flag: string) {
  try {
    const res = await fetch("/api/achievements/flag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flag }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.newAchievements?.length > 0) {
        for (const a of data.newAchievements) {
          toast.success(`${a.icon} Achievement unlocked: ${a.name}!`, { duration: 5000 });
        }
      }
    }
  } catch {
    // silently fail
  }
}

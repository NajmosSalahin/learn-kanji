import { differenceInCalendarDays, parseISO } from "date-fns";

export function calculateStreak(
  currentStreak: number,
  lastStudyDate: string | null,
  today: string
): { current: number; broken: boolean } {
  if (!lastStudyDate) return { current: 1, broken: false };

  const diff = differenceInCalendarDays(parseISO(today), parseISO(lastStudyDate));

  if (diff === 0) return { current: currentStreak, broken: false };
  if (diff === 1) return { current: currentStreak + 1, broken: false };
  return { current: 1, broken: true };
}

export function getDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

export function getTodayString(timezone: string = "UTC"): string {
  const now = new Date();
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(now);
  } catch {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
}

import { useQuery } from "@tanstack/react-query";
import type { StreakResponse } from "@/types/api";

export function useStreak() {
  return useQuery<StreakResponse>({
    queryKey: ["streak"],
    queryFn: async () => {
      const res = await fetch("/api/progress/streak");
      if (!res.ok) throw new Error("Failed to fetch streak");
      return res.json();
    },
    refetchInterval: 60000,
  });
}

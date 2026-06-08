import { useQuery } from "@tanstack/react-query";
import type { ProgressResponse, HeatmapEntry } from "@/types/api";

export function useProgress() {
  return useQuery<ProgressResponse>({
    queryKey: ["progress"],
    queryFn: async () => {
      const res = await fetch("/api/progress");
      if (!res.ok) throw new Error("Failed to fetch progress");
      return res.json();
    },
  });
}

export function useHeatmap() {
  return useQuery<HeatmapEntry[]>({
    queryKey: ["heatmap"],
    queryFn: async () => {
      const res = await fetch("/api/progress/heatmap");
      if (!res.ok) throw new Error("Failed to fetch heatmap");
      return res.json();
    },
  });
}

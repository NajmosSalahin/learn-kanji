import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { KanjiWithProgress } from "@/types/kanji";

interface KanjiListResponse {
  data: KanjiWithProgress[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface KanjiFilters {
  page?: number;
  limit?: number;
  search?: string;
  jlpt?: string;
  grade?: string;
  strokes?: string;
}

export function useKanjiList(filters: KanjiFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.search) params.set("search", filters.search);
  if (filters.jlpt) params.set("jlpt", filters.jlpt);
  if (filters.grade) params.set("grade", filters.grade);
  if (filters.strokes) params.set("strokes", filters.strokes);
  params.set("includeProgress", "true");

  return useQuery<KanjiListResponse>({
    queryKey: ["kanji", filters],
    queryFn: async () => {
      const res = await fetch(`/api/kanji?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch kanji");
      return res.json();
    },
  });
}

export function useKanjiDetail(character: string) {
  return useQuery<{ data: KanjiWithProgress }>({
    queryKey: ["kanji", character],
    queryFn: async () => {
      const res = await fetch(`/api/kanji/${encodeURIComponent(character)}`);
      if (!res.ok) throw new Error("Kanji not found");
      return res.json();
    },
    enabled: !!character,
  });
}

export function useAddToDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (character: string) => {
      const res = await fetch("/api/study/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ character }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add kanji");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanji"] });
    },
  });
}

import { create } from "zustand";
import { getUserReports } from "@/services";

export const useReports = create((set, get) => {
  return {
    items: [],
    cursor: null,
    hasMore: true,
    fetch: async ({ limit = 5, reset = false } = {}) => {
      const { hasMore, cursor } = get();
      if (!reset && !hasMore) return;
      if (reset) set({ cursor: null, hasMore: true });
      try {
        const { items: page, nextCursor } = await getUserReports({
          limit,
          cursor: reset ? null : cursor,
        });
        set((s) => ({
          items: reset
            ? page
            : [...s.items, ...page].reduce((acc, item) => {
                if (!acc.some((i) => i.id === item.id)) acc.push(item);
                return acc;
              }, []),
          cursor: nextCursor,
          hasMore: !!nextCursor,
        }));
      } catch (error) {
        console.error("Erro ao buscar reports", error);
      }
    },

    reset() {
      set({ items: [], cursor: null, hasMore: true });
    },
  };
});

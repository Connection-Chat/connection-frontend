import { Theme, ThemeState } from "@/types";
import { create } from "zustand";

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem("chat-theme") as Theme) || "coffee",

  setTheme: (theme: Theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));

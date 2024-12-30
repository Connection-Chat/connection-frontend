import { Theme } from "@/types";

export interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

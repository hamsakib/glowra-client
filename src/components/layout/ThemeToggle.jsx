"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/useMounted";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const dark = mounted && resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-fg transition hover:bg-muted hover:text-fg"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {mounted ? dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" /> : <span className="h-5 w-5" />}
    </button>
  );
}

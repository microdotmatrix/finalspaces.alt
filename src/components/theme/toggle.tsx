"use client";

import { Button } from "@/components/ui/button";
import { META_THEME_COLORS, useMetaColor } from "@/hooks/use-meta-color";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "../ui/icon";

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const { setMetaColor } = useMetaColor();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    setMetaColor(
      resolvedTheme === "dark"
        ? META_THEME_COLORS.light
        : META_THEME_COLORS.dark
    );
  }, [resolvedTheme, setTheme, setMetaColor]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {resolvedTheme === "light" ? (
        <Icon
          key={resolvedTheme}
          icon="line-md:moon-to-sunny-outline-loop-transition"
          className="size-5"
        />
      ) : (
        <Icon
          key={resolvedTheme}
          icon="line-md:sunny-outline-to-moon-loop-transition"
          className="size-5"
        />
      )}
    </Button>
  );
};

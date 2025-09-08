
"use client";

import { useEffect } from "react";
import { useThemeCustomizer } from "@/context/ThemeCustomizerProvider";

export function DynamicThemeColor() {
  const { theme } = useThemeCustomizer();

  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme.colors.primary);
  }, [theme.colors.primary]);

  return null;
}

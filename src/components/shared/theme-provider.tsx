"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * Wraps next-themes' provider so the theme (light/dark/system) can be
 * consumed anywhere via `useTheme()`. Kept as its own client component
 * because next-themes requires a "use client" boundary, while
 * src/app/layout.tsx stays a Server Component to keep its `metadata` export.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

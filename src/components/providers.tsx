
"use client"

import { ThemeProvider } from "@/components/theme-provider";
import { ThemeCustomizerProvider } from "@/context/ThemeCustomizerProvider";
import useSmoothScroll from "@/hooks/use-smooth-scroll";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    useSmoothScroll();
    
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ThemeCustomizerProvider>
                {children}
            </ThemeCustomizerProvider>
        </ThemeProvider>
    )
}

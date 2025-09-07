
"use client"

import { ThemeProvider } from "@/components/theme-provider";
import { ThemeCustomizerProvider } from "@/context/ThemeCustomizerProvider";
import useSmoothScroll from "@/hooks/use-smooth-scroll";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    useSmoothScroll();
    
    const pathname = usePathname();
    const [canonicalUrl, setCanonicalUrl] = useState("https://www.jrkelabour.com");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (typeof window !== "undefined") {
          setCanonicalUrl(window.location.origin + pathname);
        }
    }, [pathname]);

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <ThemeCustomizerProvider>
                {isMounted && <link rel="canonical" href={canonicalUrl} />}
                {children}
            </ThemeCustomizerProvider>
        </ThemeProvider>
    )
}

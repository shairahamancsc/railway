
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Poppins, Inter, Roboto, Lato, Montserrat, Open_Sans } from "next/font/google";

// Define fonts
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: '--font-poppins' });
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"], variable: '--font-roboto' });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: '--font-lato' });
const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-montserrat' });
const openSans = Open_Sans({ subsets: ["latin"], variable: '--font-open-sans' });


const fontMap: { [key: string]: any } = {
  Poppins: poppins,
  Inter: inter,
  Roboto: roboto,
  Lato: lato,
  Montserrat: montserrat,
  "Open Sans": openSans,
};


// Helper to convert hex to HSL string
const hexToHSL = (hex: string): string => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }

    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return `${h} ${s}% ${l}%`;
};

interface Theme {
  colors: {
    primary: string;
    background: string;
    accent: string;
  };
  fonts: {
    headline: string;
    body: string;
  };
  images: {
    heroImage: string;
  }
}

const defaultTheme: Theme = {
  colors: {
    primary: "#3F51B5",
    background: "#F8FAFC",
    accent: "#FF9800",
  },
  fonts: {
    headline: "Poppins",
    body: "Poppins",
  },
  images: {
    heroImage: "https://picsum.photos/1920/1080?grayscale&blur=2"
  }
};

interface ThemeCustomizerContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resetTheme: () => void;
}

const ThemeCustomizerContext = createContext<ThemeCustomizerContextProps | undefined>(undefined);

export const ThemeCustomizerProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem("custom-theme");
    if (savedTheme) {
      setThemeState(JSON.parse(savedTheme));
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("custom-theme", JSON.stringify(newTheme));
  };
  
  const resetTheme = () => {
    setThemeState(defaultTheme);
    localStorage.removeItem("custom-theme");
  }

  useEffect(() => {
    const root = document.documentElement;

    // Apply colors
    root.style.setProperty("--primary", hexToHSL(theme.colors.primary));
    root.style.setProperty("--background", hexToHSL(theme.colors.background));
    root.style.setProperty("--accent", hexToHSL(theme.colors.accent));
    
    // Dynamically add/remove font class names
    Object.values(fontMap).forEach(font => {
        root.classList.remove(font.variable);
    });

    const headlineFont = fontMap[theme.fonts.headline];
    const bodyFont = fontMap[theme.fonts.body];

    if (headlineFont) root.classList.add(headlineFont.variable);
    if (bodyFont) root.classList.add(bodyFont.variable);

    root.style.setProperty("--font-headline", headlineFont ? `var(${headlineFont.variable})` : 'sans-serif');
    root.style.setProperty("--font-body", bodyFont ? `var(${bodyFont.variable})` : 'sans-serif');

  }, [theme]);

  return (
    <ThemeCustomizerContext.Provider value={{ theme, setTheme, resetTheme }}>
      {children}
    </ThemeCustomizerContext.Provider>
  );
};

export const useThemeCustomizer = () => {
  const context = useContext(ThemeCustomizerContext);
  if (!context) {
    throw new Error("useThemeCustomizer must be used within a ThemeCustomizerProvider");
  }
  return context;
};


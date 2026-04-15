import { createContext, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

export type ThemeVersion = "v1" | "v2" | "v3";

const ThemeContext = createContext<ThemeVersion>("v1");

export const useThemeVersion = () => useContext(ThemeContext);

export const getVersionFromPath = (pathname: string): ThemeVersion => {
  if (pathname.startsWith("/v2")) return "v2";
  if (pathname.startsWith("/v3")) return "v3";
  return "v1";
};

export const getVersionPrefix = (version: ThemeVersion) => `/${version}`;

// CSS variable overrides for each version
const themeVars: Record<ThemeVersion, Record<string, string>> = {
  v1: {
    "--background": "0 0% 100%",
    "--foreground": "160 10% 10%",
    "--card": "0 0% 100%",
    "--card-foreground": "160 10% 10%",
    "--popover": "0 0% 100%",
    "--popover-foreground": "160 10% 10%",
    "--primary": "152 80% 28%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "42 96% 56%",
    "--secondary-foreground": "0 0% 10%",
    "--muted": "150 15% 95%",
    "--muted-foreground": "160 5% 45%",
    "--accent": "150 30% 94%",
    "--accent-foreground": "152 80% 22%",
    "--destructive": "0 84% 60%",
    "--destructive-foreground": "0 0% 100%",
    "--border": "150 15% 90%",
    "--input": "150 15% 90%",
    "--ring": "152 80% 28%",
    "--sidebar-background": "152 80% 28%",
    "--sidebar-foreground": "0 0% 100%",
    "--sidebar-primary": "0 0% 100%",
    "--sidebar-primary-foreground": "152 80% 28%",
    "--sidebar-accent": "152 70% 32%",
    "--sidebar-accent-foreground": "0 0% 100%",
    "--sidebar-border": "152 60% 35%",
    "--sidebar-ring": "42 96% 56%",
    "--success": "152 80% 28%",
    "--success-foreground": "0 0% 100%",
    "--warning": "42 96% 56%",
    "--warning-foreground": "0 0% 10%",
    "--info": "210 80% 55%",
    "--info-foreground": "0 0% 100%",
  },
  v2: {
    "--background": "210 40% 98%",
    "--foreground": "222 47% 11%",
    "--card": "0 0% 100%",
    "--card-foreground": "222 47% 11%",
    "--popover": "0 0% 100%",
    "--popover-foreground": "222 47% 11%",
    "--primary": "221 83% 53%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "210 40% 96%",
    "--secondary-foreground": "222 47% 11%",
    "--muted": "210 40% 96%",
    "--muted-foreground": "215 16% 47%",
    "--accent": "210 40% 96%",
    "--accent-foreground": "222 47% 11%",
    "--destructive": "0 84% 60%",
    "--destructive-foreground": "0 0% 100%",
    "--border": "214 32% 91%",
    "--input": "214 32% 91%",
    "--ring": "221 83% 53%",
    "--sidebar-background": "221 83% 53%",
    "--sidebar-foreground": "0 0% 100%",
    "--sidebar-primary": "0 0% 100%",
    "--sidebar-primary-foreground": "221 83% 53%",
    "--sidebar-accent": "221 73% 60%",
    "--sidebar-accent-foreground": "0 0% 100%",
    "--sidebar-border": "221 60% 60%",
    "--sidebar-ring": "210 40% 96%",
    "--success": "142 76% 36%",
    "--success-foreground": "0 0% 100%",
    "--warning": "38 92% 50%",
    "--warning-foreground": "0 0% 10%",
    "--info": "221 83% 53%",
    "--info-foreground": "0 0% 100%",
  },
  v3: {
    "--background": "0 0% 2%",
    "--foreground": "0 0% 100%",
    "--card": "0 0% 6%",
    "--card-foreground": "0 0% 100%",
    "--popover": "0 0% 6%",
    "--popover-foreground": "0 0% 100%",
    "--primary": "25 95% 53%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "25 80% 18%",
    "--secondary-foreground": "0 0% 100%",
    "--muted": "0 0% 10%",
    "--muted-foreground": "0 0% 65%",
    "--accent": "25 40% 10%",
    "--accent-foreground": "25 95% 65%",
    "--destructive": "0 84% 60%",
    "--destructive-foreground": "0 0% 100%",
    "--border": "0 0% 15%",
    "--input": "0 0% 15%",
    "--ring": "25 95% 53%",
    "--sidebar-background": "0 0% 4%",
    "--sidebar-foreground": "0 0% 100%",
    "--sidebar-primary": "25 95% 53%",
    "--sidebar-primary-foreground": "0 0% 100%",
    "--sidebar-accent": "25 40% 12%",
    "--sidebar-accent-foreground": "0 0% 100%",
    "--sidebar-border": "0 0% 15%",
    "--sidebar-ring": "25 95% 53%",
    "--success": "142 76% 36%",
    "--success-foreground": "0 0% 100%",
    "--warning": "38 92% 50%",
    "--warning-foreground": "0 0% 100%",
    "--info": "25 95% 53%",
    "--info-foreground": "0 0% 100%",
  },
};

// Additional body class for gradient overrides
const bodyClasses: Record<ThemeVersion, string> = {
  v1: "theme-v1",
  v2: "theme-v2",
  v3: "theme-v3",
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const version = getVersionFromPath(location.pathname);

  useEffect(() => {
    const root = document.documentElement;
    const vars = themeVars[version];
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Body class for gradient/extra styles
    document.body.classList.remove("theme-v1", "theme-v2", "theme-v3");
    document.body.classList.add(bodyClasses[version]);

    return () => {
      // Cleanup on unmount — restore v1 defaults
      Object.entries(themeVars.v1).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    };
  }, [version]);

  return (
    <ThemeContext.Provider value={version}>
      {children}
    </ThemeContext.Provider>
  );
};

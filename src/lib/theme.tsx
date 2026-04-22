import { useEffect } from "react";

export type ThemeVersion = "default";

export const useThemeVersion = () => "default" as ThemeVersion;

export const getVersionPrefix = () => "";

const themeVars = {
  // VYONA AI Theme - Pure Black, Orange, Silver/Grey
  "--background": "0 0% 0%",
  "--foreground": "0 0% 100%",
  "--card": "0 0% 5%",
  "--card-foreground": "0 0% 100%",
  "--popover": "0 0% 5%",
  "--popover-foreground": "0 0% 100%",
  "--primary": "25 95% 53%",
  "--primary-foreground": "0 0% 12%",
  "--secondary": "0 0% 50%",
  "--secondary-foreground": "0 0% 100%",
  "--muted": "0 0% 25%",
  "--muted-foreground": "0 0% 75%",
  "--accent": "0 0% 65%",
  "--accent-foreground": "0 0% 12%",
  "--destructive": "0 84% 60%",
  "--destructive-foreground": "0 0% 12%",
  "--border": "0 0% 15%",
  "--input": "0 0% 8%",
  "--ring": "25 95% 53%",
  "--sidebar-background": "0 0% 2%",
  "--sidebar-foreground": "0 0% 100%",
  "--sidebar-primary": "25 95% 53%",
  "--sidebar-primary-foreground": "0 0% 12%",
  "--sidebar-accent": "0 0% 65%",
  "--sidebar-accent-foreground": "0 0% 12%",
  "--sidebar-border": "0 0% 15%",
  "--sidebar-ring": "25 95% 53%",
  "--success": "142 76% 36%",
  "--success-foreground": "0 0% 100%",
  "--warning": "38 92% 50%",
  "--warning-foreground": "0 0% 12%",
  "--info": "25 95% 53%",
  "--info-foreground": "0 0% 12%",
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, []);

  return <>{children}</>;
};

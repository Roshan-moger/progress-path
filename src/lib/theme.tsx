import { useEffect } from "react";

export type ThemeVersion = "default";

export const useThemeVersion = () => "default" as ThemeVersion;

export const getVersionPrefix = () => "";

const themeVars = {
  // VYONA AI Theme - Deep Black, Silver/Grey, Vibrant Orange
  "--background": "0 0% 8%",
  "--foreground": "0 0% 98%",
  "--card": "220 20% 15%",
  "--card-foreground": "0 0% 98%",
  "--popover": "220 20% 15%",
  "--popover-foreground": "0 0% 98%",
  "--primary": "25 95% 53%",
  "--primary-foreground": "0 0% 12%",
  "--secondary": "220 15% 64%",
  "--secondary-foreground": "0 0% 12%",
  "--muted": "220 12% 28%",
  "--muted-foreground": "0 0% 75%",
  "--accent": "220 15% 64%",
  "--accent-foreground": "0 0% 12%",
  "--destructive": "0 84% 60%",
  "--destructive-foreground": "0 0% 12%",
  "--border": "220 15% 22%",
  "--input": "220 15% 18%",
  "--ring": "25 95% 53%",
  "--sidebar-background": "0 0% 10%",
  "--sidebar-foreground": "0 0% 98%",
  "--sidebar-primary": "25 95% 53%",
  "--sidebar-primary-foreground": "0 0% 12%",
  "--sidebar-accent": "220 15% 64%",
  "--sidebar-accent-foreground": "0 0% 12%",
  "--sidebar-border": "220 15% 22%",
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

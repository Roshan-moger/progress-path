import { useEffect } from "react";

export type ThemeVersion = "default";

export const useThemeVersion = () => "default" as ThemeVersion;

export const getVersionPrefix = () => "";

const themeVars = {
  // VYONA AI Theme - Orange, Gray, Black, White
  "--background": "0 0% 100%",
  "--foreground": "0 0% 12%",
  "--card": "0 0% 100%",
  "--card-foreground": "0 0% 12%",
  "--popover": "0 0% 100%",
  "--popover-foreground": "0 0% 12%",
  "--primary": "25 95% 53%", // Vibrant Orange
  "--primary-foreground": "0 0% 100%",
  "--secondary": "0 0% 25%", // Dark Gray
  "--secondary-foreground": "0 0% 100%",
  "--muted": "0 0% 94%",
  "--muted-foreground": "0 0% 45%",
  "--accent": "25 90% 92%", // Light Orange
  "--accent-foreground": "25 95% 40%",
  "--destructive": "0 84% 60%",
  "--destructive-foreground": "0 0% 100%",
  "--border": "0 0% 90%",
  "--input": "0 0% 90%",
  "--ring": "25 95% 53%",
  "--sidebar-background": "0 0% 12%",
  "--sidebar-foreground": "0 0% 100%",
  "--sidebar-primary": "25 95% 53%",
  "--sidebar-primary-foreground": "0 0% 100%",
  "--sidebar-accent": "25 95% 53%",
  "--sidebar-accent-foreground": "0 0% 100%",
  "--sidebar-border": "0 0% 25%",
  "--sidebar-ring": "25 95% 53%",
  "--success": "142 76% 36%",
  "--success-foreground": "0 0% 100%",
  "--warning": "38 92% 50%",
  "--warning-foreground": "0 0% 10%",
  "--info": "25 95% 53%",
  "--info-foreground": "0 0% 100%",
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

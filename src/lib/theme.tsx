import { useEffect } from "react";

export type ThemeVersion = "default";

export const useThemeVersion = () => "default" as ThemeVersion;

export const getVersionPrefix = () => "";

const themeVars = {
  // VYONA AI Theme - Orange, Gray, Black, White (Dark Mode)
  "--background": "0 0% 6%", // Very dark background
  "--foreground": "0 0% 95%", // White text
  "--card": "0 0% 12%", // Dark card
  "--card-foreground": "0 0% 95%",
  "--popover": "0 0% 12%",
  "--popover-foreground": "0 0% 95%",
  "--primary": "25 95% 53%", // Vibrant Orange from VYONA logo
  "--primary-foreground": "0 0% 12%",
  "--secondary": "0 0% 40%", // Medium Gray
  "--secondary-foreground": "0 0% 95%",
  "--muted": "0 0% 25%",
  "--muted-foreground": "0 0% 70%",
  "--accent": "25 85% 60%", // Brighter orange accent
  "--accent-foreground": "0 0% 12%",
  "--destructive": "0 84% 60%",
  "--destructive-foreground": "0 0% 12%",
  "--border": "0 0% 20%",
  "--input": "0 0% 15%",
  "--ring": "25 95% 53%",
  "--sidebar-background": "0 0% 8%",
  "--sidebar-foreground": "0 0% 95%",
  "--sidebar-primary": "25 95% 53%",
  "--sidebar-primary-foreground": "0 0% 12%",
  "--sidebar-accent": "25 85% 60%",
  "--sidebar-accent-foreground": "0 0% 12%",
  "--sidebar-border": "0 0% 20%",
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

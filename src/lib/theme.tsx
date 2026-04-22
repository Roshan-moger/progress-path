import { useEffect } from "react";

export type ThemeVersion = "default";

export const useThemeVersion = () => "default" as ThemeVersion;

export const getVersionPrefix = () => "";

const themeVars = {
  // VYONA AI Theme - Orange, Shiny Grey, Blue-tinted Dark
  "--background": "200 15% 10%", // Shiny dark grey-blue
  "--foreground": "0 0% 95%", // White text
  "--card": "200 12% 15%", // Lighter card
  "--card-foreground": "0 0% 95%",
  "--popover": "200 12% 15%",
  "--popover-foreground": "0 0% 95%",
  "--primary": "25 95% 53%", // Vibrant Orange from VYONA logo
  "--primary-foreground": "0 0% 12%",
  "--secondary": "200 8% 35%", // Grey accent
  "--secondary-foreground": "0 0% 95%",
  "--muted": "200 10% 28%",
  "--muted-foreground": "0 0% 70%",
  "--accent": "25 85% 60%", // Brighter orange accent
  "--accent-foreground": "0 0% 12%",
  "--destructive": "0 84% 60%",
  "--destructive-foreground": "0 0% 12%",
  "--border": "200 10% 25%",
  "--input": "200 10% 18%",
  "--ring": "25 95% 53%",
  "--sidebar-background": "200 12% 12%",
  "--sidebar-foreground": "0 0% 95%",
  "--sidebar-primary": "25 95% 53%",
  "--sidebar-primary-foreground": "0 0% 12%",
  "--sidebar-accent": "25 85% 60%",
  "--sidebar-accent-foreground": "0 0% 12%",
  "--sidebar-border": "200 10% 25%",
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

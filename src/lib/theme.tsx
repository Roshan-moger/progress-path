import { useEffect } from "react";

export type ThemeVersion = "default";

export const useThemeVersion = () => "default" as ThemeVersion;

export const getVersionPrefix = () => "";

const themeVars = {
  // VYONA AI Theme - Metallic White/Silver with Orange
  "--background": "220 10% 96%",
  "--foreground": "0 0% 12%",
  "--card": "0 0% 100%",
  "--card-foreground": "0 0% 12%",
  "--popover": "0 0% 100%",
  "--popover-foreground": "0 0% 12%",
  "--primary": "25 95% 53%",
  "--primary-foreground": "0 0% 100%",
  "--secondary": "220 12% 60%",
  "--secondary-foreground": "0 0% 100%",
  "--muted": "220 10% 88%",
  "--muted-foreground": "0 0% 40%",
  "--accent": "220 15% 65%",
  "--accent-foreground": "0 0% 100%",
  "--destructive": "0 84% 60%",
  "--destructive-foreground": "0 0% 100%",
  "--border": "220 10% 88%",
  "--input": "220 10% 92%",
  "--ring": "25 95% 53%",
  "--sidebar-background": "220 10% 92%",
  "--sidebar-foreground": "0 0% 12%",
  "--sidebar-primary": "25 95% 53%",
  "--sidebar-primary-foreground": "0 0% 100%",
  "--sidebar-accent": "220 15% 65%",
  "--sidebar-accent-foreground": "0 0% 100%",
  "--sidebar-border": "220 10% 85%",
  "--sidebar-ring": "25 95% 53%",
  "--success": "142 76% 36%",
  "--success-foreground": "0 0% 100%",
  "--warning": "38 92% 50%",
  "--warning-foreground": "0 0% 12%",
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

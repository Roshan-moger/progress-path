import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Upload, Settings, LogOut, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

const AdminLayout = ({ children, title, subtitle, actions }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const sideLinks = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/students", icon: Users, label: "Students" },
    { to: "/admin/upload", icon: Upload, label: "Upload" },
    { to: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-72 min-h-screen bg-card border-r border-border/60 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-border/60">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md">V</div>
            <div>
              <h1 className="font-heading text-lg font-bold text-foreground tracking-tight">Vyona</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Admin Suite</p>
            </div>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 px-3 mb-3">Workspace</p>
          {sideLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <button key={link.to} onClick={() => navigate(link.to)} className="w-full text-left">
                <motion.div
                  whileHover={{ x: 2 }}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="adminActiveLink"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                    />
                  )}
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </motion.div>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/60">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-sm font-semibold">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Admin</p>
              <p className="text-xs text-muted-foreground truncate">admin@vyona.com</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border/60 bg-card/50 backdrop-blur-sm sticky top-0 z-20 flex items-center px-8 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search students, branches, USN..."
              className="pl-9 h-10 bg-muted/40 border-transparent rounded-xl focus-visible:bg-card"
            />
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
          </Button>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          <div className="flex items-start justify-between gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">{title}</h1>
              {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
            </motion.div>
            {actions && <div className="shrink-0">{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

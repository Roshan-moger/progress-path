import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Upload, PenTool, Mic, FileText } from "lucide-react";

const links = [
  { to: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/student/resume", icon: Upload, label: "Resume Upload" },
  { to: "/student/test", icon: PenTool, label: "Aptitude Test" },
  { to: "/student/interview", icon: Mic, label: "AI Interview" },
  { to: "/student/report", icon: FileText, label: "My Report" },
];

const StudentSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <Link to="/" className="font-heading text-xl font-bold text-primary">Vyona.</Link>
        <p className="text-xs text-muted-foreground mt-0.5">Student Portal</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link key={link.to} to={link.to}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">A</div>
          <div>
            <p className="text-sm font-medium text-foreground">Student</p>
            <p className="text-xs text-muted-foreground">arjun@email.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;

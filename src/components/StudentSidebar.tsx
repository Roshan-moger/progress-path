import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Upload, PenTool, Mic, FileText, Lock } from "lucide-react";
import { isStepUnlocked, isStepCompleted } from "@/lib/progress";
import type { StepKey } from "@/lib/progress";
import { useToast } from "@/hooks/use-toast";

const baseLinks: { path: string; icon: typeof LayoutDashboard; label: string; step?: StepKey }[] = [
  { path: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/student/resume", icon: Upload, label: "Resume Upload", step: "resume" },
  { path: "/student/test", icon: PenTool, label: "Aptitude Test", step: "communication" },
  { path: "/student/interview", icon: Mic, label: "AI Interview", step: "interview" },
  { path: "/student/report", icon: FileText, label: "My Report", step: "report" },
];

const StudentSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const links = baseLinks.map(l => ({ ...l, to: l.path }));

  const student = (() => {
    try { return JSON.parse(localStorage.getItem("vyona_student") || "{}"); } catch { return {}; }
  })();

  const handleClick = (link: typeof links[0], e: React.MouseEvent) => {
    if (link.step && !isStepUnlocked(link.step)) {
      e.preventDefault();
      toast({ title: "Complete previous steps first", variant: "destructive" });
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <button onClick={() => navigate("/")} className="font-heading text-xl font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity">Vyona.</button>
        <p className="text-xs text-muted-foreground mt-0.5">Student Portal</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const active = location.pathname === link.to;
          const locked = link.step ? !isStepUnlocked(link.step) : false;
          return (
            <button key={link.to} onClick={() => {
              if (!locked) navigate(link.to);
              else handleClick(link, {} as React.MouseEvent);
            }} className="w-full text-left">
              <motion.div
                whileHover={locked ? {} : { x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  locked ? "text-muted-foreground/40 cursor-not-allowed" :
                  active ? "bg-primary text-primary-foreground" :
                  "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {locked ? <Lock className="w-5 h-5" /> : <link.icon className="w-5 h-5" />}
                {link.label}
              </motion.div>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
            {(student.name || "S")[0]}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{student.name || "Student"}</p>
            <p className="text-xs text-muted-foreground">{student.branch || ""} · {student.usn || ""}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;

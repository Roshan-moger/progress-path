import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "@/components/StudentSidebar";
import { Button } from "@/components/ui/button";
import { Bot, Lock, Shield, Video, ExternalLink, Sparkles, Zap } from "lucide-react";
import { isStepUnlocked, isStepCompleted } from "@/lib/progress";
import { useToast } from "@/hooks/use-toast";

const versions = [
  {
    id: "v1",
    route: "/student/interview-room",
    title: "Classic Pro",
    subtitle: "Modern dark theme with clean interface",
    gradient: "linear-gradient(135deg, hsl(152,80%,28%), hsl(152,60%,38%))",
    accent: "hsl(152,80%,28%)",
    icon: Shield,
    badge: "V1",
  },
  {
    id: "v2",
    route: "/student/interview-room-v2",
    title: "Crystal Blue",
    subtitle: "Clean blue-white professional design",
    gradient: "linear-gradient(135deg, #2563EB, #3B82F6, #60A5FA)",
    accent: "#2563EB",
    icon: Video,
    badge: "V2",
  },
  {
    id: "v3",
    route: "/student/interview-room-v3",
    title: "Neural Flame",
    subtitle: "Futuristic AI-powered dark interface",
    gradient: "linear-gradient(135deg, #EA580C, #F97316, #FB923C)",
    accent: "#F97316",
    icon: Zap,
    badge: "V3",
  },
];

const StudentInterviewSelect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const unlocked = isStepUnlocked("interview");
  const [completed, setCompleted] = useState(isStepCompleted("interview"));

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "interview-complete") {
        setCompleted(true);
        toast({ title: "✅ Interview Completed", description: "Your AI interview has been recorded successfully." });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [toast]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isStepCompleted("interview")) setCompleted(true);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!unlocked) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <StudentSidebar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Lock className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-semibold text-muted-foreground mb-2">Interview Locked</h2>
            <p className="text-muted-foreground">Complete all test sections first to unlock the AI interview.</p>
          </div>
        </main>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <StudentSidebar />
        <main className="flex-1 flex items-center justify-center p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
            <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-6">
              <Bot className="w-12 h-12 text-primary" />
            </div>
            <h2 className="font-heading text-2xl font-semibold mb-2">Interview Completed ✅</h2>
            <p className="text-muted-foreground mb-6">Your AI interview has been recorded. View your results in the report.</p>
            <Button onClick={() => navigate("/student/report")} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 h-12">
              View Report →
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  const openInterviewWindow = (route: string) => {
    const w = screen.width;
    const h = screen.height;
    const win = window.open(route, "interview", `width=${w},height=${h},left=0,top=0,menubar=no,toolbar=no,location=no,status=no,scrollbars=no,resizable=no`);
    if (!win) {
      toast({ title: "Popup Blocked", description: "Please allow popups for this site.", variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <StudentSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary">AI Interview</span>
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-heading text-4xl font-black text-foreground mb-3">Choose Your Interview Experience</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Select a UI version below. All versions have the same secure proctored interview with voice & text.</p>
          </div>

          {/* Security notice */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-8 max-w-2xl mx-auto">
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3"><Shield className="w-4 h-4 text-primary" /> All Versions Include</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
              {["Fullscreen lock", "Tab monitoring", "Copy/Paste blocked", "Camera proctoring", "Voice + Text", "One attempt only"].map((f, i) => (
                <span key={i} className="flex items-center gap-1.5"><span className="text-destructive">•</span> {f}</span>
              ))}
            </div>
          </div>

          {/* Version Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {versions.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                  onClick={() => openInterviewWindow(v.route)}>
                  {/* Preview header */}
                  <div className="h-48 flex items-center justify-center relative overflow-hidden" style={{ background: v.gradient }}>
                    <motion.div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                      whileHover={{ rotate: 5, scale: 1.1 }}>
                      <Icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-black tracking-wider">
                      {v.badge}
                    </div>
                    {/* Decorative elements */}
                    <motion.div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-white/10"
                      animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 3 }} />
                  </div>

                  <div className="p-6">
                    <h3 className="font-heading text-xl font-bold text-foreground mb-1">{v.title}</h3>
                    <p className="text-sm text-muted-foreground mb-5">{v.subtitle}</p>
                    <Button className="w-full rounded-xl h-11 font-semibold gap-2 text-white border-0"
                      style={{ background: v.gradient }}>
                      <ExternalLink className="w-4 h-4" /> Launch {v.badge}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="text-center text-sm text-destructive font-medium mt-8">⚠ You can only take this interview once. Make sure you're ready before launching.</p>
        </motion.div>
      </main>
    </div>
  );
};

export default StudentInterviewSelect;

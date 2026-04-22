import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "@/components/StudentSidebar";
import { Button } from "@/components/ui/button";
import { Bot, Lock, Shield, Video, ExternalLink } from "lucide-react";
import { isStepUnlocked, isStepCompleted } from "@/lib/progress";
import { useToast } from "@/hooks/use-toast";

const StudentInterview = () => {
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
    const interval = setInterval(() => { if (isStepCompleted("interview")) setCompleted(true); }, 2000);
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
            <Button onClick={() => navigate(`//student/report`)} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 h-12">
              View Report →
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  const openInterviewWindow = () => {
    const w = screen.width;
    const h = screen.height;
    const win = window.open(
      `//student/interview-room`,
      "interview",
      `width=${w},height=${h},left=0,top=0,menubar=no,toolbar=no,location=no,status=no,scrollbars=no,resizable=no`
    );
    if (!win) toast({ title: "Popup Blocked", description: "Please allow popups for this site.", variant: "destructive" });
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <StudentSidebar />
      <main className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
          <div className="w-28 h-28 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-6 relative">
            <Video className="w-14 h-14 text-primary" />
            <motion.div className="absolute inset-0 rounded-full border-2 border-primary/30" animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} />
          </div>
          <h2 className="font-heading text-3xl font-bold mb-3">AI Voice Interview</h2>
          <p className="text-muted-foreground mb-4">Secure voice & text based interview with AI. Opens in a <strong>new secure window</strong>.</p>
          <div className="bg-card border border-border rounded-2xl p-5 mb-6 text-left space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Security Features</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2"><span className="text-destructive font-bold">•</span> Opens in fullscreen secure window</li>
              <li className="flex items-start gap-2"><span className="text-destructive font-bold">•</span> Tab switching monitored — 3 violations = termination</li>
              <li className="flex items-start gap-2"><span className="text-destructive font-bold">•</span> Copy/Paste/Right-click/Keyboard shortcuts blocked</li>
              <li className="flex items-start gap-2"><span className="text-destructive font-bold">•</span> Camera & microphone proctoring enabled</li>
              <li className="flex items-start gap-2"><span className="text-destructive font-bold">•</span> One-time interview — no retakes allowed</li>
            </ul>
          </div>
          <p className="text-sm text-destructive font-medium mb-6">⚠ You can only take this interview once. Make sure you're ready.</p>
          <Button onClick={openInterviewWindow} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-10 h-13 text-base font-semibold gap-2">
            <ExternalLink className="w-5 h-5" /> Launch Secure Interview
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default StudentInterview;

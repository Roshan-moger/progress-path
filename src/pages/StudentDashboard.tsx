import { motion } from "framer-motion";
import StudentSidebar from "@/components/StudentSidebar";
import CircularProgress from "@/components/CircularProgress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, FileText, Mic, PenTool, Upload, BarChart3, BookOpen, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isStepCompleted, isStepUnlocked, getCurrentStep } from "@/lib/progress";
import type { StepKey } from "@/lib/progress";
import { useThemeVersion } from "@/lib/theme";
import { useToast } from "@/hooks/use-toast";

const baseSteps: { num: number; icon: typeof Upload; title: string; step: StepKey; desc: string; path: string }[] = [
  { num: 1, icon: Upload, title: "Resume Upload", step: "resume", desc: "Upload & AI parse your resume", path: "/student/resume" },
  { num: 2, icon: PenTool, title: "Communication Test", step: "communication", desc: "20 MCQ questions", path: "/student/test" },
  { num: 3, icon: BookOpen, title: "Domain Test", step: "domain", desc: "60 domain-specific questions", path: "/student/test" },
  { num: 4, icon: BarChart3, title: "Quants & Reasoning", step: "quants", desc: "20 questions", path: "/student/test" },
  { num: 5, icon: Mic, title: "AI Mock Interview", step: "interview", desc: "8-10 minutes, voice-based", path: "/student/interview" },
  { num: 6, icon: FileText, title: "PDF Report", step: "report", desc: "Download your assessment report", path: "/student/report" },
];

const StudentDashboard = () => {
  const { toast } = useToast();
  const currentStep = getCurrentStep();
  const version = useThemeVersion();
  const prefix = `/${version}`;

  const steps = baseSteps.map(s => ({ ...s, link: `${prefix}${s.path}` }));

  const student = (() => {
    try { return JSON.parse(localStorage.getItem("vyona_student") || "{}"); } catch { return {}; }
  })();

  const getStatus = (step: StepKey) => {
    if (isStepCompleted(step)) return "completed";
    if (isStepUnlocked(step)) return "active";
    return "locked";
  };

  const completedCount = steps.filter(s => isStepCompleted(s.step)).length;
  const overallProgress = Math.round((completedCount / steps.length) * 100);

  const handleStepClick = (step: typeof steps[0], e: React.MouseEvent) => {
    if (!isStepUnlocked(step.step)) {
      e.preventDefault();
      toast({ title: "Complete previous steps first", variant: "destructive" });
    }
  };

  const currentActiveStep = steps.find(s => s.step === currentStep);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <StudentSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-start justify-between mb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="font-heading text-3xl font-bold text-foreground">Welcome back, {student.name || "Student"}</h1>
              <p className="text-muted-foreground mt-1">{student.branch ? (student.branch === "Diploma" ? "Diploma" : `B.Tech ${student.branch}`) : ""} · {student.usn || ""}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30 px-4 py-1.5 text-sm font-medium">
                {completedCount === steps.length ? "Assessment Complete" : "Assessment in Progress"}
              </Badge>
            </motion.div>
          </div>

          {isStepCompleted("resume") && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-accent/50 border border-primary/20 rounded-2xl p-5 flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{student.name || "Student"}_Resume_2025.pdf</p>
                <p className="text-sm text-primary font-medium">Skills detected: React, Node.js, Python, MySQL · 2 projects · 1 Internship</p>
              </div>
              <span className="text-sm text-primary font-medium flex items-center gap-1"><Check className="w-4 h-4" /> Parsed</span>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="font-heading text-xl font-semibold mb-6">Assessment Progress</h2>
              <div className="space-y-1">
                {steps.map((step, i) => {
                  const status = getStatus(step.step);
                  return (
                    <motion.div key={step.num} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
                      className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                          status === "completed" ? "bg-primary border-primary text-primary-foreground" :
                          status === "active" ? "bg-secondary border-secondary text-secondary-foreground" :
                          "bg-muted border-border text-muted-foreground"
                        }`}>
                          {status === "completed" ? <Check className="w-5 h-5" /> : status === "locked" ? <Lock className="w-4 h-4" /> : step.num}
                        </div>
                        {i < steps.length - 1 && <div className={`w-0.5 h-12 ${status === "completed" ? "bg-primary" : "bg-border"}`} />}
                      </div>
                      <Link to={status === "locked" ? "#" : step.link} onClick={(e) => handleStepClick(step, e)}
                        className={`pb-8 pt-1.5 flex-1 ${status === "locked" ? "cursor-not-allowed" : "cursor-pointer"}`}>
                        <div className="flex items-center gap-2">
                          <p className={`font-semibold ${status === "locked" ? "text-muted-foreground" : "text-foreground"}`}>{step.title}</p>
                          {status === "active" && <Badge className="bg-success/15 text-success border-success/20 text-xs">Active</Badge>}
                          {status === "completed" && <Badge className="bg-primary/15 text-primary border-primary/20 text-xs">Done</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              {currentActiveStep && (
                <Link to={currentActiveStep.link}>
                  <Button className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl text-base font-semibold mt-4">
                    Continue: {currentActiveStep.title} →
                  </Button>
                </Link>
              )}
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-2xl p-7">
              <h2 className="font-heading text-xl font-semibold mb-6">Overall Progress</h2>
              <div className="flex justify-center mb-6">
                <CircularProgress value={overallProgress} size={140} label="Progress" />
              </div>
              <div className="space-y-3">
                {steps.map(s => {
                  const status = getStatus(s.step);
                  return (
                    <div key={s.step} className="flex items-center justify-between text-sm">
                      <span className={status === "locked" ? "text-muted-foreground" : "text-foreground"}>{s.title}</span>
                      {status === "completed" ? <Check className="w-4 h-4 text-primary" /> :
                       status === "active" ? <span className="text-xs text-secondary font-medium">In Progress</span> :
                       <Lock className="w-3 h-3 text-muted-foreground/50" />}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;

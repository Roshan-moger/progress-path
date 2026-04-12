import { motion } from "framer-motion";
import StudentSidebar from "@/components/StudentSidebar";
import CircularProgress from "@/components/CircularProgress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, FileText, Mic, PenTool, Upload, BarChart3, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const steps = [
  { num: 1, icon: Upload, title: "Resume Upload", status: "completed", desc: "Parsed successfully", link: "/student/resume" },
  { num: 2, icon: PenTool, title: "Communication Test", status: "completed", desc: "20/20 completed · 82%", link: "/student/test" },
  { num: 3, icon: BookOpen, title: "Domain Test", status: "active", desc: "60 questions · In progress", link: "/student/test" },
  { num: 4, icon: BarChart3, title: "Quants & Reasoning", status: "locked", desc: "20 questions", link: "/student/test" },
  { num: 5, icon: Mic, title: "AI Mock Interview", status: "locked", desc: "8-10 minutes, voice-based", link: "/student/interview" },
  { num: 6, icon: FileText, title: "PDF Report", status: "locked", desc: "Available after interview", link: "/student/report" },
];

const StudentDashboard = () => {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <StudentSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="font-heading text-3xl font-bold text-foreground">Welcome back, Arjun</h1>
              <p className="text-muted-foreground mt-1">B.Tech Computer Science · Final Year · SRM Institute</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30 px-4 py-1.5 text-sm font-medium">
                Assessment in Progress
              </Badge>
            </motion.div>
          </div>

          {/* Resume Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-accent/50 border border-primary/20 rounded-2xl p-5 flex items-center gap-4 mb-8"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-foreground">Arjun_Resume_2025.pdf</p>
              <p className="text-sm text-primary font-medium">Skills detected: React, Node.js, Python, MySQL · 2 projects · 1 Internship</p>
            </div>
            <span className="text-sm text-primary font-medium flex items-center gap-1">
              <Check className="w-4 h-4" /> Parsed
            </span>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Progress Steps */}
            <div className="lg:col-span-2">
              <h2 className="font-heading text-xl font-semibold mb-6">Assessment Progress</h2>
              <div className="space-y-1">
                {steps.map((step, i) => (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="flex items-start gap-4"
                  >
                    {/* Timeline */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                        step.status === "completed" ? "bg-primary border-primary text-primary-foreground" :
                        step.status === "active" ? "bg-secondary border-secondary text-secondary-foreground" :
                        "bg-muted border-border text-muted-foreground"
                      }`}>
                        {step.status === "completed" ? <Check className="w-5 h-5" /> : step.num}
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`w-0.5 h-12 ${step.status === "completed" ? "bg-primary" : "bg-border"}`} />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-8 pt-1.5">
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold ${step.status === "locked" ? "text-muted-foreground" : "text-foreground"}`}>
                          {step.title}
                        </p>
                        {step.status === "active" && (
                          <Badge className="bg-success/15 text-success border-success/20 text-xs">Active</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link to="/student/test">
                <Button className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl text-base font-semibold mt-4">
                  Continue Domain Test →
                </Button>
              </Link>
            </div>

            {/* Scores */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-2xl p-7"
            >
              <h2 className="font-heading text-xl font-semibold mb-6">Section Scores</h2>
              <div className="flex justify-center mb-6">
                <CircularProgress value={82} size={140} label="Communication" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <CircularProgress value={0} size={80} strokeWidth={6} label="Domain" />
                <CircularProgress value={0} size={80} strokeWidth={6} label="Quants" />
              </div>
              <p className="text-center text-sm text-muted-foreground mt-6">Complete all sections to unlock your overall score</p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;

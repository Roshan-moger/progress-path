import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "@/components/StudentSidebar";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle, Sparkles } from "lucide-react";
import { completeStep, isStepCompleted } from "@/lib/progress";

const StudentResume = () => {
  const alreadyDone = isStepCompleted("resume");
  const [stage, setStage] = useState<"upload" | "analyzing" | "done">(alreadyDone ? "done" : "upload");
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleUpload = () => {
    setStage("analyzing");
    setTimeout(() => {
      completeStep("resume");
      setStage("done");
    }, 3000);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <StudentSidebar />
      <main className="flex-1 p-8">
        <h1 className="font-heading text-3xl font-bold mb-2">Resume Upload</h1>
        <p className="text-muted-foreground mb-8">Upload your resume to begin the assessment</p>

        <AnimatePresence mode="wait">
          {stage === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`border-2 border-dashed rounded-3xl p-16 text-center transition-colors ${
                dragActive ? "border-primary bg-accent/50" : "border-border bg-card"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); handleUpload(); }}
            >
              <div className="w-20 h-20 rounded-2xl bg-accent mx-auto flex items-center justify-center mb-6">
                <Upload className="w-10 h-10 text-accent-foreground" />
              </div>
              <h2 className="font-heading text-xl font-semibold mb-2">Drag & Drop your resume</h2>
              <p className="text-muted-foreground mb-6">PDF, DOCX up to 5MB</p>
              <Button onClick={handleUpload} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8">
                Browse Files
              </Button>
            </motion.div>
          )}

          {stage === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-card border border-border rounded-3xl p-16 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-20 h-20 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center mb-6"
              >
                <Sparkles className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className="font-heading text-xl font-semibold mb-2">Analyzing your resume...</h2>
              <p className="text-muted-foreground">AI is extracting skills, projects, and experience</p>
              <div className="mt-6 max-w-xs mx-auto">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div className="h-full bg-primary rounded-full" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3 }} />
                </div>
              </div>
            </motion.div>
          )}

          {stage === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-3xl p-10"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-success/10 mx-auto flex items-center justify-center mb-4"
                >
                  <CheckCircle className="w-12 h-12 text-success" />
                </motion.div>
                <h2 className="font-heading text-2xl font-semibold">Resume Parsed Successfully!</h2>
              </div>

              <div className="bg-accent/50 rounded-2xl p-6 mb-6 border border-primary/10">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                  <span className="font-semibold text-foreground">Resume_2025.pdf</span>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label: "Skills Detected", value: "React, Node.js, Python, MySQL, Git" },
                    { label: "Projects", value: "2 Projects found" },
                    { label: "Experience", value: "1 Internship at TechCorp" },
                  ].map((item) => (
                    <div key={item.label} className="bg-card rounded-xl p-4 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                      <p className="text-sm font-semibold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => navigate("/student/test")}
                className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl text-base font-semibold"
              >
                Continue to Communication Test →
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default StudentResume;

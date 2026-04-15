import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "@/components/StudentSidebar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronRight, Lock } from "lucide-react";
import { isStepUnlocked, isStepCompleted, completeStep } from "@/lib/progress";
import type { StepKey } from "@/lib/progress";
import { useThemeVersion } from "@/lib/theme";
import { useToast } from "@/hooks/use-toast";

const testSections: { key: StepKey; title: string; subtitle: string; questions: { q: string; opts: string[]; correct: number }[] }[] = [
  {
    key: "communication", title: "Communication Test", subtitle: "English & Communication · MCQ",
    questions: [
      { q: "Choose the correct sentence:", opts: ["He don't know nothing.", "He doesn't know anything.", "He don't know anything.", "He doesn't know nothing."], correct: 1 },
      { q: "What is a synonym of 'eloquent'?", opts: ["Silent", "Articulate", "Confused", "Loud"], correct: 1 },
      { q: "Identify the passive voice:", opts: ["She wrote a letter.", "A letter was written by her.", "She is writing.", "She writes daily."], correct: 1 },
      { q: "Fill in: The report ___ submitted yesterday.", opts: ["is", "was", "were", "are"], correct: 1 },
    ],
  },
  {
    key: "domain", title: "Domain Test", subtitle: "Computer Science · MCQ",
    questions: [
      { q: "Which data structure uses FIFO principle?", opts: ["Stack", "Queue", "Tree", "Graph"], correct: 1 },
      { q: "What is the time complexity of binary search?", opts: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correct: 1 },
      { q: "Which protocol is used for secure web communication?", opts: ["HTTP", "FTP", "HTTPS", "SMTP"], correct: 2 },
      { q: "What does SQL stand for?", opts: ["Structured Query Language", "Simple Query Language", "Standard Query Logic", "System Query Language"], correct: 0 },
    ],
  },
  {
    key: "quants", title: "Quants & Reasoning", subtitle: "Quantitative Aptitude · MCQ",
    questions: [
      { q: "If x + 5 = 12, what is x?", opts: ["5", "6", "7", "8"], correct: 2 },
      { q: "A train travels 120km in 2 hours. Speed?", opts: ["40 km/h", "50 km/h", "60 km/h", "80 km/h"], correct: 2 },
      { q: "What comes next: 2, 6, 12, 20, ?", opts: ["28", "30", "32", "26"], correct: 1 },
      { q: "15% of 200 is?", opts: ["25", "30", "35", "20"], correct: 1 },
    ],
  },
];

const StudentTest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const version = useThemeVersion();
  const prefix = `/${version}`;

  const findActiveSection = () => {
    for (const sec of testSections) {
      if (!isStepCompleted(sec.key) && isStepUnlocked(sec.key)) return sec;
    }
    return null;
  };

  const [activeSection, setActiveSection] = useState(findActiveSection);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!activeSection) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <StudentSidebar />
        <main className="flex-1 p-8">
          <h1 className="font-heading text-3xl font-bold mb-4">Aptitude Tests</h1>
          <div className="space-y-4">
            {testSections.map((sec) => {
              const completed = isStepCompleted(sec.key);
              const unlocked = isStepUnlocked(sec.key);
              return (
                <motion.div key={sec.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`bg-card border border-border rounded-2xl p-6 flex items-center justify-between ${!unlocked ? "opacity-50" : ""}`}>
                  <div><h3 className="font-heading font-semibold text-foreground">{sec.title}</h3><p className="text-sm text-muted-foreground">{sec.subtitle}</p></div>
                  {completed ? <Badge className="bg-primary/15 text-primary border-primary/20">Completed ✓</Badge> : !unlocked ? <Lock className="w-5 h-5 text-muted-foreground" /> : null}
                </motion.div>
              );
            })}
          </div>
          {isStepCompleted("quants") && (
            <Button onClick={() => navigate(`${prefix}/student/interview`)} className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8">
              Continue to AI Interview →
            </Button>
          )}
        </main>
      </div>
    );
  }

  const questions = activeSection.questions;
  const progress = ((current + (finished ? 1 : 0)) / questions.length) * 100;

  const handleNext = () => {
    if (selected === questions[current].correct) setScore(s => s + 1);
    if (current < questions.length - 1) { setCurrent(c => c + 1); setSelected(null); }
    else { setFinished(true); completeStep(activeSection.key); }
  };

  const handleContinue = () => {
    const next = findActiveSection();
    if (next) { setActiveSection(next); setCurrent(0); setSelected(null); setScore(0); setFinished(false); }
    else navigate(`${prefix}/student/interview`);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <StudentSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="font-heading text-3xl font-bold">{activeSection.title}</h1><p className="text-muted-foreground">{activeSection.subtitle}</p></div>
          <Badge className="bg-accent text-accent-foreground border-border gap-2 px-4 py-2"><Clock className="w-4 h-4" /> 12:45 remaining</Badge>
        </div>
        <Progress value={progress} className="h-2 mb-8 rounded-full" />
        {!finished ? (
          <motion.div key={`${activeSection.key}-${current}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border rounded-3xl p-8 max-w-3xl">
            <p className="text-sm text-muted-foreground mb-2">Question {current + 1} of {questions.length}</p>
            <h2 className="font-heading text-xl font-semibold mb-6">{questions[current].q}</h2>
            <div className="space-y-3">
              {questions[current].opts.map((opt, i) => (
                <motion.button key={i} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => setSelected(i)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-colors font-medium ${selected === i ? "border-primary bg-accent text-accent-foreground" : "border-border bg-card text-foreground hover:border-primary/30"}`}>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-muted text-sm font-bold mr-3">{String.fromCharCode(65 + i)}</span>{opt}
                </motion.button>
              ))}
            </div>
            <Button onClick={handleNext} disabled={selected === null} className="mt-6 h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 text-base font-semibold">
              {current < questions.length - 1 ? "Next" : "Submit"} <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-3xl p-10 text-center max-w-lg mx-auto">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
              className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <span className="font-heading text-3xl font-bold text-success">{Math.round((score / questions.length) * 100)}%</span>
            </motion.div>
            <h2 className="font-heading text-2xl font-semibold mb-2">{activeSection.title} Complete!</h2>
            <p className="text-muted-foreground mb-6">You scored {score}/{questions.length} questions correctly</p>
            <Button onClick={handleContinue} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8">Continue to Next Section →</Button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default StudentTest;

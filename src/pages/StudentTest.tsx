import { useState } from "react";
import { motion } from "framer-motion";
import StudentSidebar from "@/components/StudentSidebar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronRight } from "lucide-react";

const sampleQuestions = [
  { q: "Which data structure uses FIFO principle?", opts: ["Stack", "Queue", "Tree", "Graph"], correct: 1 },
  { q: "What is the time complexity of binary search?", opts: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correct: 1 },
  { q: "Which protocol is used for secure web communication?", opts: ["HTTP", "FTP", "HTTPS", "SMTP"], correct: 2 },
  { q: "What does SQL stand for?", opts: ["Structured Query Language", "Simple Query Language", "Standard Query Logic", "System Query Language"], correct: 0 },
];

const StudentTest = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleNext = () => {
    if (selected === sampleQuestions[current].correct) setScore((s) => s + 1);
    if (current < sampleQuestions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const progress = ((current + (finished ? 1 : 0)) / sampleQuestions.length) * 100;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <StudentSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-3xl font-bold">Domain Test</h1>
            <p className="text-muted-foreground">Computer Science · MCQ</p>
          </div>
          <Badge className="bg-accent text-accent-foreground border-border gap-2 px-4 py-2">
            <Clock className="w-4 h-4" /> 12:45 remaining
          </Badge>
        </div>

        <Progress value={progress} className="h-2 mb-8 rounded-full" />

        {!finished ? (
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border rounded-3xl p-8 max-w-3xl"
          >
            <p className="text-sm text-muted-foreground mb-2">Question {current + 1} of {sampleQuestions.length}</p>
            <h2 className="font-heading text-xl font-semibold mb-6">{sampleQuestions[current].q}</h2>
            <div className="space-y-3">
              {sampleQuestions[current].opts.map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-colors font-medium ${
                    selected === i
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/30"
                  }`}
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-muted text-sm font-bold mr-3">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </motion.button>
              ))}
            </div>
            <Button
              onClick={handleNext}
              disabled={selected === null}
              className="mt-6 h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 text-base font-semibold"
            >
              {current < sampleQuestions.length - 1 ? "Next" : "Submit"} <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border rounded-3xl p-10 text-center max-w-lg mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4"
            >
              <span className="font-heading text-3xl font-bold text-success">{Math.round((score / sampleQuestions.length) * 100)}%</span>
            </motion.div>
            <h2 className="font-heading text-2xl font-semibold mb-2">Test Complete!</h2>
            <p className="text-muted-foreground mb-6">You scored {score}/{sampleQuestions.length} questions correctly</p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8">Continue to Next Section →</Button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default StudentTest;

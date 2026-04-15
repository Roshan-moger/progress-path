import { motion } from "framer-motion";
import StudentSidebar from "@/components/StudentSidebar";
import CircularProgress from "@/components/CircularProgress";
import { Button } from "@/components/ui/button";
import { Download, Award, TrendingUp, AlertCircle } from "lucide-react";

const sections = [
  { label: "Communication", score: 82, color: "text-primary" },
  { label: "Domain Knowledge", score: 75, color: "text-primary" },
  { label: "Quantitative", score: 68, color: "text-secondary" },
  { label: "Interview", score: 78, color: "text-primary" },
];

const StudentReport = () => {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <StudentSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold">Assessment Report</h1>
            <p className="text-muted-foreground">Complete overview of your performance</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </Button>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <CircularProgress value={76} size={180} strokeWidth={10} label="Overall Score" />
            <div className="flex-1 grid sm:grid-cols-2 gap-4">
              {sections.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-muted/50 rounded-xl p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">{s.label}</p>
                  <p className={`font-heading text-2xl font-bold ${s.color}`}>{s.score}%</p>
                  <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.score}%` }} transition={{ duration: 1, delay: 0.3 + i * 0.1 }} className="h-full bg-primary rounded-full" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Award, title: "Top Skills", items: ["React Development", "Problem Solving", "Communication"], variant: "success" as const },
            { icon: TrendingUp, title: "Growth Areas", items: ["System Design", "SQL Optimization", "Data Structures"], variant: "warning" as const },
            { icon: AlertCircle, title: "Recommendations", items: ["Practice mock interviews", "Improve quantitative speed", "Work on DSA problems"], variant: "info" as const },
          ].map((card, i) => (
            <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6">
              <div className={`w-10 h-10 rounded-xl bg-${card.variant}/10 flex items-center justify-center mb-4`}>
                <card.icon className={`w-5 h-5 text-${card.variant}`} />
              </div>
              <h3 className="font-heading font-semibold mb-3">{card.title}</h3>
              <ul className="space-y-2">
                {card.items.map(item => (
                  <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full bg-${card.variant}`} />{item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StudentReport;

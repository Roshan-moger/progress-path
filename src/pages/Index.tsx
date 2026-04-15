import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { FileText, Mic, Brain, BarChart3, Upload, Award } from "lucide-react";
import { useThemeVersion } from "@/lib/theme";

const stats = [
  { value: "100+", label: "Questions per assessment" },
  { value: "AI", label: "Dynamic interview questions" },
  { value: "2X", label: "Modes: College & Corporate" },
  { value: "PDF", label: "Instant reports" },
];

const features = [
  { icon: Upload, title: "Resume Upload", desc: "AI-powered resume parsing detects skills, projects, and experience automatically." },
  { icon: Brain, title: "Aptitude Tests", desc: "Adaptive MCQ tests covering communication, domain knowledge, and quantitative skills." },
  { icon: Mic, title: "Voice Interview", desc: "AI-driven mock interviews with real-time speech-to-text and intelligent follow-ups." },
  { icon: FileText, title: "PDF Reports", desc: "Comprehensive assessment reports with scores, analytics, and recommendations." },
  { icon: BarChart3, title: "Admin Dashboard", desc: "Track student progress across branches with Excel bulk import." },
  { icon: Award, title: "Smart Scoring", desc: "Section-wise scoring with circular progress indicators and overall assessment." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Index = () => {
  const version = useThemeVersion();
  const prefix = `/${version}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative pt-16 overflow-hidden">
        <div className="gradient-hero relative">
          <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-primary-foreground/5 blur-xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary-foreground/5 blur-2xl" />
          <div className="container mx-auto px-6 py-24 md:py-32 text-center relative z-10">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary-foreground/15 border border-primary-foreground/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-sm font-medium text-primary-foreground/90">Built for Colleges & Corporates</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
              className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-4">
              The smartest way to<br /><span className="text-secondary">assess candidates.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
              className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              AI-powered resume analysis, adaptive aptitude tests, and voice-based mock interviews — all in one platform.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={`${prefix}/student-login`}>
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-8 text-base font-semibold shadow-lg">
                  Student Login →
                </Button>
              </Link>
              <Link to={`${prefix}/admin-login`}>
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-full px-8 text-base font-semibold">
                  Employer Login
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
              {stats.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="py-8 text-center">
                  <div className="font-heading text-3xl md:text-4xl font-bold text-primary">{s.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">Everything you need</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">A complete assessment pipeline from resume to report.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="group gradient-card border border-border rounded-2xl p-7 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <f.icon className="w-6 h-6 text-accent-foreground group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-6 text-center">
          <span className="font-heading text-xl font-bold text-primary">Vyona.</span>
          <p className="text-muted-foreground text-sm mt-2">© 2026 Vyona. Engineering Intelligence Beyond Human Limits.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

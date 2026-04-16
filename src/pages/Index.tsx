import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { FileText, Mic, Brain, BarChart3, Upload, Award, ArrowRight, Bot, Sparkles, Zap, Shield, CheckCircle2 } from "lucide-react";
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
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-16">
        <div className="gradient-hero relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 hex-pattern" />
          <motion.div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-primary-foreground/5 blur-3xl"
            animate={{ scale: [1, 1.3, 1], x: [0, 30, 0] }} transition={{ repeat: Infinity, duration: 8 }} />
          <motion.div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl"
            animate={{ scale: [1, 1.2, 1], y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 6, delay: 1 }} />

          <div className="container mx-auto px-6 py-28 md:py-36 text-center relative z-10">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary-foreground/15 border border-primary-foreground/20 rounded-full px-5 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-primary-foreground/80" />
              <span className="text-sm font-semibold text-primary-foreground/90 tracking-wide">AI-POWERED ASSESSMENT PLATFORM</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
              className="font-heading text-5xl md:text-7xl lg:text-8xl font-black text-primary-foreground leading-[0.95] mb-6 tracking-tight">
              The smartest way<br />
              <span className="text-secondary">to assess</span>
              <br />candidates.
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
              className="text-primary-foreground/75 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              AI-powered resume analysis, adaptive aptitude tests, and voice-based mock interviews — all in one platform.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={`${prefix}/student-login`}>
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-10 py-6 text-base font-bold shadow-2xl group">
                  Student Login <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to={`${prefix}/admin-login`}>
                <Button size="lg" variant="outline" className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-full px-10 py-6 text-base font-bold">
                  Employer Login
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Diagonal cut bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-background" style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
        </div>

        {/* Stats bar */}
        <div className="bg-background relative z-10 -mt-1">
          <div className="container mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="bg-card border border-border rounded-2xl shadow-xl -mt-8 relative z-20">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
                {stats.map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
                    className="py-8 text-center group hover:bg-accent/50 transition-colors first:rounded-l-2xl last:rounded-r-2xl">
                    <div className="font-heading text-3xl md:text-4xl font-black text-primary mb-1">{s.value}</div>
                    <div className="text-xs md:text-sm text-muted-foreground font-medium">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES - Dark section with diagonal cut */}
      <section className="relative mt-16">
        <div className="bg-secondary text-secondary-foreground py-24 md:py-32 relative">
          <div className="absolute inset-0 hex-pattern opacity-30" />
          {/* Top diagonal */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-background" style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />

          <div className="container mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/20 rounded-full px-4 py-1.5 mb-4">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-primary tracking-wide">POWERFUL FEATURES</span>
              </div>
              <h2 className="font-heading text-4xl md:text-6xl font-black leading-tight mb-4">
                Everything you need
              </h2>
              <p className="text-secondary-foreground/60 text-lg max-w-xl mx-auto">
                A complete assessment pipeline from resume to report.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <motion.div key={f.title} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="group bg-background text-foreground rounded-2xl p-7 border-2 border-transparent hover:border-primary transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <f.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-heading text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom diagonal */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-background" style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-accent rounded-full px-4 py-1.5 mb-4">
              <Bot className="w-4 h-4 text-accent-foreground" />
              <span className="text-sm font-bold text-accent-foreground tracking-wide">HOW IT WORKS</span>
            </div>
            <h2 className="font-heading text-4xl md:text-6xl font-black text-foreground leading-tight mb-4">
              Simple 4-step process
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Upload Resume", desc: "AI parses your skills & experience", icon: Upload },
              { step: "02", title: "Take Tests", desc: "Communication, domain & aptitude", icon: Brain },
              { step: "03", title: "AI Interview", desc: "Voice-based mock interview", icon: Mic },
              { step: "04", title: "Get Report", desc: "Detailed PDF assessment report", icon: FileText },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="text-center group">
                <div className="relative mb-6 mx-auto w-20 h-20">
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform" />
                  <div className="relative w-full h-full bg-card border-2 border-primary/20 rounded-2xl flex items-center justify-center group-hover:border-primary transition-colors">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="font-heading text-4xl font-black text-primary/20 mb-2">{item.step}</div>
                <h3 className="font-heading text-lg font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="gradient-hero rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 hex-pattern" />
            <div className="relative z-10">
              <Shield className="w-12 h-12 text-primary-foreground/60 mx-auto mb-6" />
              <h2 className="font-heading text-3xl md:text-5xl font-black text-primary-foreground mb-4">Ready to get started?</h2>
              <p className="text-primary-foreground/70 text-lg mb-8 max-w-lg mx-auto">
                Join hundreds of colleges & companies using Vyona for smarter assessments.
              </p>
              <Link to={`${prefix}/student-login`}>
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-12 py-6 text-base font-bold shadow-2xl">
                  Get Started Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
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

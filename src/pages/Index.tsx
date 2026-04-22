import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { FileText, Mic, Brain, BarChart3, Upload, Award, ArrowRight, Sparkles, Shield, Star } from "lucide-react";

const stats = [
  { value: "100+", label: "Questions per assessment" },
  { value: "AI", label: "Dynamic interview" },
  { value: "2X", label: "College & Corporate modes" },
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
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const Index = () => {

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Soft background accents */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-accent border border-border rounded-full px-4 py-1.5 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground tracking-wide">AI-POWERED ASSESSMENT PLATFORM</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-[1.05] mb-6 tracking-tight max-w-5xl mx-auto"
          >
            The smartest way to{" "}
            <span className="text-primary">assess candidates</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            AI-powered resume analysis, adaptive aptitude tests, and voice-based mock interviews — all in one platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12"
          >
            <Link to="/student-login">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12 text-base font-semibold group">
                Student Login <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/admin-login">
              <Button size="lg" variant="outline" className="border-2 border-border hover:bg-accent rounded-full px-8 h-12 text-base font-semibold">
                Employer Login
              </Button>
            </Link>
          </motion.div>

          {/* Trust indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
              ))}
            </div>
            <span>Trusted by 100+ colleges & companies</span>
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="container mx-auto px-6 -mt-4 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-2xl shadow-sm"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
            {stats.map((s, i) => (
              <div key={s.label} className="py-8 px-4 text-center">
                <div className="font-heading text-3xl md:text-4xl font-black text-primary mb-1">{s.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 md:py-28 bg-accent/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-sm font-bold text-primary tracking-widest uppercase">Features</span>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-foreground leading-tight mt-3 mb-4">
              Everything you need
            </h2>
            <p className="text-muted-foreground text-lg">
              A complete assessment pipeline from resume to report.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group bg-card rounded-2xl p-7 border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-105 transition-all">
                  <f.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-heading text-xl font-bold mb-2 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-sm font-bold text-primary tracking-widest uppercase">How it works</span>
            <h2 className="font-heading text-4xl md:text-5xl font-black text-foreground leading-tight mt-3 mb-4">
              Simple 4-step process
            </h2>
            <p className="text-muted-foreground text-lg">
              From upload to report in minutes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Upload Resume", desc: "AI parses skills & experience", icon: Upload },
              { step: "02", title: "Take Tests", desc: "Communication & aptitude", icon: Brain },
              { step: "03", title: "AI Interview", desc: "Voice-based mock interview", icon: Mic },
              { step: "04", title: "Get Report", desc: "Detailed PDF assessment", icon: FileText },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-5 mx-auto w-16 h-16">
                  <div className="w-full h-full bg-primary/10 rounded-2xl flex items-center justify-center">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-black flex items-center justify-center">
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-heading text-lg font-bold mb-1 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary-foreground/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" />
            <div className="relative">
              <Shield className="w-12 h-12 text-primary-foreground/80 mx-auto mb-6" />
              <h2 className="font-heading text-3xl md:text-5xl font-black text-primary-foreground mb-4">
                Ready to get started?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto">
                Join hundreds of colleges & companies using Vyona for smarter assessments.
              </p>
              <Link to="/student-login">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-10 h-12 text-base font-bold">
                  Get Started Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-heading text-lg font-black text-primary">Vyona</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2026 Vyona. Engineering Intelligence Beyond Human Limits.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

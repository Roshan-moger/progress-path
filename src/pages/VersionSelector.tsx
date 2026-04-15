import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Shield, Zap, ArrowRight, Bot, Brain } from "lucide-react";

const versions = [
  {
    id: "v1",
    path: "/v1",
    title: "Classic Pro",
    subtitle: "Clean, modern green theme with professional aesthetics",
    gradient: "linear-gradient(135deg, hsl(152,80%,28%), hsl(152,60%,38%), hsl(140,50%,45%))",
    icon: Shield,
    badge: "V1",
    features: ["Professional green palette", "Clean typography", "Smooth animations"],
    preview: "🟢",
  },
  {
    id: "v2",
    path: "/v2",
    title: "Crystal Blue",
    subtitle: "Sleek blue-white professional design with clarity",
    gradient: "linear-gradient(135deg, #1D4ED8, #2563EB, #3B82F6, #60A5FA)",
    icon: Brain,
    badge: "V2",
    features: ["Blue-white palette", "Crystal clear UI", "Professional feel"],
    preview: "🔵",
  },
  {
    id: "v3",
    path: "/v3",
    title: "Neural Flame",
    subtitle: "Futuristic dark theme with orange neon accents",
    gradient: "linear-gradient(135deg, #9A3412, #EA580C, #F97316, #FB923C)",
    icon: Zap,
    badge: "V3",
    features: ["Dark futuristic UI", "Orange neon glow", "Sci-fi aesthetics"],
    preview: "🟠",
  },
];

const VersionSelector = () => {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#0A0A0F" }}>
      {/* BG Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute w-[800px] h-[800px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #22C55E, transparent 70%)", top: "-300px", left: "-200px" }}
          animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 8 }} />
        <motion.div className="absolute w-[600px] h-[600px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #3B82F6, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 6, delay: 2 }} />
        <motion.div className="absolute w-[700px] h-[700px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #F97316, transparent 70%)", bottom: "-200px", right: "-200px" }}
          animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 7, delay: 1 }} />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <motion.div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full border"
            style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
            animate={{ borderColor: ["rgba(34,197,94,0.3)", "rgba(59,130,246,0.3)", "rgba(249,115,22,0.3)", "rgba(34,197,94,0.3)"] }}
            transition={{ repeat: Infinity, duration: 4 }}>
            <Sparkles className="w-4 h-4 text-white/60" />
            <span className="text-sm font-medium text-white/60">Choose Your Experience</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4" style={{ fontFamily: "var(--font-heading)", background: "linear-gradient(135deg, #FFFFFF 20%, #A3A3A3 50%, #FFFFFF 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Vyona Platform
          </h1>
          <p className="text-xl text-white/40 max-w-2xl mx-auto">
            AI-Powered Assessment Platform — Select a design version to explore
          </p>
        </motion.div>

        {/* Version Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {versions.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div key={v.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}>
                <Link to={v.path} className="block group">
                  <motion.div
                    whileHover={{ y: -12, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="rounded-3xl overflow-hidden border transition-all duration-300"
                    style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                    
                    {/* Preview Header */}
                    <div className="h-56 flex items-center justify-center relative overflow-hidden" style={{ background: v.gradient }}>
                      <motion.div className="w-24 h-24 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                        style={{ background: "rgba(255,255,255,0.15)" }}
                        whileHover={{ rotate: 10, scale: 1.1 }}>
                        <Icon className="w-12 h-12 text-white" />
                      </motion.div>
                      
                      <div className="absolute top-5 right-5 px-4 py-1.5 rounded-full text-white text-xs font-black tracking-widest"
                        style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)" }}>
                        {v.badge}
                      </div>

                      {/* Decorative */}
                      <motion.div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                        animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 3 }} />
                      <motion.div className="absolute -top-8 -left-8 w-28 h-28 rounded-full"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                        animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 4, delay: 1 }} />
                    </div>

                    {/* Info */}
                    <div className="p-7">
                      <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>{v.title}</h3>
                      <p className="text-sm text-white/40 mb-5">{v.subtitle}</p>
                      
                      <div className="space-y-2 mb-6">
                        {v.features.map((f, fi) => (
                          <div key={fi} className="flex items-center gap-2 text-sm text-white/50">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: v.gradient }} />
                            {f}
                          </div>
                        ))}
                      </div>

                      <motion.div className="flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm text-white transition-all"
                        style={{ background: v.gradient }}
                        whileHover={{ gap: "12px" }}>
                        Explore {v.badge} <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="text-center mt-16">
          <p className="text-white/20 text-sm">© 2026 Vyona. Engineering Intelligence Beyond Human Limits.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default VersionSelector;

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Shield, Zap, ArrowRight, Brain } from "lucide-react";

const versions = [
  {
    id: "v1",
    path: "/v1",
    title: "Classic Pro",
    subtitle: "Clean, professional green palette with polished aesthetics",
    gradient: "linear-gradient(135deg, #166534, #16A34A, #22C55E)",
    accentColor: "#22C55E",
    icon: Shield,
    badge: "V1",
    features: ["Professional green palette", "Clean typography", "Smooth animations"],
  },
  {
    id: "v2",
    path: "/v2",
    title: "Crystal Blue",
    subtitle: "Sleek blue-white professional design with crystal clarity",
    gradient: "linear-gradient(135deg, #1D4ED8, #2563EB, #3B82F6)",
    accentColor: "#3B82F6",
    icon: Brain,
    badge: "V2",
    features: ["Blue-white palette", "Crystal clear UI", "Professional feel"],
  },
  {
    id: "v3",
    path: "/v3",
    title: "Neural Flame",
    subtitle: "Bold orange, black & white with futuristic energy",
    gradient: "linear-gradient(135deg, #9A3412, #EA580C, #F97316)",
    accentColor: "#F97316",
    icon: Zap,
    badge: "V3",
    features: ["Orange + Black + White", "Bold modern design", "High-energy aesthetics"],
  },
];

const VersionSelector = () => {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#06060A" }}>
      {/* Grid pattern */}
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Glow orbs */}
      <motion.div className="absolute w-[600px] h-[600px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, #22C55E, transparent 70%)", top: "-200px", left: "-100px" }}
        animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 8 }} />
      <motion.div className="absolute w-[500px] h-[500px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, #3B82F6, transparent 70%)", top: "40%", left: "50%", transform: "translate(-50%, -50%)" }}
        animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 6, delay: 2 }} />
      <motion.div className="absolute w-[600px] h-[600px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, #F97316, transparent 70%)", bottom: "-200px", right: "-100px" }}
        animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 7, delay: 1 }} />

      <div className="relative z-10 container mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-20">
          <motion.div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border"
            style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
            <Sparkles className="w-4 h-4 text-white/50" />
            <span className="text-sm font-bold text-white/50 tracking-widest uppercase">Choose Your Experience</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6" style={{ fontFamily: "var(--font-heading)", color: "#fff" }}>
            Vyona
            <span className="block text-3xl md:text-4xl font-medium tracking-normal text-white/30 mt-2">AI Assessment Platform</span>
          </h1>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {versions.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div key={v.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.6 }}>
                <Link to={v.path} className="block group">
                  <motion.div
                    whileHover={{ y: -12 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="rounded-3xl overflow-hidden border transition-all duration-500 hover:shadow-2xl"
                    style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>

                    {/* Gradient header */}
                    <div className="h-52 flex items-center justify-center relative overflow-hidden" style={{ background: v.gradient }}>
                      <div className="absolute inset-0 hex-pattern opacity-20" />
                      <motion.div className="w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20"
                        style={{ background: "rgba(255,255,255,0.15)" }}
                        whileHover={{ rotate: 10, scale: 1.1 }}>
                        <Icon className="w-10 h-10 text-white" />
                      </motion.div>

                      <div className="absolute top-5 right-5 px-4 py-1.5 rounded-full text-white text-xs font-black tracking-widest"
                        style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(10px)" }}>
                        {v.badge}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-7">
                      <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "var(--font-heading)" }}>{v.title}</h3>
                      <p className="text-sm text-white/35 mb-5 leading-relaxed">{v.subtitle}</p>

                      <div className="space-y-2.5 mb-6">
                        {v.features.map((f, fi) => (
                          <div key={fi} className="flex items-center gap-2.5 text-sm text-white/45">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: v.accentColor }} />
                            {f}
                          </div>
                        ))}
                      </div>

                      <motion.div className="flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm text-white"
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

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="text-center mt-20">
          <p className="text-white/15 text-sm">© 2026 Vyona. Engineering Intelligence Beyond Human Limits.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default VersionSelector;

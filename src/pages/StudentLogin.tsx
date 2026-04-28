import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Sparkles, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { resetProgress } from "@/lib/progress";

const branches = ["CSE", "ECE", "EEE", "ME", "CE", "Diploma"];

const StudentLogin = () => {
  const [usn, setUsn] = useState("");
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usn.trim()) { toast({ title: "Please enter your USN", variant: "destructive" }); return; }
    if (!branch) { toast({ title: "Please select your branch", variant: "destructive" }); return; }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("vyona_student", JSON.stringify({ usn: usn.toUpperCase(), branch, name: "Arjun" }));
      resetProgress();
      navigate("/student/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Split layout */}
      <div className="flex min-h-screen">
        {/* Left - Branding side */}
        <div className="hidden lg:flex lg:w-1/2 gradient-hero relative items-center justify-center p-12">
          <div className="absolute inset-0 hex-pattern" />
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
            className="relative z-10 text-center">
            <motion.div className="w-24 h-24 rounded-3xl bg-primary-foreground/15 flex items-center justify-center mx-auto mb-8 backdrop-blur-sm"
              animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
              <GraduationCap className="w-12 h-12 text-primary-foreground" />
            </motion.div>
            <h2 className="font-heading text-4xl font-black text-primary-foreground mb-4">Student Portal</h2>
            <p className="text-primary-foreground/70 text-lg max-w-sm mx-auto leading-relaxed">
              Complete your AI-powered assessment journey — from resume to final report.
            </p>
            <div className="mt-10 space-y-3 text-left max-w-xs mx-auto">
              {["Resume Analysis", "Aptitude Tests", "AI Mock Interview", "PDF Report"].map((item, i) => (
                <motion.div key={item} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3 text-primary-foreground/80">
                  <div className="w-8 h-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  <span className="font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right - Form side */}
        <div className="flex-1 flex items-center justify-center p-6 bg-background">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="w-full max-w-md">
            <button onClick={() => navigate("/")} className="font-heading text-3xl font-black text-primary block mb-1 hover:opacity-80 transition-opacity cursor-pointer">Vyona.</button>
            <p className="text-muted-foreground text-sm mb-10">Sign in to your student account</p>

            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-heading text-xl font-bold">Welcome Back</h1>
                  <p className="text-sm text-muted-foreground">Enter your USN to continue</p>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <Label htmlFor="usn" className="text-foreground font-semibold text-sm">University Serial Number (USN)</Label>
                  <Input id="usn" placeholder="e.g. 1SI22CS045" value={usn} onChange={(e) => setUsn(e.target.value)}
                    className="mt-2 h-12 rounded-xl text-base border-2 focus:border-primary" />
                </div>
                <div>
                  <Label className="text-foreground font-semibold text-sm">Branch</Label>
                  <Select value={branch} onValueChange={setBranch}>
                    <SelectTrigger className="mt-2 h-12 rounded-xl text-base border-2">
                      <SelectValue placeholder="Select your branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => (<SelectItem key={b} value={b}>{b === "Diploma" ? "Diploma" : `B.Tech ${b}`}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={loading}
                  className="w-full h-13 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-bold group">
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                  ) : (
                    <>Login <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </Button>
              </form>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Are you an admin? <Link to="/admin-login" className="text-primary font-semibold hover:underline">Login here</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;

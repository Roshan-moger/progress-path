import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { resetProgress } from "@/lib/progress";
import { useThemeVersion } from "@/lib/theme";

const branches = ["CSE", "ECE", "EEE", "ME", "CE", "Diploma"];

const StudentLogin = () => {
  const [usn, setUsn] = useState("");
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const version = useThemeVersion();
  const prefix = `/${version}`;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usn.trim()) { toast({ title: "Please enter your USN", variant: "destructive" }); return; }
    if (!branch) { toast({ title: "Please select your branch", variant: "destructive" }); return; }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("vyona_student", JSON.stringify({ usn: usn.toUpperCase(), branch, name: "Arjun" }));
      resetProgress();
      navigate(`${prefix}/student/dashboard`);
    }, 800);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card rounded-3xl shadow-2xl p-8 md:p-10">
        <Link to={prefix} className="font-heading text-2xl font-bold text-primary block mb-2">Vyona.</Link>
        <p className="text-muted-foreground text-sm mb-8">Student Portal</p>
        <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="w-8 h-8 text-accent-foreground" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-center mb-1">Welcome Back</h1>
        <p className="text-center text-muted-foreground text-sm mb-8">Enter your USN to continue your assessment</p>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <Label htmlFor="usn" className="text-foreground font-medium">University Serial Number (USN)</Label>
            <Input id="usn" placeholder="e.g. 1SI22CS045" value={usn} onChange={(e) => setUsn(e.target.value)} className="mt-2 h-12 rounded-xl text-base" />
          </div>
          <div>
            <Label className="text-foreground font-medium">Branch</Label>
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger className="mt-2 h-12 rounded-xl text-base"><SelectValue placeholder="Select your branch" /></SelectTrigger>
              <SelectContent>
                {branches.map((b) => (<SelectItem key={b} value={b}>{b === "Diploma" ? "Diploma" : `B.Tech ${b}`}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading} className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-semibold">
            {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" /> : "Login →"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Are you an admin? <Link to={`${prefix}/admin-login`} className="text-primary font-medium hover:underline">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default StudentLogin;

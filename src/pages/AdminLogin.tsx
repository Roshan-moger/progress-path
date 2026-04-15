import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useThemeVersion } from "@/lib/theme";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const version = useThemeVersion();
  const prefix = `/${version}`;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast({ title: "Please fill all fields", variant: "destructive" }); return; }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("vyona_admin", "true");
      navigate(`${prefix}/admin/dashboard`);
    }, 800);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card rounded-3xl shadow-2xl p-8 md:p-10">
        <Link to={prefix} className="font-heading text-2xl font-bold text-primary block mb-2">Vyona.</Link>
        <p className="text-muted-foreground text-sm mb-8">Admin Portal</p>
        <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-accent-foreground" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-center mb-1">Admin Access</h1>
        <p className="text-center text-muted-foreground text-sm mb-8">Sign in with your admin credentials</p>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
            <Input id="email" type="email" placeholder="admin@vyona.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-12 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 h-12 rounded-xl" />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-base font-semibold">
            {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" /> : "Sign In →"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Student? <Link to={`${prefix}/student-login`} className="text-primary font-medium hover:underline">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl shadow-lg shadow-primary/5"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="flex items-center gap-3 font-heading text-2xl font-black tracking-tight group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/40 group-hover:shadow-primary/60 transition-all">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-foreground">VYONA</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          <Link to="/admin-login" className="hover:text-primary transition-colors">For Employers</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/student-login">
            <Button variant="ghost" size="sm" className="text-foreground font-semibold hover:text-primary">Sign in</Button>
          </Link>
          <Link to="/student-login">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 font-bold shadow-lg shadow-primary/30">
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

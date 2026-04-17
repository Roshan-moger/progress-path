import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useThemeVersion } from "@/lib/theme";
import { Sparkles } from "lucide-react";

const Navbar = () => {
  const version = useThemeVersion();
  const prefix = `/${version}`;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Link to={prefix} className="flex items-center gap-2 font-heading text-2xl font-black text-primary tracking-tight">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          Vyona
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          <Link to={`${prefix}/admin-login`} className="hover:text-foreground transition-colors">For Employers</Link>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`${prefix}/student-login`}>
            <Button variant="ghost" size="sm" className="text-foreground font-medium">Sign in</Button>
          </Link>
          <Link to={`${prefix}/student-login`}>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 font-semibold">
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/98 backdrop-blur-md shadow-xl"
    >
      <div className="w-full flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 sm:gap-3 font-heading text-xl sm:text-2xl font-black tracking-tight group flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/40 group-hover:shadow-primary/60 transition-all">
            <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-primary-foreground" />
          </div>
          <span className="text-foreground hidden sm:inline">VYONA</span>
        </button>

        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-xs sm:text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-primary transition-colors duration-200">Features</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors duration-200">How it works</a>
          <button onClick={() => navigate("/admin-login")} className="hover:text-primary transition-colors duration-200 cursor-pointer">Employers</button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={() => navigate("/student-login")} className="hidden sm:block">
            <Button variant="ghost" size="sm" className="text-foreground font-semibold hover:text-primary text-xs sm:text-sm">Sign in</Button>
          </button>
          <button onClick={() => navigate("/student-login")}>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 sm:px-6 py-2 font-bold shadow-lg shadow-primary/30 transition-all text-xs sm:text-sm">
              Get started
            </Button>
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

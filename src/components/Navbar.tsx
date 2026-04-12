import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="font-heading text-2xl font-bold text-primary tracking-tight">
          Vyona.
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/student-login">
            <Button variant="ghost" size="sm" className="text-foreground">Sign in</Button>
          </Link>
          <Link to="/admin-login">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5">
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

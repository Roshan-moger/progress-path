import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Upload, Settings, FileSpreadsheet, CheckCircle, Download } from "lucide-react";

const sideLinks = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/students", icon: Users, label: "Students" },
  { to: "/admin/upload", icon: Upload, label: "Upload Students" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

const AdminUpload = () => {
  const [stage, setStage] = useState<"upload" | "processing" | "done">("upload");
  const location = useLocation();

  const handleUpload = () => {
    setStage("processing");
    setTimeout(() => setStage("done"), 2500);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="font-heading text-xl font-bold text-primary">Vyona.</Link>
          <p className="text-xs text-muted-foreground mt-0.5">Admin Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sideLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to}>
                <motion.div whileHover={{ x: 4 }} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}>
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="font-heading text-3xl font-bold mb-2">Upload Students</h1>
        <p className="text-muted-foreground mb-8">Import students via Excel file (.xlsx) — only admin-uploaded students can login</p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-accent/50 border border-primary/10 rounded-2xl p-5 flex items-center justify-between mb-8">
          <div>
            <p className="font-semibold text-foreground">Download Template</p>
            <p className="text-sm text-muted-foreground">Use our Excel template with columns: Name, USN, Branch, Email</p>
          </div>
          <Button variant="outline" className="rounded-xl gap-2 border-primary/20 text-primary">
            <Download className="w-4 h-4" /> Template.xlsx
          </Button>
        </motion.div>

        <AnimatePresence mode="wait">
          {stage === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-2 border-dashed border-border rounded-3xl p-16 text-center bg-card"
            >
              <div className="w-20 h-20 rounded-2xl bg-accent mx-auto flex items-center justify-center mb-6">
                <FileSpreadsheet className="w-10 h-10 text-accent-foreground" />
              </div>
              <h2 className="font-heading text-xl font-semibold mb-2">Drag & Drop Excel file</h2>
              <p className="text-muted-foreground mb-6">.xlsx or .csv files supported</p>
              <Button onClick={handleUpload} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8">
                Browse Files
              </Button>
            </motion.div>
          )}

          {stage === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card border border-border rounded-3xl p-16 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-20 h-20 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center mb-6">
                <FileSpreadsheet className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className="font-heading text-xl font-semibold mb-2">Processing Excel file...</h2>
              <p className="text-muted-foreground">Importing student records</p>
              <div className="mt-6 max-w-xs mx-auto h-2 bg-muted rounded-full overflow-hidden">
                <motion.div className="h-full bg-primary rounded-full" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2.5 }} />
              </div>
            </motion.div>
          )}

          {stage === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-3xl p-10 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-20 h-20 rounded-full bg-success/10 mx-auto flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-success" />
              </motion.div>
              <h2 className="font-heading text-2xl font-semibold mb-2">Import Successful!</h2>
              <p className="text-muted-foreground mb-6">30 students imported across 6 branches</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 max-w-2xl mx-auto mb-8">
                {[
                  { branch: "CSE", count: 10 },
                  { branch: "ECE", count: 5 },
                  { branch: "EEE", count: 4 },
                  { branch: "ME", count: 4 },
                  { branch: "CE", count: 3 },
                  { branch: "Diploma", count: 4 },
                ].map((b) => (
                  <div key={b.branch} className="bg-muted/50 rounded-xl p-3 border border-border">
                    <p className="font-heading text-xl font-bold text-primary">{b.count}</p>
                    <p className="text-xs text-muted-foreground">{b.branch}</p>
                  </div>
                ))}
              </div>
              <Link to="/admin/dashboard">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8">View Dashboard →</Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminUpload;

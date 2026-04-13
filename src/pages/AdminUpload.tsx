import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Upload, Settings, FileSpreadsheet, CheckCircle, Download, Plus, UserPlus } from "lucide-react";

const sideLinks = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/students", icon: Users, label: "Students" },
  { to: "/admin/upload", icon: Upload, label: "Upload Students" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

const branches = ["CSE", "ECE", "EEE", "ME", "CE", "Diploma"];

const AdminUpload = () => {
  const [stage, setStage] = useState<"choose" | "excel" | "manual" | "processing" | "done">("choose");
  const [selectedBranch, setSelectedBranch] = useState("CSE");
  const [manualName, setManualName] = useState("");
  const [manualUSN, setManualUSN] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [addedStudents, setAddedStudents] = useState<{ name: string; usn: string; branch: string }[]>([]);
  const location = useLocation();

  const handleUpload = () => {
    setStage("processing");
    setTimeout(() => setStage("done"), 2500);
  };

  const handleAddManual = () => {
    if (!manualName.trim() || !manualUSN.trim()) return;
    setAddedStudents((prev) => [...prev, { name: manualName, usn: manualUSN, branch: selectedBranch }]);
    setManualName("");
    setManualUSN("");
    setManualEmail("");
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
        <h1 className="font-heading text-3xl font-bold mb-2">Add Students</h1>
        <p className="text-muted-foreground mb-6">Import via Excel or add students manually — branch-wise</p>

        {/* Branch selector — always visible */}
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-2 block">Select Branch</label>
          <div className="flex flex-wrap gap-2">
            {branches.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBranch(b)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedBranch === b ? "bg-primary text-primary-foreground shadow-md" : "bg-card border border-border text-muted-foreground hover:bg-accent"}`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {stage === "choose" && (
            <motion.div key="choose" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Excel upload card */}
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => setStage("excel")}
                className="bg-card border border-border rounded-2xl p-8 cursor-pointer hover:border-primary/30 transition-colors"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-5">
                  <FileSpreadsheet className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">Bulk Upload (Excel)</h3>
                <p className="text-sm text-muted-foreground">Upload .xlsx file with multiple students for <span className="text-primary font-medium">{selectedBranch}</span> branch</p>
              </motion.div>

              {/* Manual add card */}
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => setStage("manual")}
                className="bg-card border border-border rounded-2xl p-8 cursor-pointer hover:border-primary/30 transition-colors"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <UserPlus className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">Add Manually</h3>
                <p className="text-sm text-muted-foreground">Add individual students to <span className="text-primary font-medium">{selectedBranch}</span> branch one by one</p>
              </motion.div>
            </motion.div>
          )}

          {stage === "excel" && (
            <motion.div key="excel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setStage("choose")} className="text-sm text-primary hover:underline">← Back</button>
                <span className="text-sm font-medium text-muted-foreground">Branch: <span className="text-primary">{selectedBranch}</span></span>
              </div>

              <motion.div className="bg-accent/50 border border-primary/10 rounded-2xl p-5 flex items-center justify-between mb-6">
                <div>
                  <p className="font-semibold text-foreground">Download Template</p>
                  <p className="text-sm text-muted-foreground">Columns: Name, USN, Email</p>
                </div>
                <Button variant="outline" className="rounded-xl gap-2 border-primary/20 text-primary">
                  <Download className="w-4 h-4" /> Template.xlsx
                </Button>
              </motion.div>

              <div className="border-2 border-dashed border-border rounded-3xl p-16 text-center bg-card">
                <div className="w-20 h-20 rounded-2xl bg-accent mx-auto flex items-center justify-center mb-6">
                  <FileSpreadsheet className="w-10 h-10 text-accent-foreground" />
                </div>
                <h2 className="font-heading text-xl font-semibold mb-2">Upload Excel for {selectedBranch}</h2>
                <p className="text-muted-foreground mb-6">.xlsx or .csv files supported</p>
                <Button onClick={handleUpload} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8">
                  Browse Files
                </Button>
              </div>
            </motion.div>
          )}

          {stage === "manual" && (
            <motion.div key="manual" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setStage("choose")} className="text-sm text-primary hover:underline">← Back</button>
                <span className="text-sm font-medium text-muted-foreground">Branch: <span className="text-primary">{selectedBranch}</span></span>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" /> Add Student to {selectedBranch}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text" placeholder="Full Name" value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="h-11 px-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    type="text" placeholder="USN (e.g. 1VY22CS001)" value={manualUSN}
                    onChange={(e) => setManualUSN(e.target.value)}
                    className="h-11 px-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    type="email" placeholder="Email" value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    className="h-11 px-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <Button onClick={handleAddManual} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2">
                  <UserPlus className="w-4 h-4" /> Add Student
                </Button>
              </div>

              {addedStudents.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold text-foreground">Added Students ({addedStudents.length})</h3>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">#</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">USN</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Branch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addedStudents.map((s, i) => (
                        <tr key={i} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                          <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{s.usn}</td>
                          <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">{s.branch}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </motion.div>
          )}

          {stage === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card border border-border rounded-3xl p-16 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-20 h-20 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center mb-6">
                <FileSpreadsheet className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className="font-heading text-xl font-semibold mb-2">Importing {selectedBranch} students...</h2>
              <p className="text-muted-foreground">Processing Excel file</p>
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
              <p className="text-muted-foreground mb-6">15 students imported to <span className="text-primary font-semibold">{selectedBranch}</span></p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => setStage("choose")} variant="outline" className="rounded-xl px-6">Add More</Button>
                <Link to="/admin/dashboard">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8">View Dashboard →</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminUpload;

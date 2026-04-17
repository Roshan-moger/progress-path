import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet, CheckCircle, Download, Plus, UserPlus, ArrowLeft, Sparkles } from "lucide-react";
import { useThemeVersion } from "@/lib/theme";
import AdminLayout from "@/components/AdminLayout";

const branches = ["CSE", "ECE", "EEE", "ME", "CE", "Diploma"];

const AdminUpload = () => {
  const [stage, setStage] = useState<"choose" | "excel" | "manual" | "processing" | "done">("choose");
  const [selectedBranch, setSelectedBranch] = useState("CSE");
  const [manualName, setManualName] = useState("");
  const [manualUSN, setManualUSN] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [addedStudents, setAddedStudents] = useState<{ name: string; usn: string; branch: string }[]>([]);
  const version = useThemeVersion();
  const prefix = `/${version}`;

  const handleUpload = () => { setStage("processing"); setTimeout(() => setStage("done"), 2500); };
  const handleAddManual = () => {
    if (!manualName.trim() || !manualUSN.trim()) return;
    setAddedStudents(prev => [...prev, { name: manualName, usn: manualUSN, branch: selectedBranch }]);
    setManualName(""); setManualUSN(""); setManualEmail("");
  };

  return (
    <AdminLayout
      title="Add Students"
      subtitle="Import students in bulk via Excel or add them manually — branch-wise"
    >
      {/* Branch selector */}
      <div className="bg-card border border-border/60 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Target Branch</p>
            <p className="text-xs text-muted-foreground">Students will be added to the selected branch</p>
          </div>
          <span className="text-xs text-muted-foreground">{branches.length} options</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {branches.map(b => (
            <button key={b} onClick={() => setSelectedBranch(b)}
              className={`px-4 h-9 rounded-xl text-sm font-medium transition-all ${
                selectedBranch === b
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>{b}</button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {stage === "choose" && (
          <motion.div key="choose" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.button whileHover={{ y: -3 }} onClick={() => setStage("excel")}
              className="text-left bg-card border border-border/60 rounded-2xl p-7 hover:border-primary/40 hover:shadow-lg transition-all group relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <FileSpreadsheet className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-1.5">Bulk Upload</h3>
                <p className="text-sm text-muted-foreground mb-4">Import multiple students for <span className="text-primary font-medium">{selectedBranch}</span> from an .xlsx file</p>
                <span className="inline-flex items-center text-xs text-primary font-medium">Get started <ArrowLeft className="w-3 h-3 ml-1 rotate-180" /></span>
              </div>
            </motion.button>

            <motion.button whileHover={{ y: -3 }} onClick={() => setStage("manual")}
              className="text-left bg-card border border-border/60 rounded-2xl p-7 hover:border-primary/40 hover:shadow-lg transition-all group relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <UserPlus className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-1.5">Add Manually</h3>
                <p className="text-sm text-muted-foreground mb-4">Add individual students to <span className="text-primary font-medium">{selectedBranch}</span> one by one</p>
                <span className="inline-flex items-center text-xs text-primary font-medium">Get started <ArrowLeft className="w-3 h-3 ml-1 rotate-180" /></span>
              </div>
            </motion.button>
          </motion.div>
        )}

        {stage === "excel" && (
          <motion.div key="excel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Button variant="ghost" onClick={() => setStage("choose")} className="rounded-xl gap-2 mb-4 -ml-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>

            <div className="bg-gradient-to-br from-primary/5 to-card border border-border/60 rounded-2xl p-5 flex items-center justify-between mb-5 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Download className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Download template</p>
                  <p className="text-xs text-muted-foreground">Required columns: Name, USN, Email</p>
                </div>
              </div>
              <Button variant="outline" className="rounded-xl gap-2"><Download className="w-4 h-4" /> Template.xlsx</Button>
            </div>

            <div className="border-2 border-dashed border-border rounded-3xl p-16 text-center bg-card hover:border-primary/40 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center mb-5">
                <FileSpreadsheet className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading text-xl font-semibold mb-1">Upload Excel for {selectedBranch}</h2>
              <p className="text-muted-foreground text-sm mb-6">Drag & drop or click to browse · .xlsx, .csv supported</p>
              <Button onClick={handleUpload} className="rounded-xl px-8 h-11">Browse Files</Button>
            </div>
          </motion.div>
        )}

        {stage === "manual" && (
          <motion.div key="manual" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Button variant="ghost" onClick={() => setStage("choose")} className="rounded-xl gap-2 mb-4 -ml-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>

            <div className="bg-card border border-border/60 rounded-2xl p-6 mb-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-heading text-base font-semibold">Add to {selectedBranch}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <Input placeholder="Full Name" value={manualName} onChange={e => setManualName(e.target.value)} className="h-11 rounded-xl" />
                <Input placeholder="USN (e.g. 1VY22CS001)" value={manualUSN} onChange={e => setManualUSN(e.target.value)} className="h-11 rounded-xl font-mono text-sm" />
                <Input type="email" placeholder="Email" value={manualEmail} onChange={e => setManualEmail(e.target.value)} className="h-11 rounded-xl" />
              </div>
              <Button onClick={handleAddManual} className="rounded-xl gap-2 h-10"><UserPlus className="w-4 h-4" /> Add Student</Button>
            </div>

            {addedStudents.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border/60 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-border/60 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground text-sm">Added students</h3>
                  <span className="text-xs text-muted-foreground">{addedStudents.length} total</span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/30">
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">#</th>
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">USN</th>
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Branch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {addedStudents.map((s, i) => (
                      <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-muted/20">
                        <td className="px-5 py-3 text-muted-foreground">{i + 1}</td>
                        <td className="px-5 py-3 font-medium text-foreground">{s.name}</td>
                        <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{s.usn}</td>
                        <td className="px-5 py-3"><span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">{s.branch}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </motion.div>
        )}

        {stage === "processing" && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-card border border-border/60 rounded-3xl p-16 text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-16 h-16 rounded-2xl bg-primary/10 mx-auto flex items-center justify-center mb-5">
              <FileSpreadsheet className="w-8 h-8 text-primary" />
            </motion.div>
            <h2 className="font-heading text-xl font-semibold mb-1">Importing {selectedBranch} students</h2>
            <p className="text-muted-foreground text-sm">Processing your Excel file...</p>
            <div className="mt-6 max-w-xs mx-auto h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div className="h-full bg-primary rounded-full" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2.5 }} />
            </div>
          </motion.div>
        )}

        {stage === "done" && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border/60 rounded-3xl p-12 text-center max-w-xl mx-auto">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
              className="w-16 h-16 rounded-full bg-success/10 mx-auto flex items-center justify-center mb-4">
              <CheckCircle className="w-9 h-9 text-success" />
            </motion.div>
            <h2 className="font-heading text-2xl font-semibold mb-1">Import successful</h2>
            <p className="text-muted-foreground text-sm mb-6">15 students imported to <span className="text-foreground font-semibold">{selectedBranch}</span></p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setStage("choose")} variant="outline" className="rounded-xl px-6">Add more</Button>
              <Link to={`${prefix}/admin/dashboard`}>
                <Button className="rounded-xl px-6">View dashboard</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminUpload;

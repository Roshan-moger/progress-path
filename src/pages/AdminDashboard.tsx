import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users, FileSpreadsheet, GraduationCap, TrendingUp, Clock, CheckCircle,
  ChevronRight, ArrowLeft, Search, MoreHorizontal, Sparkles,
} from "lucide-react";
import { useThemeVersion } from "@/lib/theme";
import AdminLayout from "@/components/AdminLayout";

type BranchKey = "CSE" | "ECE" | "EEE" | "ME" | "CE" | "Diploma";

const branchData: Record<BranchKey, { accent: string; full: string; students: { name: string; usn: string; progress: number; status: string; step: string }[] }> = {
  CSE: { accent: "primary", full: "Computer Science", students: [
    { name: "Arjun Kumar", usn: "1SI22CS045", progress: 83, status: "In Progress", step: "Domain Test" },
    { name: "Priya Sharma", usn: "1SI22CS012", progress: 100, status: "Completed", step: "Report Ready" },
    { name: "Vikram Joshi", usn: "1SI22CS067", progress: 100, status: "Completed", step: "Report Ready" },
    { name: "Meera Nair", usn: "1SI22CS023", progress: 45, status: "In Progress", step: "Communication" },
  ]},
  ECE: { accent: "blue", full: "Electronics & Comm.", students: [
    { name: "Rahul Verma", usn: "1SI22EC034", progress: 45, status: "In Progress", step: "Communication" },
    { name: "Kavya Reddy", usn: "1SI22EC018", progress: 60, status: "In Progress", step: "Domain Test" },
  ]},
  EEE: { accent: "amber", full: "Electrical Engineering", students: [
    { name: "Sneha Reddy", usn: "1SI22EE021", progress: 20, status: "In Progress", step: "Resume Upload" },
    { name: "Aditya Rao", usn: "1SI22EE009", progress: 100, status: "Completed", step: "Report Ready" },
  ]},
  ME: { accent: "emerald", full: "Mechanical", students: [
    { name: "Ananya Patel", usn: "1SI22ME011", progress: 60, status: "In Progress", step: "Quants" },
    { name: "Rohit Singh", usn: "1SI22ME044", progress: 30, status: "In Progress", step: "Communication" },
  ]},
  CE: { accent: "rose", full: "Civil Engineering", students: [
    { name: "Deepak Jain", usn: "1SI22CE015", progress: 80, status: "In Progress", step: "Interview" },
  ]},
  Diploma: { accent: "violet", full: "Diploma Program", students: [
    { name: "Kiran Kumar", usn: "1SI22DP003", progress: 50, status: "In Progress", step: "Domain Test" },
    { name: "Swathi M", usn: "1SI22DP017", progress: 100, status: "Completed", step: "Report Ready" },
    { name: "Naveen R", usn: "1SI22DP022", progress: 15, status: "In Progress", step: "Resume Upload" },
  ]},
};

const allBranches = Object.keys(branchData) as BranchKey[];

const accentMap: Record<string, { bg: string; text: string; ring: string; soft: string }> = {
  primary: { bg: "bg-primary", text: "text-primary", ring: "ring-primary/20", soft: "bg-primary/10" },
  blue:    { bg: "bg-blue-500", text: "text-blue-600 dark:text-blue-400", ring: "ring-blue-500/20", soft: "bg-blue-500/10" },
  amber:   { bg: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", ring: "ring-amber-500/20", soft: "bg-amber-500/10" },
  emerald: { bg: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-500/20", soft: "bg-emerald-500/10" },
  rose:    { bg: "bg-rose-500", text: "text-rose-600 dark:text-rose-400", ring: "ring-rose-500/20", soft: "bg-rose-500/10" },
  violet:  { bg: "bg-violet-500", text: "text-violet-600 dark:text-violet-400", ring: "ring-violet-500/20", soft: "bg-violet-500/10" },
};

const AdminDashboard = () => {
  const [selectedBranch, setSelectedBranch] = useState<BranchKey | null>(null);
  const [search, setSearch] = useState("");
  const version = useThemeVersion();
  const prefix = `/${version}`;

  const allStudents = allBranches.flatMap(b => branchData[b].students.map(s => ({ ...s, branch: b })));
  const totalStudents = allStudents.length;
  const completedStudents = allStudents.filter(s => s.status === "Completed").length;
  const inProgressStudents = allStudents.filter(s => s.status === "In Progress").length;
  const completionRate = Math.round((completedStudents / totalStudents) * 100);

  const stats = [
    { label: "Total Students", value: totalStudents, change: "+12%", icon: Users },
    { label: "Completed", value: completedStudents, change: `${completionRate}%`, icon: CheckCircle },
    { label: "In Progress", value: inProgressStudents, change: "Active", icon: Clock },
    { label: "Avg. Score", value: "78%", change: "+4.2%", icon: TrendingUp },
  ];

  const filteredStudents = selectedBranch
    ? branchData[selectedBranch].students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.usn.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Track student assessment progress across all branches"
      actions={
        <Link to={`${prefix}/admin/upload`}>
          <Button className="rounded-xl gap-2 h-10 shadow-sm">
            <FileSpreadsheet className="w-4 h-4" /> Import Students
          </Button>
        </Link>
      }
    >
      {/* Hero KPI strip */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/8 via-card to-card p-6 mb-8">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative flex items-start justify-between flex-wrap gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
              <Sparkles className="w-3 h-3" /> Welcome back, Admin
            </div>
            <h2 className="font-heading text-2xl font-bold tracking-tight">{completedStudents} of {totalStudents} students completed</h2>
            <p className="text-muted-foreground text-sm mt-1">Overall completion rate is at <span className="text-foreground font-semibold">{completionRate}%</span> this cycle</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Cohort progress</p>
              <p className="font-heading text-3xl font-bold text-primary">{completionRate}%</p>
            </div>
            <div className="w-20 h-20 relative">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" fill="none"
                  strokeDasharray={`${completionRate * 2.64} 264`} strokeLinecap="round" className="text-primary" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="group relative bg-card border border-border/60 rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">{s.change}</span>
            </div>
            <p className="font-heading text-3xl font-bold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!selectedBranch ? (
          <motion.div key="branches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -10 }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-heading text-xl font-semibold tracking-tight">Branches</h2>
                <p className="text-sm text-muted-foreground">Select a branch to view detailed student records</p>
              </div>
              <span className="text-xs text-muted-foreground">{allBranches.length} branches</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allBranches.map((branch, i) => {
                const data = branchData[branch];
                const accent = accentMap[data.accent];
                const completed = data.students.filter(s => s.status === "Completed").length;
                const pct = Math.round((completed / data.students.length) * 100);
                return (
                  <motion.button key={branch} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedBranch(branch)}
                    className="group text-left bg-card border border-border/60 rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${accent.soft} blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-5">
                        <div className={`w-12 h-12 rounded-xl ${accent.soft} ring-1 ${accent.ring} flex items-center justify-center`}>
                          <GraduationCap className={`w-6 h-6 ${accent.text}`} />
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <h3 className="font-heading text-lg font-bold tracking-tight">{branch}</h3>
                      <p className="text-xs text-muted-foreground mb-5">{data.full}</p>

                      <div className="flex items-baseline gap-3 mb-3">
                        <span className="font-heading text-2xl font-bold">{data.students.length}</span>
                        <span className="text-xs text-muted-foreground">students</span>
                        <span className={`ml-auto text-xs font-semibold ${accent.text}`}>{pct}%</span>
                      </div>

                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.2 + i * 0.05, duration: 0.6 }}
                          className={`h-full ${accent.bg} rounded-full`} />
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-2">{completed} completed · {data.students.length - completed} active</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div key="table" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center gap-4 mb-6 flex-wrap">
              <Button variant="ghost" onClick={() => { setSelectedBranch(null); setSearch(""); }} className="rounded-xl gap-2 h-9 -ml-2">
                <ArrowLeft className="w-4 h-4" /> All branches
              </Button>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${accentMap[branchData[selectedBranch].accent].soft} flex items-center justify-center`}>
                  <GraduationCap className={`w-5 h-5 ${accentMap[branchData[selectedBranch].accent].text}`} />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-bold tracking-tight">{selectedBranch}</h2>
                  <p className="text-xs text-muted-foreground">{branchData[selectedBranch].full} · {branchData[selectedBranch].students.length} students</p>
                </div>
              </div>
              <div className="ml-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search by name or USN..." value={search} onChange={e => setSearch(e.target.value)}
                  className="pl-9 w-72 rounded-xl h-10 bg-card" />
              </div>
            </div>

            <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30">
                    {["Student", "USN", "Progress", "Current Step", "Status", ""].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s, i) => (
                    <motion.tr key={s.usn} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                            {s.name[0]}
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">{s.name}</p>
                            <p className="text-xs text-muted-foreground">Active now</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground font-mono">{s.usn}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Progress value={s.progress} className="h-1.5 w-24" />
                          <span className="text-xs font-medium text-foreground tabular-nums">{s.progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{s.step}</td>
                      <td className="px-5 py-4">
                        <Badge variant="outline" className={`text-[11px] rounded-full font-medium ${
                          s.status === "Completed"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${s.status === "Completed" ? "bg-success" : "bg-amber-500"}`} />
                          {s.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredStudents.length === 0 && (
                <div className="p-12 text-center text-sm text-muted-foreground">No students match your search.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminDashboard;

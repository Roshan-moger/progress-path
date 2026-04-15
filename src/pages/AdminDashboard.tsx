import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard, Users, Upload, Settings, Search, FileSpreadsheet,
  GraduationCap, TrendingUp, Clock, CheckCircle, ChevronRight, ArrowLeft
} from "lucide-react";
import { useThemeVersion } from "@/lib/theme";

type BranchKey = "CSE" | "ECE" | "EEE" | "ME" | "CE" | "Diploma";

const branchData: Record<BranchKey, { color: string; students: { name: string; usn: string; progress: number; status: string; step: string }[] }> = {
  CSE: {
    color: "from-primary/80 to-primary",
    students: [
      { name: "Arjun Kumar", usn: "1SI22CS045", progress: 83, status: "In Progress", step: "Domain Test" },
      { name: "Priya Sharma", usn: "1SI22CS012", progress: 100, status: "Completed", step: "Report Ready" },
      { name: "Vikram Joshi", usn: "1SI22CS067", progress: 100, status: "Completed", step: "Report Ready" },
      { name: "Meera Nair", usn: "1SI22CS023", progress: 45, status: "In Progress", step: "Communication" },
    ],
  },
  ECE: { color: "from-blue-500 to-blue-600", students: [
    { name: "Rahul Verma", usn: "1SI22EC034", progress: 45, status: "In Progress", step: "Communication" },
    { name: "Kavya Reddy", usn: "1SI22EC018", progress: 60, status: "In Progress", step: "Domain Test" },
  ]},
  EEE: { color: "from-amber-500 to-amber-600", students: [
    { name: "Sneha Reddy", usn: "1SI22EE021", progress: 20, status: "In Progress", step: "Resume Upload" },
    { name: "Aditya Rao", usn: "1SI22EE009", progress: 100, status: "Completed", step: "Report Ready" },
  ]},
  ME: { color: "from-emerald-500 to-emerald-600", students: [
    { name: "Ananya Patel", usn: "1SI22ME011", progress: 60, status: "In Progress", step: "Quants" },
    { name: "Rohit Singh", usn: "1SI22ME044", progress: 30, status: "In Progress", step: "Communication" },
  ]},
  CE: { color: "from-rose-500 to-rose-600", students: [
    { name: "Deepak Jain", usn: "1SI22CE015", progress: 80, status: "In Progress", step: "Interview" },
  ]},
  Diploma: { color: "from-violet-500 to-violet-600", students: [
    { name: "Kiran Kumar", usn: "1SI22DP003", progress: 50, status: "In Progress", step: "Domain Test" },
    { name: "Swathi M", usn: "1SI22DP017", progress: 100, status: "Completed", step: "Report Ready" },
    { name: "Naveen R", usn: "1SI22DP022", progress: 15, status: "In Progress", step: "Resume Upload" },
  ]},
};

const allBranches = Object.keys(branchData) as BranchKey[];

const AdminDashboard = () => {
  const [selectedBranch, setSelectedBranch] = useState<BranchKey | null>(null);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const version = useThemeVersion();
  const prefix = `/${version}`;

  const sideLinks = [
    { to: `${prefix}/admin/dashboard`, icon: LayoutDashboard, label: "Dashboard" },
    { to: `${prefix}/admin/students`, icon: Users, label: "Students" },
    { to: `${prefix}/admin/upload`, icon: Upload, label: "Upload Students" },
    { to: `${prefix}/admin/settings`, icon: Settings, label: "Settings" },
  ];

  const allStudents = allBranches.flatMap(b => branchData[b].students.map(s => ({ ...s, branch: b })));
  const totalStudents = allStudents.length;
  const completedStudents = allStudents.filter(s => s.status === "Completed").length;
  const inProgressStudents = allStudents.filter(s => s.status === "In Progress").length;

  const stats = [
    { label: "Total Students", value: totalStudents, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Completed", value: completedStudents, icon: CheckCircle, color: "bg-success/10 text-success" },
    { label: "In Progress", value: inProgressStudents, icon: Clock, color: "bg-secondary/10 text-secondary" },
    { label: "Avg. Score", value: "78%", icon: TrendingUp, color: "bg-info/10 text-info" },
  ];

  const filteredStudents = selectedBranch
    ? branchData[selectedBranch].students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.usn.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to={prefix} className="font-heading text-xl font-bold text-primary">Vyona.</Link>
          <p className="text-xs text-muted-foreground mt-0.5">Admin Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sideLinks.map(link => {
            const active = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to}>
                <motion.div whileHover={{ x: 4 }} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}>
                  <link.icon className="w-5 h-5" />{link.label}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="font-heading text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage students and track assessments</p>
          </motion.div>
          <Link to={`${prefix}/admin/upload`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2">
              <FileSpreadsheet className="w-4 h-4" /> Upload Excel
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5" /></div>
              </div>
              <p className="font-heading text-3xl font-bold text-foreground">{s.value}</p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!selectedBranch ? (
            <motion.div key="branches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-heading text-xl font-semibold mb-6">Branches</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {allBranches.map((branch, i) => {
                  const data = branchData[branch];
                  const completed = data.students.filter(s => s.status === "Completed").length;
                  return (
                    <motion.button key={branch} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      onClick={() => setSelectedBranch(branch)}
                      className="text-left bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
                      <div className={`h-2 bg-gradient-to-r ${data.color}`} />
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${data.color} flex items-center justify-center`}><GraduationCap className="w-6 h-6 text-white" /></div>
                            <div><h3 className="font-heading text-lg font-bold text-foreground">{branch}</h3><p className="text-xs text-muted-foreground">{branch === "Diploma" ? "Diploma" : `B.Tech ${branch}`}</p></div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">{data.students.length} students</span>
                          <span className="text-primary font-medium">{completed} completed</span>
                        </div>
                        <Progress value={(completed / data.students.length) * 100} className="h-1.5" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div key="table" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" onClick={() => { setSelectedBranch(null); setSearch(""); }} className="rounded-xl gap-2 text-muted-foreground"><ArrowLeft className="w-4 h-4" /> Back</Button>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${branchData[selectedBranch].color} flex items-center justify-center`}><GraduationCap className="w-5 h-5 text-white" /></div>
                  <div><h2 className="font-heading text-xl font-semibold">{selectedBranch}</h2><p className="text-xs text-muted-foreground">{branchData[selectedBranch].students.length} students</p></div>
                </div>
                <div className="ml-auto relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-64 rounded-xl h-10" />
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-border bg-muted/50">
                    {["Student", "USN", "Progress", "Current Step", "Status"].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {filteredStudents.map((s, i) => (
                      <motion.tr key={s.usn} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-4"><div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{s.name[0]}</div>
                          <span className="font-medium text-foreground text-sm">{s.name}</span>
                        </div></td>
                        <td className="px-5 py-4 text-sm text-muted-foreground font-mono">{s.usn}</td>
                        <td className="px-5 py-4"><div className="flex items-center gap-2"><Progress value={s.progress} className="h-1.5 w-20" /><span className="text-xs text-muted-foreground">{s.progress}%</span></div></td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{s.step}</td>
                        <td className="px-5 py-4">
                          <Badge className={`text-xs rounded-full ${s.status === "Completed" ? "bg-success/15 text-success border-success/20" : "bg-secondary/15 text-secondary-foreground border-secondary/20"}`}>{s.status}</Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;

import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard, Users, Upload, Settings, Search, FileSpreadsheet,
  ChevronDown, GraduationCap, TrendingUp, Clock, CheckCircle
} from "lucide-react";

const sideLinks = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/students", icon: Users, label: "Students" },
  { to: "/admin/upload", icon: Upload, label: "Upload Students" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

const branches = ["All", "CSE", "ECE", "EEE", "ME", "CE"];

const mockStudents = [
  { name: "Arjun Kumar", usn: "1SI22CS045", branch: "CSE", progress: 83, status: "In Progress", step: "Domain Test" },
  { name: "Priya Sharma", usn: "1SI22CS012", branch: "CSE", progress: 100, status: "Completed", step: "Report Ready" },
  { name: "Rahul Verma", usn: "1SI22EC034", branch: "ECE", progress: 45, status: "In Progress", step: "Communication" },
  { name: "Sneha Reddy", usn: "1SI22EE021", branch: "EEE", progress: 20, status: "In Progress", step: "Resume Upload" },
  { name: "Vikram Joshi", usn: "1SI22CS067", branch: "CSE", progress: 100, status: "Completed", step: "Report Ready" },
  { name: "Ananya Patel", usn: "1SI22ME011", branch: "ME", progress: 60, status: "In Progress", step: "Quants" },
];

const AdminDashboard = () => {
  const [activeBranch, setActiveBranch] = useState("All");
  const [search, setSearch] = useState("");
  const location = useLocation();

  const filtered = mockStudents.filter(
    (s) => (activeBranch === "All" || s.branch === activeBranch) &&
           (s.name.toLowerCase().includes(search.toLowerCase()) || s.usn.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = [
    { label: "Total Students", value: mockStudents.length, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Completed", value: mockStudents.filter((s) => s.status === "Completed").length, icon: CheckCircle, color: "bg-success/10 text-success" },
    { label: "In Progress", value: mockStudents.filter((s) => s.status === "In Progress").length, icon: Clock, color: "bg-secondary/10 text-secondary" },
    { label: "Avg. Score", value: "78%", icon: TrendingUp, color: "bg-info/10 text-info" },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
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
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="font-heading text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage students and track assessments</p>
          </motion.div>
          <Link to="/admin/upload">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl gap-2">
              <FileSpreadsheet className="w-4 h-4" /> Upload Excel
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="font-heading text-3xl font-bold text-foreground">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {branches.map((b) => (
            <Button
              key={b}
              onClick={() => setActiveBranch(b)}
              variant={activeBranch === b ? "default" : "outline"}
              size="sm"
              className={`rounded-full ${activeBranch === b ? "bg-primary text-primary-foreground" : "border-border text-foreground"}`}
            >
              {b}
            </Button>
          ))}
          <div className="ml-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-64 rounded-xl h-10"
            />
          </div>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card border border-border rounded-2xl overflow-hidden"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {["Student", "USN", "Branch", "Progress", "Current Step", "Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <motion.tr
                  key={s.usn}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {s.name[0]}
                      </div>
                      <span className="font-medium text-foreground text-sm">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground font-mono">{s.usn}</td>
                  <td className="px-5 py-4">
                    <Badge variant="outline" className="text-xs rounded-full">{s.branch}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Progress value={s.progress} className="h-1.5 w-20" />
                      <span className="text-xs text-muted-foreground">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{s.step}</td>
                  <td className="px-5 py-4">
                    <Badge className={`text-xs rounded-full ${
                      s.status === "Completed" ? "bg-success/15 text-success border-success/20" : "bg-secondary/15 text-secondary-foreground border-secondary/20"
                    }`}>{s.status}</Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;

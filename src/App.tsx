import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudentLogin from "./pages/StudentLogin";
import AdminLogin from "./pages/AdminLogin";
import StudentDashboard from "./pages/StudentDashboard";
import StudentResume from "./pages/StudentResume";
import StudentTest from "./pages/StudentTest";
import StudentInterview from "./pages/StudentInterview";
import StudentReport from "./pages/StudentReport";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUpload from "./pages/AdminUpload";
import InterviewRoom from "./pages/InterviewRoom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider>
          <Routes>
            <Route index element={<Index />} />
            <Route path="student-login" element={<StudentLogin />} />
            <Route path="admin-login" element={<AdminLogin />} />
            <Route path="student/dashboard" element={<StudentDashboard />} />
            <Route path="student/resume" element={<StudentResume />} />
            <Route path="student/test" element={<StudentTest />} />
            <Route path="student/interview" element={<StudentInterview />} />
            <Route path="student/interview-room" element={<InterviewRoom />} />
            <Route path="student/report" element={<StudentReport />} />
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/upload" element={<AdminUpload />} />
            <Route path="admin/students" element={<AdminDashboard />} />
            <Route path="admin/settings" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

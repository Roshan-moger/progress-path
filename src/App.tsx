import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import StudentLogin from "./pages/StudentLogin.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import StudentDashboard from "./pages/StudentDashboard.tsx";
import StudentResume from "./pages/StudentResume.tsx";
import StudentTest from "./pages/StudentTest.tsx";
import StudentInterview from "./pages/StudentInterview.tsx";
import StudentReport from "./pages/StudentReport.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminUpload from "./pages/AdminUpload.tsx";
import InterviewRoom from "./pages/InterviewRoom.tsx";
import InterviewRoomV2 from "./pages/InterviewRoomV2.tsx";
import InterviewRoomV3 from "./pages/InterviewRoomV3.tsx";
import StudentInterviewSelect from "./pages/StudentInterviewSelect.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/resume" element={<StudentResume />} />
          <Route path="/student/test" element={<StudentTest />} />
          <Route path="/student/interview" element={<StudentInterviewSelect />} />
          <Route path="/student/interview-room" element={<InterviewRoom />} />
          <Route path="/student/interview-room-v2" element={<InterviewRoomV2 />} />
          <Route path="/student/interview-room-v3" element={<InterviewRoomV3 />} />
          <Route path="/student/report" element={<StudentReport />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/upload" element={<AdminUpload />} />
          <Route path="/admin/students" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

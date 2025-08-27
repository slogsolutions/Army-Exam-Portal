import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import CandidateRegistration from "./pages/CandidateRegistration";
import ExamManagement from "./pages/ExamManagement";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import AdminHome from "./pages/AdminHome";
import EvaluatorHome from "./pages/EvaluatorHome";
import CandidateHome from "./pages/CandidateHome";
import AdminPortal from "./pages/AdminPortal";
import EvaluatorPortal from "./pages/EvaluatorPortal";
import CandidatePortal from "./pages/CandidatePortal";
import AdminUsers from "./pages/admin/Users";
import AdminRoles from "./pages/admin/Roles";
import AdminAudit from "./pages/admin/Audit";
import AdminExamsCreate from "./pages/admin/ExamsCreate";
import AdminExamsManage from "./pages/admin/ExamsManage";
import AdminExamsConduct from "./pages/admin/ExamsConduct";
import AdminQBankAdd from "./pages/admin/QBankAdd";
import AdminQBankCategories from "./pages/admin/QBankCategories";
import AdminQBankImport from "./pages/admin/QBankImport";
import AdminEvaluatePapers from "./pages/admin/EvaluatePapers";
import AdminResults from "./pages/admin/Results";
import AdminReports from "./pages/admin/Reports";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthed = Boolean(localStorage.getItem("accessToken"));
  return isAuthed ? children : <Navigate to="/login" replace />;
};

const RoleRoute = ({ children, roles }: { children: JSX.Element; roles: string[] }) => {
  const isAuthed = Boolean(localStorage.getItem("accessToken"));
  const userType = localStorage.getItem("userType") || "";
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (roles.length && !roles.includes(userType)) {
    const target = userType ? `/portal/${userType}` : '/dashboard';
    return <Navigate to={target} replace />;
  }
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/portal" element={<ProtectedRoute>{(() => {
            const t = localStorage.getItem('userType') || '';
            const dest = t ? `/portal/${t}` : '/dashboard';
            return <Navigate to={dest} replace />;
          })()}</ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminHome /></ProtectedRoute>} />
          <Route path="/evaluator" element={<ProtectedRoute><EvaluatorHome /></ProtectedRoute>} />
          <Route path="/candidate" element={<ProtectedRoute><CandidateHome /></ProtectedRoute>} />
          <Route path="/portal/admin" element={<RoleRoute roles={["admin"]}><AdminPortal /></RoleRoute>} />
          <Route path="/portal/evaluator" element={<RoleRoute roles={["evaluator"]}><EvaluatorPortal /></RoleRoute>} />
          <Route path="/portal/candidate" element={<RoleRoute roles={["candidate"]}><CandidatePortal /></RoleRoute>} />
          {/* Admin feature routes */}
          <Route path="/admin/users" element={<RoleRoute roles={["admin"]}><AdminUsers /></RoleRoute>} />
          <Route path="/admin/roles" element={<RoleRoute roles={["admin"]}><AdminRoles /></RoleRoute>} />
          <Route path="/admin/audit" element={<RoleRoute roles={["admin"]}><AdminAudit /></RoleRoute>} />
          <Route path="/exams/create" element={<RoleRoute roles={["admin"]}><AdminExamsCreate /></RoleRoute>} />
          <Route path="/exams" element={<RoleRoute roles={["admin"]}><AdminExamsManage /></RoleRoute>} />
          <Route path="/exams/conduct" element={<RoleRoute roles={["admin"]}><AdminExamsConduct /></RoleRoute>} />
          <Route path="/qbank/add" element={<RoleRoute roles={["admin"]}><AdminQBankAdd /></RoleRoute>} />
          <Route path="/qbank/categories" element={<RoleRoute roles={["admin"]}><AdminQBankCategories /></RoleRoute>} />
          <Route path="/qbank/import" element={<RoleRoute roles={["admin"]}><AdminQBankImport /></RoleRoute>} />
          <Route path="/evaluation/papers" element={<RoleRoute roles={["admin"]}><AdminEvaluatePapers /></RoleRoute>} />
          <Route path="/evaluation/results" element={<RoleRoute roles={["admin"]}><AdminResults /></RoleRoute>} />
          <Route path="/evaluation/reports" element={<RoleRoute roles={["admin"]}><AdminReports /></RoleRoute>} />
          <Route path="/candidates/register" element={<ProtectedRoute><CandidateRegistration /></ProtectedRoute>} />
          <Route path="/exams" element={<ProtectedRoute><ExamManagement /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

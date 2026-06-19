import { Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardPage } from "@/pages/DashboardPage";
import { UsersPage } from "@/pages/UsersPage";
import { UserFormPage } from "@/pages/UserFormPage";
import { DepartmentsPage } from "@/pages/DepartmentsPage";
import { DepartmentFormPage } from "@/pages/DepartmentFormPage";
import { VisitorsPage } from "@/pages/VisitorsPage";
import { VisitorFormPage } from "@/pages/VisitorFormPage";
import { VisitorSchedulePage } from "@/pages/VisitorSchedulePage";
import { VisitorDetailPage } from "@/pages/VisitorDetailPage";
import { LoginPage } from "@/pages/LoginPage";
import { LandingPage } from "@/pages/LandingPage";
import { DesignSystemPage } from "@/pages/DesignSystemPage";
import { ReportsIndexPage } from "@/pages/ReportsIndexPage";
import { ReportVisitorsPage } from "@/pages/ReportVisitorsPage";
import { ReportDepartmentsPage } from "@/pages/ReportDepartmentsPage";
import { ReportUsersPage } from "@/pages/ReportUsersPage";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { LogsPage } from "@/pages/LogsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { PerfilCMPListPage } from "@/pages/performance/PerfilCMPListPage";
import { PerfilCMPFormPage } from "@/pages/performance/PerfilCMPFormPage";
import { PerfilCMPDetailPage } from "@/pages/performance/PerfilCMPDetailPage";
import { CyclesListPage } from "@/pages/performance/CyclesListPage";
import { CycleDetailPage } from "@/pages/performance/CycleDetailPage";
import { CycleFormPage } from "@/pages/performance/CycleFormPage";
import { EvaluationFormPage } from "@/pages/performance/EvaluationFormPage";
import { MetaFormPage } from "@/pages/performance/MetaFormPage";
import { PDIFormPage } from "@/pages/performance/PDIFormPage";
import { FeedbackFormPage } from "@/pages/performance/FeedbackFormPage";
import { ImportProfilesPage } from "@/pages/performance/ImportProfilesPage";
import { PerformanceRHPage } from "@/pages/performance/PerformanceRHPage";
import { PerformanceGestorPage } from "@/pages/performance/PerformanceGestorPage";
import { PerformanceColaboradorPage } from "@/pages/performance/PerformanceColaboradorPage";
import { CursosPage } from "@/pages/performance/CursosPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/design-system" element={<DesignSystemPage />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<ProtectedRoute roles={["admin", "gestor"]}><UsersPage /></ProtectedRoute>} />
        <Route path="/users/new" element={<ProtectedRoute roles={["admin", "gestor"]}><UserFormPage /></ProtectedRoute>} />
        <Route path="/users/:id/edit" element={<ProtectedRoute roles={["admin", "gestor"]}><UserFormPage /></ProtectedRoute>} />
        <Route path="/departments" element={<ProtectedRoute roles={["admin", "gestor", "operator"]}><DepartmentsPage /></ProtectedRoute>} />
        <Route path="/departments/new" element={<ProtectedRoute roles={["admin", "operator"]}><DepartmentFormPage /></ProtectedRoute>} />
        <Route path="/departments/:id/edit" element={<ProtectedRoute roles={["admin", "operator"]}><DepartmentFormPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute roles={["admin", "gestor", "assessor"]}><ReportsIndexPage /></ProtectedRoute>} />
        <Route path="/reports/visitors" element={<ProtectedRoute roles={["admin", "gestor", "assessor"]}><ReportVisitorsPage /></ProtectedRoute>} />
        <Route path="/reports/departments" element={<ProtectedRoute roles={["admin", "gestor", "assessor"]}><ReportDepartmentsPage /></ProtectedRoute>} />
        <Route path="/reports/users" element={<ProtectedRoute roles={["admin", "gestor"]}><ReportUsersPage /></ProtectedRoute>} />
        <Route path="/visitors" element={<ProtectedRoute roles={["admin", "gestor", "assessor", "operator"]}><VisitorsPage /></ProtectedRoute>} />
        <Route path="/visitors/new" element={<ProtectedRoute roles={["admin", "gestor", "assessor", "operator"]}><VisitorFormPage /></ProtectedRoute>} />
        <Route path="/visitors/schedule" element={<ProtectedRoute roles={["admin", "gestor", "assessor", "operator"]}><VisitorSchedulePage /></ProtectedRoute>} />
        <Route path="/visitors/:id" element={<ProtectedRoute roles={["admin", "gestor", "assessor", "operator"]}><VisitorDetailPage /></ProtectedRoute>} />
        <Route path="/visitors/:id/edit" element={<ProtectedRoute roles={["admin", "gestor"]}><VisitorFormPage /></ProtectedRoute>} />
        <Route path="/performance/profiles" element={<ProtectedRoute roles={["admin", "gestor", "assessor"]}><PerfilCMPListPage /></ProtectedRoute>} />
        <Route path="/performance/profiles/import" element={<ProtectedRoute roles={["admin", "gestor"]}><ImportProfilesPage /></ProtectedRoute>} />
        <Route path="/performance/profiles/new" element={<ProtectedRoute roles={["admin", "gestor"]}><PerfilCMPFormPage /></ProtectedRoute>} />
        <Route path="/performance/profiles/:id" element={<ProtectedRoute roles={["admin", "gestor", "assessor", "operator"]}><PerfilCMPDetailPage /></ProtectedRoute>} />
        <Route path="/performance/profiles/:id/edit" element={<ProtectedRoute roles={["admin", "gestor"]}><PerfilCMPFormPage /></ProtectedRoute>} />
        <Route path="/performance/cycles" element={<ProtectedRoute roles={["admin", "gestor"]}><CyclesListPage /></ProtectedRoute>} />
        <Route path="/performance/cycles/:id" element={<ProtectedRoute roles={["admin", "gestor"]}><CycleDetailPage /></ProtectedRoute>} />
        <Route path="/performance/cycles/new" element={<ProtectedRoute roles={["admin"]}><CycleFormPage /></ProtectedRoute>} />
        <Route path="/performance/cycles/:id/edit" element={<ProtectedRoute roles={["admin"]}><CycleFormPage /></ProtectedRoute>} />
        <Route path="/performance/evaluations/new/:colaboradorId" element={<ProtectedRoute roles={["admin", "gestor"]}><EvaluationFormPage /></ProtectedRoute>} />
        <Route path="/performance/metas/new/:colaboradorId" element={<ProtectedRoute roles={["admin", "gestor"]}><MetaFormPage /></ProtectedRoute>} />
        <Route path="/performance/metas/:id/edit" element={<ProtectedRoute roles={["admin", "gestor"]}><MetaFormPage /></ProtectedRoute>} />
        <Route path="/performance/pdi/new/:colaboradorId" element={<ProtectedRoute roles={["admin", "gestor"]}><PDIFormPage /></ProtectedRoute>} />
        <Route path="/performance/pdi/:id/edit" element={<ProtectedRoute roles={["admin", "gestor"]}><PDIFormPage /></ProtectedRoute>} />
        <Route path="/performance/feedbacks/new/:colaboradorId" element={<ProtectedRoute roles={["admin", "gestor", "assessor", "operator"]}><FeedbackFormPage /></ProtectedRoute>} />
        <Route path="/performance/dashboard" element={<ProtectedRoute roles={["admin"]}><PerformanceRHPage /></ProtectedRoute>} />
        <Route path="/performance/team-dashboard" element={<ProtectedRoute roles={["gestor"]}><PerformanceGestorPage /></ProtectedRoute>} />
        <Route path="/performance/my-dashboard" element={<ProtectedRoute roles={["admin", "gestor", "assessor", "operator"]}><PerformanceColaboradorPage /></ProtectedRoute>} />
        <Route path="/performance/cursos" element={<ProtectedRoute roles={["admin", "gestor", "assessor"]}><CursosPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute roles={["admin", "gestor", "assessor", "operator"]}><NotificationsPage /></ProtectedRoute>} />
        <Route path="/logs" element={<ProtectedRoute roles={["admin", "gestor"]}><LogsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute roles={["admin"]}><SettingsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute roles={["admin", "gestor", "assessor", "operator"]}><ProfilePage /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

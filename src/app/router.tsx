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
        <Route path="/departments" element={<ProtectedRoute roles={["admin"]}><DepartmentsPage /></ProtectedRoute>} />
        <Route path="/departments/new" element={<ProtectedRoute roles={["admin"]}><DepartmentFormPage /></ProtectedRoute>} />
        <Route path="/departments/:id/edit" element={<ProtectedRoute roles={["admin"]}><DepartmentFormPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute roles={["admin", "gestor", "assessor"]}><ReportsIndexPage /></ProtectedRoute>} />
        <Route path="/reports/visitors" element={<ProtectedRoute roles={["admin", "gestor", "assessor"]}><ReportVisitorsPage /></ProtectedRoute>} />
        <Route path="/reports/departments" element={<ProtectedRoute roles={["admin", "gestor", "assessor"]}><ReportDepartmentsPage /></ProtectedRoute>} />
        <Route path="/reports/users" element={<ProtectedRoute roles={["admin", "gestor"]}><ReportUsersPage /></ProtectedRoute>} />
        <Route path="/visitors" element={<VisitorsPage />} />
        <Route path="/visitors/new" element={<VisitorFormPage />} />
        <Route path="/visitors/schedule" element={<VisitorSchedulePage />} />
        <Route path="/visitors/:id" element={<VisitorDetailPage />} />
        <Route path="/visitors/:id/edit" element={<VisitorFormPage />} />
      </Route>
    </Routes>
  );
}

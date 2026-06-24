import { Routes, Route, Navigate } from "react-router-dom";

import Homepage from "../pages/Homepage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import AccountPage from "../pages/auth/AccountPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CmDashboard from "../pages/cm/CmDashboard";
import StudentDashboard from "../pages/student/StudentDashboard";
import MajorCatalog from "../pages/guest/Majorcatalog";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/settings/account" element={<AccountPage />} />
      <Route path="/settings" element={<Navigate to="/settings/account" replace />} />
      <Route path="/major-catalog" element={<MajorCatalog />} />

      {/* Role-based Protected Dashboards */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cm/dashboard" 
        element={
          <ProtectedRoute allowedRoles={["ROLE_CONTENT_MANAGER"]}>
            <CmDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/dashboard" 
        element={
          <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default AppRoutes;
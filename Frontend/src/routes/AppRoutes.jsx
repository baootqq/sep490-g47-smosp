import { Routes, Route, Navigate } from "react-router-dom";

import Homepage from "../pages/Homepage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import AccountPage from "../pages/auth/AccountPage";
import ChangePasswordPage from "../pages/auth/ChangePasswordPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CmDashboard from "../pages/cm/CmDashboard";
import HollandQuestionPage from "../pages/cm/HollandQuestionPage";
import HollandScoringWeightPage from "../pages/cm/HollandScoringWeightPage";
import CmCatalogPage from "../pages/cm/CmCatalogPage";
import CmCoursePage from "../pages/cm/CmCoursePage";
import CmCurriculumPage from "../pages/cm/CmCurriculumPage";
import StudentDashboard from "../pages/student/StudentDashboard";
import HollandResultPage from "../pages/student/HollandResultPage";
import HollandTestPage from "../pages/student/HollandTestPage";
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
      <Route path="/settings/password" element={<ChangePasswordPage />} />
      <Route path="/settings" element={<Navigate to="/settings/account" replace />} />
      <Route path="/major-catalog" element={<MajorCatalog />} />
      <Route path="/catalog" element={<MajorCatalog />} />


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
        path="/cm/questions"
        element={
          <ProtectedRoute allowedRoles={["ROLE_CONTENT_MANAGER"]}>
            <HollandQuestionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cm/holland-config"
        element={
          <ProtectedRoute allowedRoles={["ROLE_CONTENT_MANAGER"]}>
            <HollandScoringWeightPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cm/catalog"
        element={
          <ProtectedRoute allowedRoles={["ROLE_CONTENT_MANAGER"]}>
            <CmCatalogPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cm/courses"
        element={
          <ProtectedRoute allowedRoles={["ROLE_CONTENT_MANAGER"]}>
            <CmCoursePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cm/curriculum"
        element={
          <ProtectedRoute allowedRoles={["ROLE_CONTENT_MANAGER"]}>
            <CmCurriculumPage />
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
      <Route
        path="/student/holland"
        element={
          <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
            <HollandResultPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/holland/test"
        element={
          <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
            <HollandTestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/hollandtest"
        element={
          <ProtectedRoute allowedRoles={["ROLE_STUDENT"]}>
            <HollandTestPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
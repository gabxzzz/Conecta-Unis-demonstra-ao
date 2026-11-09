import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/public/Landing';
import { Demo } from './pages/public/Demo';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';
import { ForgotPassword } from './pages/public/ForgotPassword';
import { ResetPassword } from './pages/public/ResetPassword';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentOpportunities } from './pages/student/StudentOpportunities';
import { StudentOpportunityDetail } from './pages/student/StudentOpportunityDetail';
import { StudentApplications } from './pages/student/StudentApplications';
import { StudentApplicationDetail } from './pages/student/StudentApplicationDetail';
import { StudentNotifications } from './pages/student/StudentNotifications';
import { StudentProfile } from './pages/student/StudentProfile';
import { CompanyDashboard } from './pages/company/CompanyDashboard';
import { CompanyOpportunities } from './pages/company/CompanyOpportunities';
import { CompanyCandidates } from './pages/company/CompanyCandidates';
import { CompanyProfile } from './pages/company/CompanyProfile';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminCompanies } from './pages/admin/AdminCompanies';
import { AdminOpportunities } from './pages/admin/AdminOpportunities';
import { AdminApplications } from './pages/admin/AdminApplications';
import { AdminModeration } from './pages/admin/AdminModeration';

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/demonstracao" element={<Demo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/recuperar-senha" element={<ForgotPassword />} />
        <Route path="/redefinir-senha" element={<ResetPassword />} />

        <Route
          element={
            <ProtectedRoute roles={['student']}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/app" element={<StudentDashboard />} />
          <Route path="/app/oportunidades" element={<StudentOpportunities />} />
          <Route path="/app/oportunidades/:id" element={<StudentOpportunityDetail />} />
          <Route path="/app/candidaturas" element={<StudentApplications />} />
          <Route path="/app/candidaturas/:id" element={<StudentApplicationDetail />} />
          <Route path="/app/notificacoes" element={<StudentNotifications />} />
          <Route path="/app/perfil" element={<StudentProfile />} />
        </Route>

        <Route
          element={
            <ProtectedRoute roles={['company']}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/empresa" element={<CompanyDashboard />} />
          <Route path="/empresa/oportunidades" element={<CompanyOpportunities />} />
          <Route path="/empresa/candidatos" element={<CompanyCandidates />} />
          <Route path="/empresa/perfil" element={<CompanyProfile />} />
        </Route>

        <Route
          element={
            <ProtectedRoute roles={['admin']}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/usuarios" element={<AdminUsers />} />
          <Route path="/admin/empresas" element={<AdminCompanies />} />
          <Route path="/admin/oportunidades" element={<AdminOpportunities />} />
          <Route path="/admin/candidaturas" element={<AdminApplications />} />
          <Route path="/admin/moderacao" element={<AdminModeration />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

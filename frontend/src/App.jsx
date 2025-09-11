import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Common/Navbar';
import Sidebar from './components/Common/Sidebar';
import SidebarToggle from './components/Common/SidebarToggle';
import Loader from './components/Common/Loader';

// Add this import at the top
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// User Pages
import UserRegister from './pages/User/Register';
import UserLogin from './pages/User/Login';
import UserSkills from './pages/User/Skills';
import UserJobs from './pages/User/Jobs';
import JobDetails from './pages/User/JobDetails';
import UserApplications from './pages/User/Applications';
import UserCertificates from './pages/User/Certificates';
import UserDashboardPage from './pages/User/Dashboard';
import SkillFormPage from './pages/User/SkillFormPage';
import SkillEditPage from './pages/User/SkillEditPage';
import JobApplyPage from './pages/User/JobApplyPage';

// Employer Pages
import EmployerRegister from './pages/Employer/Register';
import EmployerLogin from './pages/Employer/Login';
import EmployerJobs from './pages/Employer/Jobs';
import JobPost from './pages/Employer/JobPost';
import JobEdit from './pages/Employer/JobEdit';
import JobApplicationsPage from './pages/Employer/JobApplicationsPage';
import ApplicationStatusUpdate from './pages/Employer/ApplicationStatusUpdate';
import CertificateIssue from './pages/Employer/CertificateIssue';
import EmployerDashboardPage from './pages/Employer/Dashboard';

// Certificate Verification
import CertificateVerify from './pages/Certificates/Verify';
import EmployerJobApplicationsPage from './pages/Employer/EmployerJobApplicationsPage';
const ProtectedRoute = ({ children, requireEmployer = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (requireEmployer && user.role !== 'employer') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">This page is for employers only.</p>
        </div>
      </div>
    );
  }
  return children;
};

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onMenuToggle={toggleSidebar} />
      <div className="flex flex-1">
        {/* Only show sidebar if user is authenticated */}
        {user && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={toggleSidebar}
            user={user}
          />
        )}
        <main className={`${user ? 'main-content' : 'full-width-content'} p-4 md:p-6`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<UserRegister />} />
            <Route path="/employer/login" element={<EmployerLogin />} />
            <Route path="/employer/register" element={<EmployerRegister />} />
            <Route path="/certificates/verify/:certificateId" element={<CertificateVerify />} />

            {/* User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <UserDashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/skills" element={
              <ProtectedRoute>
                <UserSkills />
              </ProtectedRoute>
            } />
            <Route path="/skills/new" element={
              <ProtectedRoute>
                <SkillFormPage />
              </ProtectedRoute>
            } />
            <Route path="/skills/:id/edit" element={
              <ProtectedRoute>
                <SkillEditPage />
              </ProtectedRoute>
            } />
            <Route path="/jobs" element={
              <ProtectedRoute>
                <UserJobs />
              </ProtectedRoute>
            } />
            <Route path="/jobs/:id" element={
              <ProtectedRoute>
                <JobDetails />
              </ProtectedRoute>
            } />
            <Route path="/jobs/:id/apply" element={
              <ProtectedRoute>
                <JobApplyPage />
              </ProtectedRoute>
            } />
            <Route path="/applications" element={
              <ProtectedRoute>
                <UserApplications />
              </ProtectedRoute>
            } />
            <Route path="/certificates" element={
              <ProtectedRoute>
                <UserCertificates />
              </ProtectedRoute>
            } />

            {/* Employer Routes */}
            <Route path="/employer/dashboard" element={
              <ProtectedRoute requireEmployer>
                <EmployerDashboardPage />
              </ProtectedRoute>
            } />

            <Route path="/employer/jobs" element={
              <ProtectedRoute requireEmployer>
                <EmployerJobs />
              </ProtectedRoute>
            } />
            <Route path="/employer/jobs/new" element={
              <ProtectedRoute requireEmployer>
                <JobPost />
              </ProtectedRoute>
            } />
            <Route path="/employer/jobs/:id/edit" element={
              <ProtectedRoute requireEmployer>
                <JobEdit />
              </ProtectedRoute>
            } />
            <Route path="/employer/applications" element={
              <ProtectedRoute requireEmployer>
                <EmployerJobApplicationsPage />
              </ProtectedRoute>
            } />


            <Route path="/employer/jobs/:jobId/applications" element={
              <ProtectedRoute requireEmployer>
                <JobApplicationsPage />
              </ProtectedRoute>
            } />

            <Route path="/employer/applications/:id/update" element={
              <ProtectedRoute requireEmployer>
                <ApplicationStatusUpdate />
              </ProtectedRoute>
            } />
            <Route path="/employer/certificates/issue" element={
              <ProtectedRoute requireEmployer>
                <CertificateIssue />
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>

      {/* Floating action button for mobile */}
      {user && (
        <SidebarToggle
          onClick={toggleSidebar}
          isOpen={sidebarOpen}
        />
      )}

    </div>
  );
};


// Update the App component
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <AppLayout />
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
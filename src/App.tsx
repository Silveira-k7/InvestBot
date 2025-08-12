import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { AIProvider } from './contexts/AIContext';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AuthPage } from './pages/AuthPage';

// Client Pages
import { DashboardPage } from './pages/client/DashboardPage';
import { TransactionsPage } from './pages/client/TransactionsPage';
import { AIInsightsPage } from './pages/client/AIInsightsPage';
import { GoalsPage } from './pages/client/GoalsPage';
import { ReportsPage } from './pages/client/ReportsPage';
import { StatementsPage } from './pages/client/StatementsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminWhatsApp } from './pages/admin/AdminWhatsApp';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminSettings } from './pages/admin/AdminSettings';

// Layouts
import { ClientLayout } from './components/layouts/ClientLayout';
import { AdminLayout } from './components/layouts/AdminLayout';

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        {/* Client Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DataProvider>
                <AIProvider>
                  <ClientLayout>
                    <DashboardPage />
                  </ClientLayout>
                </AIProvider>
              </DataProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <DataProvider>
                <ClientLayout>
                  <TransactionsPage />
                </ClientLayout>
              </DataProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-insights"
          element={
            <ProtectedRoute>
              <DataProvider>
                <AIProvider>
                  <ClientLayout>
                    <AIInsightsPage />
                  </ClientLayout>
                </AIProvider>
              </DataProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <DataProvider>
                <ClientLayout>
                  <GoalsPage />
                </ClientLayout>
              </DataProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <DataProvider>
                <ClientLayout>
                  <ReportsPage />
                </ClientLayout>
              </DataProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/statements"
          element={
            <ProtectedRoute>
              <DataProvider>
                <ClientLayout>
                  <StatementsPage />
                </ClientLayout>
              </DataProvider>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/whatsapp"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <AdminWhatsApp />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <AdminAnalytics />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
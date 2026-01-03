import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppShell } from './components/Layout/AppShell';
import Login from './pages/Login';

// Placeholder Pages for now
import Dashboard from './pages/Dashboard';
import ClientList from './pages/ClientList';
import ClientDetail from './pages/ClientDetail';
import TaskManage from './pages/TaskManage';
import HearingWizard from './pages/HearingWizard';
import HearingComplete from './pages/HearingComplete';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Or a nice spinner
  if (!user) return <Navigate to="/login" replace />;

  return <AppShell><Outlet /></AppShell>; // AppShell wraps the protected content
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/tasks" element={<TaskManage />} />
            <Route path="/clients/:clientId/hearing" element={<HearingWizard />} />
            <Route path="/clients/:clientId/hearing/complete" element={<HearingComplete />} />
            <Route path="/settings" element={<div className="p-4"><h1>Settings</h1></div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

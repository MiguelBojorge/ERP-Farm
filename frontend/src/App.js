import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import FarmScene from './components/FarmScene';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Cerdos from './pages/Cerdos';
import Vacas from './pages/Vacas';
import Inventario from './pages/Inventario';
import Ventas from './pages/Ventas';
import Finanzas from './pages/Finanzas';
import Gastos from './pages/Gastos';
import Reportes from './pages/Reportes';
import Usuarios from './pages/Usuarios';

// El rol CLIENTE existe en el sistema pero no tiene pantallas en el ERP.
function SinAcceso() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 border-2 border-[#e2e2d5] shadow-sm text-center space-y-4 max-w-md">
        <h1 className="text-2xl font-black text-[#5d3a1a]">Sin acceso al panel</h1>
        <p className="text-slate-600 font-semibold">
          La cuenta «{user.username}» (rol {user.rol}) no tiene permisos para usar el panel de la granja.
          Pida a un administrador que revise su rol.
        </p>
        <button
          onClick={logout}
          className="px-6 py-3 bg-[#5d3a1a] hover:bg-[#3d240e] text-[#f4b41b] font-black rounded-2xl"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

function PanelLayout() {
  const { user } = useAuth();
  if (user.rol === 'CLIENTE') return <SinAcceso />;

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<FarmScene><Dashboard /></FarmScene>} />
          <Route path="/cerdos" element={<FarmScene><Cerdos /></FarmScene>} />
          <Route path="/vacas" element={<FarmScene><Vacas /></FarmScene>} />
          <Route path="/inventario" element={<FarmScene><Inventario /></FarmScene>} />
          <Route path="/gastos" element={<FarmScene><Gastos /></FarmScene>} />
          <Route path="/ventas" element={<FarmScene><Ventas /></FarmScene>} />
          <Route path="/finanzas" element={<FarmScene><Finanzas /></FarmScene>} />
          <Route path="/reportes" element={<FarmScene><Reportes /></FarmScene>} />
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <FarmScene><Usuarios /></FarmScene>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { cargando } = useAuth();
  if (cargando) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-[#5d3a1a]">Cargando…</div>;
  }
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <PanelLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

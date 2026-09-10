import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import FarmScene from './components/FarmScene';
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

function App() {
  return (
    <Router>
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
            <Route path="/usuarios" element={<FarmScene><Usuarios /></FarmScene>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

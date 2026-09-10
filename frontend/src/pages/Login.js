import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import backgroundNight from '../assets/noche_granja.jpg';
import '../components/FarmScene.css';

function mensajeDeError(err) {
  if (!err.response) return 'No se pudo conectar con el servidor.';
  if (err.response.status === 429) return err.response.data?.detail || 'Demasiados intentos. Espere unos minutos.';
  if (err.response.status === 401) return 'Usuario o contraseña incorrectos.';
  return err.response.data?.detail || 'No se pudo iniciar sesión.';
}

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const destino = location.state?.from?.pathname || '/dashboard';
  if (user) return <Navigate to={destino} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password) {
      setError('Ingrese su usuario y contraseña.');
      return;
    }
    setEnviando(true);
    try {
      await login(username.trim(), password);
      navigate(destino, { replace: true });
    } catch (err) {
      setError(mensajeDeError(err));
      setPassword('');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="landing-full">
      <img src={backgroundNight} alt="" className="farm-background-img" />

      <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white/95 rounded-3xl p-8 border-4 border-[#5d3a1a] shadow-2xl space-y-5"
          noValidate
        >
          <div className="text-center">
            <span className="text-5xl">🏠</span>
            <h1 className="text-3xl font-black text-[#5d3a1a] mt-2">Finca La Primavera</h1>
            <p className="text-slate-500 font-bold text-sm mt-1">Inicie sesión para continuar</p>
          </div>

          {error && (
            <div role="alert" className="p-3 rounded-2xl font-bold text-sm bg-rose-100 text-rose-800 border-2 border-rose-300">
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username" className="text-xs font-bold text-slate-500 uppercase">Usuario</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              autoFocus
              maxLength={150}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input font-bold"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase">Contraseña</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full py-4 bg-[#5d3a1a] hover:bg-[#3d240e] disabled:opacity-60 text-[#f4b41b] font-black rounded-2xl text-lg shadow-lg transition-all"
          >
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </motion.form>
      </div>
    </div>
  );
}

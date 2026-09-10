import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rol, setRol] = useState('EMPLEADO');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await api.get('/usuarios/');
      setUsuarios(res.data || []);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setMensaje(null);

    if (!username || !password) {
      setMensaje({ type: 'error', text: 'Por favor ingrese usuario y contraseña.' });
      return;
    }

    try {
      await api.post('/usuarios/', {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        rol,
        telefono
      });

      setMensaje({ type: 'success', text: `¡Usuario ${username} creado con éxito!` });
      setUsername('');
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setRol('EMPLEADO');
      setTelefono('');
      fetchUsuarios();
    } catch (err) {
      setMensaje({ type: 'error', text: 'Error creando el usuario en el servidor.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner matching Cerdos.js */}
      <div className="flex justify-between items-center bg-white/70 p-6 rounded-3xl backdrop-blur-sm border border-[#e2e2d5]">
        <div>
          <h1 className="text-4xl font-black text-[#5d3a1a]">Gestión de Usuarios y Roles (RBAC)</h1>
          <p className="text-slate-500 font-bold text-sm mt-1">Control de Acceso y Perfiles de la Granja</p>
        </div>
      </div>

      {/* Metrics Bar matching Cerdos.js */}
      <div className="metrics-pill shadow-sm">
         <SummaryItem label="Total Usuarios" value={usuarios.length} />
         <SummaryItem label="Administradores" value={usuarios.filter(u => u.rol === 'ADMIN').length} color="text-purple-700" />
         <SummaryItem label="Empleados" value={usuarios.filter(u => u.rol === 'EMPLEADO').length} color="text-blue-700" />
         <SummaryItem label="Clientes" value={usuarios.filter(u => u.rol === 'CLIENTE').length} color="text-amber-700" />
      </div>

      {mensaje && (
        <div className={`p-4 rounded-2xl font-bold flex items-center gap-3 ${mensaje.type === 'success' ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300' : 'bg-rose-100 text-rose-800 border-2 border-rose-300'}`}>
          <span>{mensaje.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{mensaje.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario Crear Usuario */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border-2 border-[#e2e2d5] shadow-sm space-y-4">
          <h2 className="text-xl font-black text-[#5d3a1a] border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>👤</span> Registrar Usuario
          </h2>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="form-group">
              <label className="text-xs font-bold text-slate-500 uppercase">Nombre de Usuario (Username)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ej. jmendoza"
                className="form-input font-bold"
              />
            </div>

            <div className="form-group">
              <label className="text-xs font-bold text-slate-500 uppercase">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="form-group">
                <label className="text-xs font-bold text-slate-500 uppercase">Nombre</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Juan"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="text-xs font-bold text-slate-500 uppercase">Apellido</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Mendoza"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="text-xs font-bold text-slate-500 uppercase">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@fincalaprimavera.com"
                className="form-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="form-group">
                <label className="text-xs font-bold text-slate-500 uppercase">Rol de Acceso</label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="form-input font-bold"
                >
                  <option value="ADMIN">Administrador</option>
                  <option value="EMPLEADO">Empleado</option>
                  <option value="CLIENTE">Cliente</option>
                </select>
              </div>
              <div className="form-group">
                <label className="text-xs font-bold text-slate-500 uppercase">Teléfono</label>
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="8888-0000"
                  className="form-input"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#5d3a1a] hover:bg-[#3d240e] text-[#f4b41b] font-black rounded-2xl text-lg shadow-lg transition-all"
            >
              Crear Usuario
            </button>
          </form>
        </div>

        {/* Tabla Lista de Usuarios Zebra */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-2xl font-black text-[#5d3a1a]">🛡️ Directorio de Usuarios Registrados</h2>
          <div className="exact-table-container">
            <table className="exact-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Nombre Completo</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th className="text-right">Estado</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id}>
                    <td className="font-bold text-[#5d3a1a]">@{u.username}</td>
                    <td className="font-bold text-slate-700">
                      {u.first_name || u.last_name ? `${u.first_name} ${u.last_name}` : 'N/A'}
                    </td>
                    <td className="font-semibold text-slate-500 text-xs">{u.email || 'Sin correo'}</td>
                    <td>
                      <span className={`health-badge ${
                        u.rol === 'ADMIN' ? 'bg-purple-100 text-purple-900' :
                        u.rol === 'EMPLEADO' ? 'badge-saludable' : 'badge-observacion'
                      }`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="health-badge badge-saludable">
                        Activo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const SummaryItem = ({ label, value, color = "text-slate-900" }) => (
  <div className="text-left px-4">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-2xl font-black ${color}`}>{value}</p>
  </div>
);
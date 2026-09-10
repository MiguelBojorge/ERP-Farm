import React, { useState } from 'react';
import { X } from 'lucide-react';
import { changePassword } from '../services/api';

function mensajeDeError(err) {
  const data = err.response?.data;
  const detalle = data?.errores?.[0]?.msg || data?.errores?.[0]?.mensaje;
  return detalle || data?.detail || 'No se pudo cambiar la contraseña.';
}

export default function ChangePasswordModal({ onClose }) {
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    if (nueva !== confirmacion) {
      setMensaje({ type: 'error', text: 'La confirmación no coincide con la nueva contraseña.' });
      return;
    }
    setEnviando(true);
    try {
      await changePassword(actual, nueva);
      setMensaje({ type: 'success', text: 'Contraseña actualizada.' });
      setActual('');
      setNueva('');
      setConfirmacion('');
    } catch (err) {
      setMensaje({ type: 'error', text: mensajeDeError(err) });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Cambiar contraseña">
      <form onSubmit={handleSubmit} className="modal-premium space-y-4" style={{ maxWidth: 440 }}>
        <button type="button" onClick={onClose} aria-label="Cerrar" className="absolute top-6 right-6 text-slate-400 hover:text-rose-500">
          <X size={28} />
        </button>
        <h2 className="text-2xl font-black text-[#5d3a1a]">Cambiar contraseña</h2>

        {mensaje && (
          <div className={`p-3 rounded-2xl font-bold text-sm ${mensaje.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            {mensaje.text}
          </div>
        )}

        <div className="form-group">
          <label className="text-xs font-bold text-slate-500 uppercase">Contraseña actual</label>
          <input type="password" autoComplete="current-password" value={actual} onChange={(e) => setActual(e.target.value)} className="form-input" required />
        </div>
        <div className="form-group">
          <label className="text-xs font-bold text-slate-500 uppercase">Nueva contraseña</label>
          <input type="password" autoComplete="new-password" value={nueva} onChange={(e) => setNueva(e.target.value)} className="form-input" required />
          <p className="text-xs text-slate-400 mt-1">Mínimo 8 caracteres, con letras y números.</p>
        </div>
        <div className="form-group">
          <label className="text-xs font-bold text-slate-500 uppercase">Repetir nueva contraseña</label>
          <input type="password" autoComplete="new-password" value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} className="form-input" required />
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="w-full py-3 bg-[#5d3a1a] hover:bg-[#3d240e] disabled:opacity-60 text-[#f4b41b] font-black rounded-2xl"
        >
          {enviando ? 'Guardando…' : 'Guardar'}
        </button>
      </form>
    </div>
  );
}

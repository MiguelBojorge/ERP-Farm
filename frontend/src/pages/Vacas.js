import React, { useState, useEffect } from 'react';
import { getVacas, createVaca, updateVaca } from '../services/api';
import {
  Eye, Edit3, Package, X, Milk, Hash, Users, Scale, DollarSign, Calendar, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Pagina de gestion de ganado bovino (vacas), analoga a Cerdos.js.
// Reemplaza al antiguo modulo de Cultivos (agricultura, fuera del dominio
// del ERP) con el nuevo modulo de vacas del backend Node (/api/lotes-vacas).
const Vacas = () => {
  const [lotes, setLotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [idError, setIdError] = useState('');

  const [selectedLote, setSelectedLote] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'view', 'edit', 'move'

  const [formData, setFormData] = useState({
    id_batch: '',
    raza: 'Holstein',
    proposito: 'DOBLE_PROPOSITO',
    cantidad_inicial: '',
    peso_promedio_inicial: '',
    costo_inicial: '',
    fecha_entrada: new Date().toISOString().split('T')[0],
    estado: 'SALUDABLE',
    ubicacion: 'Potrero 1',
    edad_inicial_meses: 12,
    produccion_leche_litros_dia: ''
  });

  const razas = ['Holstein', 'Jersey', 'Brahman', 'Pardo Suizo', 'Reyna', 'Gyr', 'Criollo'];
  const propositos = [
    { key: 'LECHE', label: 'Leche' },
    { key: 'CARNE', label: 'Carne' },
    { key: 'DOBLE_PROPOSITO', label: 'Doble propósito' },
  ];
  const estadosSalud = [
    { key: 'SALUDABLE', label: 'Saludable' },
    { key: 'LACTANCIA', label: 'Lactancia' },
    { key: 'SECA', label: 'Seca' },
    { key: 'OBSERVACION', label: 'Observación' },
    { key: 'REVISION', label: 'Revisión' }
  ];

  useEffect(() => {
    fetchData();
    if (!formData.id_batch) {
      setFormData(prev => ({ ...prev, id_batch: `V-${Math.floor(Math.random() * 900) + 100}` }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const res = await getVacas();
      setLotes(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const calculateCurrentMonths = (fechaEntrada, edadInicial) => {
    const entrada = new Date(fechaEntrada);
    const hoy = new Date();
    const diffTime = Math.abs(hoy - entrada);
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
    return (parseInt(edadInicial) || 0) + diffMonths;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIdError('');
    const exists = lotes.some(l => l.id_batch.toLowerCase() === formData.id_batch.toLowerCase());
    if (exists) {
      setIdError(`El ID "${formData.id_batch}" ya está en uso.`);
      return;
    }
    try {
      const dataToSend = {
        ...formData,
        cantidad_actual: formData.cantidad_inicial,
        peso_actual: formData.peso_promedio_inicial,
        produccion_leche_litros_dia: formData.proposito === 'CARNE' ? null : (formData.produccion_leche_litros_dia || null),
      };
      await createVaca(dataToSend);
      setShowForm(false);
      fetchData();
      resetForm();
    } catch (e) {
      console.error(e);
      alert("Error al registrar lote de vacas.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateVaca(selectedLote.id, selectedLote);
      setModalMode(null);
      fetchData();
    } catch (e) {
      console.error(e);
      alert("Error al actualizar lote.");
    }
  };

  const resetForm = () => {
    setFormData({
      id_batch: `V-${Math.floor(Math.random() * 900) + 100}`,
      raza: 'Holstein',
      proposito: 'DOBLE_PROPOSITO',
      cantidad_inicial: '',
      peso_promedio_inicial: '',
      costo_inicial: '',
      fecha_entrada: new Date().toISOString().split('T')[0],
      estado: 'SALUDABLE',
      ubicacion: 'Potrero 1',
      edad_inicial_meses: 12,
      produccion_leche_litros_dia: ''
    });
  };

  const metrics = (() => {
    const totalVacas = lotes.reduce((acc, l) => acc + (parseInt(l.cantidad_actual) || 0), 0);
    const avgWeight = lotes.length > 0 ? (lotes.reduce((acc, l) => acc + (parseFloat(l.peso_actual || l.peso_promedio_inicial) || 0), 0) / lotes.length).toFixed(1) : 0;
    const totalLeche = lotes.reduce((acc, l) => acc + (parseFloat(l.produccion_leche_litros_dia) || 0), 0);
    return {
      totalLotes: lotes.length,
      totalVacas: totalVacas.toLocaleString(),
      avgWeight,
      totalLeche: totalLeche.toFixed(1),
      lactancia: lotes.filter(l => l.estado === 'LACTANCIA').length,
      observacion: lotes.filter(l => l.estado === 'OBSERVACION').length,
      critico: lotes.filter(l => l.estado === 'REVISION').length
    };
  })();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white/40 p-6 rounded-3xl backdrop-blur-sm">
        <h1 className="text-4xl font-black text-[#5d3a1a]">Finca La Primavera</h1>
        <button onClick={() => setShowForm(true)} className="btn-green shadow-xl">
          Nuevo Ingreso +
        </button>
      </div>

      <div className="metrics-pill shadow-sm">
        <SummaryItem label="Total Lotes" value={metrics.totalLotes} />
        <SummaryItem label="Total Vacas" value={metrics.totalVacas} />
        <SummaryItem label="Peso Promedio" value={`${metrics.avgWeight} kg`} />
        <SummaryItem label="Litros/día" value={metrics.totalLeche} color="text-sky-600" />
        <SummaryItem label="Lactancia" value={metrics.lactancia} color="text-green-600" />
        <SummaryItem label="Observación" value={metrics.observacion} color="text-amber-500" />
        <SummaryItem label="Crítico" value={metrics.critico} color="text-rose-600" />
      </div>

      <div className="exact-table-container">
        <table className="exact-table">
          <thead>
            <tr>
              <th>ID Lote</th>
              <th>Raza</th>
              <th>Propósito</th>
              <th>Cantidad</th>
              <th>Edad (Actual)</th>
              <th>Peso Promedio</th>
              <th>Salud</th>
              <th>Potrero</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lotes.map((lote) => (
              <tr key={lote.id}>
                <td className="font-bold text-[#5d3a1a]">{lote.id_batch}</td>
                <td className="font-bold text-slate-700">{lote.raza}</td>
                <td className="font-bold text-slate-600">{propositos.find(p => p.key === lote.proposito)?.label || lote.proposito}</td>
                <td className="font-bold">{lote.cantidad_actual}</td>
                <td className="text-slate-600 font-bold">
                  {calculateCurrentMonths(lote.fecha_entrada, lote.edad_inicial_meses)} meses
                </td>
                <td className="font-black text-slate-800">{lote.peso_actual || lote.peso_promedio_inicial} kg</td>
                <td><HealthBadge status={lote.estado} /></td>
                <td className="font-bold text-slate-600">{lote.ubicacion}</td>
                <td>
                  <div className="action-group">
                    <button onClick={() => { setSelectedLote(lote); setModalMode('view'); }} className="action-btn"><Eye size={16}/><span>Ver</span></button>
                    <button onClick={() => { setSelectedLote(lote); setModalMode('edit'); }} className="action-btn"><Edit3 size={16}/><span>Editar</span></button>
                    <button onClick={() => { setSelectedLote(lote); setModalMode('move'); }} className="action-btn"><Package size={16}/><span>Mover</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showForm && (
          <Modal close={() => setShowForm(false)} title="Ingresar Nuevo Lote de Vacas">
            <form onSubmit={handleRegister} className="form-grid">
              <div className="form-group">
                <label>ID de Lote</label>
                <input className="form-input" value={formData.id_batch} onChange={e => { setFormData({ ...formData, id_batch: e.target.value }); setIdError(''); }} required />
                {idError && <p className="error-message">{idError}</p>}
              </div>
              <div className="form-group">
                <label>Raza</label>
                <select className="form-input" value={formData.raza} onChange={e => setFormData({ ...formData, raza: e.target.value })}>
                  {razas.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Propósito</label>
                <select className="form-input" value={formData.proposito} onChange={e => setFormData({ ...formData, proposito: e.target.value })}>
                  {propositos.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Ubicación (Potrero)</label>
                <input className="form-input" value={formData.ubicacion} onChange={e => setFormData({ ...formData, ubicacion: e.target.value })} placeholder="Ej: Potrero 1" required />
              </div>
              <div className="form-group">
                <label>Edad Inicial (meses)</label>
                <input type="number" className="form-input" value={formData.edad_inicial_meses} onChange={e => setFormData({ ...formData, edad_inicial_meses: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Cantidad Inicial</label>
                <input type="number" className="form-input" value={formData.cantidad_inicial} onChange={e => setFormData({ ...formData, cantidad_inicial: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Peso Promedio Inicial (kg)</label>
                <input type="number" step="0.1" className="form-input" value={formData.peso_promedio_inicial} onChange={e => setFormData({ ...formData, peso_promedio_inicial: e.target.value })} required />
              </div>
              {formData.proposito !== 'CARNE' && (
                <div className="form-group">
                  <label>Producción de Leche (L/día)</label>
                  <input type="number" step="0.5" className="form-input" value={formData.produccion_leche_litros_dia} onChange={e => setFormData({ ...formData, produccion_leche_litros_dia: e.target.value })} />
                </div>
              )}
              <div className="form-group">
                <label>Inversión Inicial (C$)</label>
                <input type="number" className="form-input" value={formData.costo_inicial} onChange={e => setFormData({ ...formData, costo_inicial: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Fecha de Ingreso</label>
                <input type="date" className="form-input" value={formData.fecha_entrada} onChange={e => setFormData({ ...formData, fecha_entrada: e.target.value })} required />
              </div>
              <div className="full-width pt-6">
                <button type="submit" className="w-full bg-[#5da05d] text-white py-4 rounded-2xl font-black text-xl shadow-xl">Guardar Lote</button>
              </div>
            </form>
          </Modal>
        )}

        {modalMode === 'view' && selectedLote && (
          <Modal close={() => setModalMode(null)} title={`Detalles: ${selectedLote.id_batch}`}>
            <div className="space-y-6 pt-4">
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200">
                <h4 className="text-[#5d3a1a] font-black uppercase text-xs tracking-widest mb-4">🏠 Historial de Registro</h4>
                <div className="grid grid-cols-2 gap-6">
                  <DataPoint label="Raza Original" value={selectedLote.raza} icon={<Hash size={20}/>} />
                  <DataPoint label="Ingreso" value={selectedLote.fecha_entrada} icon={<Calendar size={20}/>} />
                  <DataPoint label="Peso Entrada" value={`${selectedLote.peso_promedio_inicial} kg`} icon={<Scale size={20}/>} />
                  <DataPoint label="Inversión" value={`C$ ${selectedLote.costo_inicial}`} icon={<DollarSign size={20}/>} />
                  <DataPoint label="Cantidad Inicial" value={`${selectedLote.cantidad_inicial} vacas`} icon={<Users size={20}/>} />
                  <DataPoint label="Potrero" value={selectedLote.ubicacion} icon={<MapPin size={20}/>} />
                </div>
              </div>
              <div className="bg-[#f0f9ff] p-6 rounded-2xl border-2 border-[#bae6fd]">
                <h4 className="text-[#0369a1] font-black uppercase text-xs tracking-widest mb-4">🚀 Estado Actual</h4>
                <div className="grid grid-cols-2 gap-6">
                  <DataPoint label="Cantidad Actual" value={`${selectedLote.cantidad_actual} vacas`} />
                  <DataPoint label="Peso Actual" value={`${selectedLote.peso_actual} kg`} />
                  {selectedLote.produccion_leche_litros_dia != null && (
                    <DataPoint label="Producción de Leche" value={`${selectedLote.produccion_leche_litros_dia} L/día`} icon={<Milk size={20}/>} />
                  )}
                </div>
              </div>
            </div>
          </Modal>
        )}

        {modalMode === 'edit' && selectedLote && (
          <Modal close={() => setModalMode(null)} title="Actualizar Datos">
            <form onSubmit={handleUpdate} className="space-y-6 pt-4">
              <div className="form-group">
                <label>Estado de Salud</label>
                <select className="form-input" value={selectedLote.estado} onChange={e => setSelectedLote({ ...selectedLote, estado: e.target.value })}>
                  {estadosSalud.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Peso Actual (kg)</label>
                  <input type="number" step="0.1" className="form-input" value={selectedLote.peso_actual} onChange={e => setSelectedLote({ ...selectedLote, peso_actual: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Cantidad Actual</label>
                  <input type="number" className="form-input" value={selectedLote.cantidad_actual} onChange={e => setSelectedLote({ ...selectedLote, cantidad_actual: e.target.value })} />
                </div>
              </div>
              {selectedLote.proposito !== 'CARNE' && (
                <div className="form-group">
                  <label>Producción de Leche (L/día)</label>
                  <input type="number" step="0.5" className="form-input" value={selectedLote.produccion_leche_litros_dia || ''} onChange={e => setSelectedLote({ ...selectedLote, produccion_leche_litros_dia: e.target.value })} />
                </div>
              )}
              <button type="submit" className="w-full bg-[#5d3a1a] text-white py-4 rounded-2xl font-black text-xl shadow-xl">Actualizar Lote</button>
            </form>
          </Modal>
        )}

        {modalMode === 'move' && selectedLote && (
          <Modal close={() => setModalMode(null)} title="Mover a otro Potrero">
            <form onSubmit={handleUpdate} className="space-y-6 pt-4 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-amber-100 p-6 rounded-full text-amber-600 animate-bounce">
                  <MapPin size={48} />
                </div>
              </div>
              <div className="form-group">
                <label>Nueva Ubicación (Potrero)</label>
                <input className="form-input text-center text-2xl font-black" value={selectedLote.ubicacion} onChange={e => setSelectedLote({ ...selectedLote, ubicacion: e.target.value })} placeholder="Ej: Potrero 3" />
              </div>
              <p className="text-slate-500 text-sm">Este cambio quedará registrado en el historial logístico del lote.</p>
              <button type="submit" className="w-full bg-amber-500 text-white py-4 rounded-2xl font-black text-xl shadow-xl">Confirmar Traslado</button>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

const Modal = ({ children, close, title }) => (
  <div className="modal-overlay">
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="modal-premium">
      <button onClick={close} className="absolute top-6 right-6 text-slate-400 hover:text-rose-500 transition-colors"><X size={32}/></button>
      <h2 className="text-center">{title}</h2>
      {children}
    </motion.div>
  </div>
);

const DataPoint = ({ label, value, icon }) => (
  <div className="flex items-start gap-3">
    {icon && <div className="text-slate-400 mt-1">{icon}</div>}
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-lg font-black text-slate-700">{value}</p>
    </div>
  </div>
);

const SummaryItem = ({ label, value, color = "text-slate-900" }) => (
  <div className="text-left px-4">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-2xl font-black ${color}`}>{value}</p>
  </div>
);

const HealthBadge = ({ status }) => {
  const dictionary = {
    'SALUDABLE': { label: 'Saludable', icon: '❤', class: 'badge-saludable' },
    'LACTANCIA': { label: 'Lactancia', icon: '🥛', class: 'badge-saludable' },
    'SECA': { label: 'Seca', icon: '🐄', class: 'badge-observacion' },
    'OBSERVACION': { label: 'Observación', icon: '⚠', class: 'badge-observacion' },
    'REVISION': { label: 'Revisión', icon: '🩺', class: 'badge-revision' },
    'CRIA': { label: 'Cría', icon: '❤', class: 'badge-saludable' },
    'ENGORDE': { label: 'Engorde', icon: '❤', class: 'badge-saludable' },
    'DESTETE': { label: 'Destete', icon: '❤', class: 'badge-saludable' },
  };
  const data = dictionary[status] || dictionary['SALUDABLE'];
  return (
    <span className={`health-badge ${data.class}`}>
      <span>{data.icon}</span> {data.label}
    </span>
  );
};

export default Vacas;

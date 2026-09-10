import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Gastos() {
  const [transacciones, setTransacciones] = useState([]);
  const [consumos, setConsumos] = useState([]);
  const [lotesCerdos, setLotesCerdos] = useState([]);
  const [lotesVacas, setLotesVacas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [tipoGasto, setTipoGasto] = useState('CONSUMO'); // CONSUMO or OTRO
  const [especie, setEspecie] = useState('CERDO'); // CERDO or VACA
  const [loteId, setLoteId] = useState('');
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resTrans, resCons, resLotesCerdos, resLotesVacas, resProds] = await Promise.all([
        api.get('/transacciones/').catch(() => ({ data: [] })),
        api.get('/consumos-alimento/').catch(() => ({ data: [] })),
        api.get('/lotes-cerdos/').catch(() => ({ data: [] })),
        api.get('/lotes-vacas/').catch(() => ({ data: [] })),
        api.get('/productos/').catch(() => ({ data: [] }))
      ]);

      const egresos = (resTrans.data || []).filter(t => t.tipo === 'EGRESO');
      setTransacciones(egresos);
      setConsumos(resCons.data || []);
      setLotesCerdos(resLotesCerdos.data || []);
      setLotesVacas(resLotesVacas.data || []);
      setProductos((resProds.data || []).filter(p => p.categoria === 'ALIMENTO' || p.categoria === 'MEDICINA'));
    } catch (err) {
      console.error("Error cargando gastos:", err);
    } finally {
      setLoading(false);
    }
  };

  const lotesDisponibles = especie === 'CERDO' ? lotesCerdos : lotesVacas;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    try {
      if (tipoGasto === 'CONSUMO') {
        if (!loteId || !productoId || !cantidad) {
          setMensaje({ type: 'error', text: 'Por favor complete lote, producto y cantidad.' });
          return;
        }
        const prod = productos.find(p => p.id === parseInt(productoId));
        const totalMonto = prod ? parseFloat(prod.precio_unitario) * parseFloat(cantidad) : 0;

        // El backend acepta exactamente un lote: cerdos O vacas (ver
        // ConsumoAlimento en models/ConsumoAlimento.js).
        const loteField = especie === 'CERDO'
          ? { lote_cerdos_id: parseInt(loteId) }
          : { lote_vacas_id: parseInt(loteId) };

        await api.post('/consumos-alimento/', {
          alimento_id: parseInt(productoId),
          cantidad: parseFloat(cantidad),
          monto_total: totalMonto,
          ...loteField,
        });
        // Nota: el backend ya registra el egreso financiero automáticamente
        // (ver InventoryService.registrarConsumoAlimento), así que aquí no
        // hace falta duplicar la transacción como hacía el código anterior.

        setMensaje({ type: 'success', text: '¡Registro de consumo guardado con éxito!' });
      } else {
        if (!descripcion || !monto) {
          setMensaje({ type: 'error', text: 'Por favor ingrese descripción y monto.' });
          return;
        }
        await api.post('/transacciones/', {
          tipo: 'EGRESO',
          descripcion: descripcion,
          monto: parseFloat(monto)
        });
        setMensaje({ type: 'success', text: '¡Gasto registrado con éxito!' });
      }

      setCantidad('');
      setDescripcion('');
      setMonto('');
      fetchData();
    } catch (err) {
      setMensaje({ type: 'error', text: 'Error guardando el registro.' });
    }
  };

  const totalConsumosMonto = consumos.reduce((sum, c) => sum + (parseFloat(c.monto_total) || 0), 0);
  const totalEgresosMonto = transacciones.reduce((sum, t) => sum + (parseFloat(t.monto) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner matching Cerdos.js */}
      <div className="flex justify-between items-center bg-white/70 p-6 rounded-3xl backdrop-blur-sm border border-[#e2e2d5]">
        <div>
          <h1 className="text-4xl font-black text-[#5d3a1a]">Control de Gastos y Consumos</h1>
          <p className="text-slate-500 font-bold text-sm mt-1">Registro de Alimentación y Mantenimientos de Granja</p>
        </div>
      </div>

      {/* Metrics Bar matching Cerdos.js */}
      <div className="metrics-pill shadow-sm">
         <SummaryItem label="Total Consumos" value={consumos.length} />
         <SummaryItem label="Costo Consumos" value={`C$ ${totalConsumosMonto.toLocaleString()}`} color="text-amber-700" />
         <SummaryItem label="Egresos Totales" value={`C$ ${totalEgresosMonto.toLocaleString()}`} color="text-rose-600" />
         <SummaryItem label="Lotes Cerdos" value={lotesCerdos.length} />
         <SummaryItem label="Lotes Vacas" value={lotesVacas.length} />
      </div>

      {mensaje && (
        <div className={`p-4 rounded-2xl font-bold flex items-center gap-3 ${mensaje.type === 'success' ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300' : 'bg-rose-100 text-rose-800 border-2 border-rose-300'}`}>
          <span>{mensaje.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{mensaje.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border-2 border-[#e2e2d5] shadow-sm space-y-4">
          <h2 className="text-xl font-black text-[#5d3a1a] border-b pb-3 flex items-center gap-2">
            <span>➕</span> Registrar Nuevo Gasto
          </h2>

          <div className="flex gap-2">
            <button
              onClick={() => setTipoGasto('CONSUMO')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all ${tipoGasto === 'CONSUMO' ? 'bg-[#5d3a1a] text-white shadow' : 'bg-[#fdf2e9] text-[#8c7851]'}`}
            >
              🌾 Consumo Alimento
            </button>
            <button
              onClick={() => setTipoGasto('OTRO')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all ${tipoGasto === 'OTRO' ? 'bg-[#5d3a1a] text-white shadow' : 'bg-[#fdf2e9] text-[#8c7851]'}`}
            >
              🛠️ Otro Gasto
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tipoGasto === 'CONSUMO' ? (
              <>
                <div className="form-group">
                  <label className="text-xs font-bold text-slate-500 uppercase">Especie</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setEspecie('CERDO'); setLoteId(''); }}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all ${especie === 'CERDO' ? 'bg-[#5da05d] text-white shadow' : 'bg-slate-100 text-slate-500'}`}
                    >
                      🐷 Cerdos
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEspecie('VACA'); setLoteId(''); }}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all ${especie === 'VACA' ? 'bg-[#5da05d] text-white shadow' : 'bg-slate-100 text-slate-500'}`}
                    >
                      🐄 Vacas
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="text-xs font-bold text-slate-500 uppercase">Lote Destino</label>
                  <select
                    value={loteId}
                    onChange={(e) => setLoteId(e.target.value)}
                    className="form-input"
                  >
                    <option value="">-- Seleccionar Lote --</option>
                    {lotesDisponibles.map(l => (
                      <option key={l.id} value={l.id}>Lote {l.id_batch} - {l.raza} ({l.ubicacion})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="text-xs font-bold text-slate-500 uppercase">Insumo / Alimento</label>
                  <select
                    value={productoId}
                    onChange={(e) => setProductoId(e.target.value)}
                    className="form-input"
                  >
                    <option value="">-- Seleccionar Insumo --</option>
                    {productos.map(p => (
                      <option key={p.id} value={p.id}>{p.nombre} - C$ {p.precio_unitario}/u</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="text-xs font-bold text-slate-500 uppercase">Cantidad Consumida</label>
                  <input
                    type="number"
                    step="0.1"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    placeholder="Ej. 5"
                    className="form-input"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label className="text-xs font-bold text-slate-500 uppercase">Descripción</label>
                  <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Ej. Mantenimiento de cerca"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="text-xs font-bold text-slate-500 uppercase">Monto (C$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    placeholder="0.00"
                    className="form-input"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-[#5da05d] hover:bg-[#4d884d] text-white font-black rounded-2xl text-lg shadow-lg transition-all"
            >
              Guardar Registro
            </button>
          </form>
        </div>

        {/* Tablas de Historial Zebra */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-black text-[#5d3a1a]">🥣 Historial de Consumos por Lote</h3>
            <div className="exact-table-container">
              <table className="exact-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Lote</th>
                    <th>Insumo</th>
                    <th>Cantidad</th>
                    <th className="text-right">Costo Total</th>
                  </tr>
                </thead>
                <tbody>
                  {consumos.slice(0, 7).map((c, i) => {
                    const lote = c.lote_cerdos || c.lote_vacas;
                    return (
                      <tr key={c.id || i}>
                        <td className="font-bold text-slate-500">{c.fecha}</td>
                        <td className="font-bold text-[#5d3a1a]">{lote ? lote.id_batch : '—'}</td>
                        <td className="font-semibold text-slate-800">{c.alimento ? c.alimento.nombre : '—'}</td>
                        <td className="font-bold text-slate-700">{c.cantidad} u</td>
                        <td className="text-right font-black text-emerald-700">C$ {parseFloat(c.monto_total || 0).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-black text-[#5d3a1a]">💸 Historial de Egresos Operativos</h3>
            <div className="exact-table-container">
              <table className="exact-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th className="text-right">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {transacciones.slice(0, 7).map((t, i) => (
                    <tr key={t.id || i}>
                      <td className="font-bold text-slate-500">{t.fecha}</td>
                      <td className="font-semibold text-slate-800">{t.descripcion}</td>
                      <td className="text-right font-black text-rose-600">- C$ {parseFloat(t.monto).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

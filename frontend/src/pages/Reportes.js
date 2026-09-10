import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Printer } from 'lucide-react';

export default function Reportes() {
  const [transacciones, setTransacciones] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [resTrans, resLotes, resProds] = await Promise.all([
        api.get('/transacciones/').catch(() => ({ data: [] })),
        api.get('/lotes-cerdos/').catch(() => ({ data: [] })),
        api.get('/productos/').catch(() => ({ data: [] }))
      ]);

      setTransacciones(resTrans.data || []);
      setLotes(resLotes.data || []);
      setProductos(resProds.data || []);
    } catch (err) {
      console.error("Error cargando datos de reportes:", err);
    }
  };

  const totalIngresos = transacciones
    .filter(t => t.tipo === 'INGRESO')
    .reduce((sum, t) => sum + parseFloat(t.monto || 0), 0);

  const totalEgresos = transacciones
    .filter(t => t.tipo === 'EGRESO')
    .reduce((sum, t) => sum + parseFloat(t.monto || 0), 0);

  const gananciaNeta = totalIngresos - totalEgresos;
  const biomasaTotalKg = lotes.reduce((sum, l) => sum + ((parseInt(l.cantidad_actual) || 0) * (parseFloat(l.peso_actual) || 0)), 0);
  const productosBajoStock = productos.filter(p => p.cantidad <= p.stock_minimo);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/70 p-6 rounded-3xl backdrop-blur-sm border border-[#e2e2d5] gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#5d3a1a]">Reportes e Inteligencia P&L</h1>
          <p className="text-slate-500 font-bold text-sm mt-1">Análisis Consolidado de Ganancias, Biomasa e Inventarios</p>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-[#5d3a1a] hover:bg-[#3d240e] text-[#f4b41b] font-black py-3 px-5 rounded-2xl shadow-lg transition-all flex items-center gap-2 text-sm"
        >
          <Printer size={18} /> Imprimir Reporte PDF
        </button>
      </div>

      {/* Metrics Pill matching Cerdos.js */}
      <div className="metrics-pill shadow-sm">
         <SummaryItem label="Ingresos Totales" value={`C$ ${totalIngresos.toLocaleString()}`} color="text-emerald-700" />
         <SummaryItem label="Egresos Totales" value={`C$ ${totalEgresos.toLocaleString()}`} color="text-rose-600" />
         <SummaryItem label="Ganancia Neta" value={`C$ ${gananciaNeta.toLocaleString()}`} color={gananciaNeta >= 0 ? "text-emerald-700" : "text-rose-600"} />
         <SummaryItem label="Biomasa Total" value={`${biomasaTotalKg.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg`} color="text-amber-800" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* P&L Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#e2e2d5] shadow-sm space-y-4">
          <h2 className="text-xl font-black text-[#5d3a1a] border-b border-slate-100 pb-3">📊 Desglose P&L Operativo</h2>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-emerald-700">Ingresos Totales (C$ {totalIngresos.toLocaleString()})</span>
                <span className="text-slate-500">100%</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                <div className="bg-[#5da05d] h-full rounded-full w-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-rose-600">Egresos Operativos (C$ {totalEgresos.toLocaleString()})</span>
                <span className="text-slate-500">{totalIngresos > 0 ? ((totalEgresos / totalIngresos) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, totalIngresos > 0 ? (totalEgresos / totalIngresos) * 100 : 0)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-blue-700">Margen Neto Operación</span>
                <span className="text-blue-700">{totalIngresos > 0 ? ((gananciaNeta / totalIngresos) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${Math.max(0, Math.min(100, totalIngresos > 0 ? (gananciaNeta / totalIngresos) * 100 : 0))}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Alerts Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#e2e2d5] shadow-sm space-y-4">
          <h2 className="text-xl font-black text-[#5d3a1a] border-b border-slate-100 pb-3 flex justify-between items-center">
            <span>🚨 Alertas de Inventario Crítico</span>
            <span className="text-xs bg-[#fdf2e9] text-[#8c7851] px-3 py-1 rounded-full font-bold">{productosBajoStock.length} Insumos</span>
          </h2>

          {productosBajoStock.length === 0 ? (
            <div className="p-6 text-center text-emerald-800 font-bold bg-[#dcfce7] rounded-2xl">
              ✅ Todos los insumos están en niveles óptimos por encima del stock mínimo.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-56 overflow-y-auto">
              {productosBajoStock.map(p => (
                <div key={p.id} className="p-3.5 bg-[#fef9c3] rounded-2xl border border-[#fef08a] flex justify-between items-center">
                  <div>
                    <p className="font-bold text-[#854d0e]">{p.nombre}</p>
                    <p className="text-xs text-slate-500 font-semibold">Categoría: {p.categoria}</p>
                  </div>
                  <span className="text-xs bg-rose-600 text-white font-bold px-3 py-1 rounded-xl">
                    Stock: {p.cantidad} / Mín: {p.stock_minimo}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Biomasa Table matching Cerdos.js Zebra Style */}
      <div className="space-y-3">
        <h2 className="text-2xl font-black text-[#5d3a1a]">🐷 Rendimiento Biológico y Biomasa por Lote</h2>
        <div className="exact-table-container">
          <table className="exact-table">
            <thead>
              <tr>
                <th>ID Lote</th>
                <th>Raza</th>
                <th>Ubicación</th>
                <th>Cabezas</th>
                <th>Peso Promedio</th>
                <th>Biomasa Total</th>
                <th className="text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              {lotes.map(l => {
                const biomasa = (parseInt(l.cantidad_actual) || 0) * (parseFloat(l.peso_actual) || 0);
                return (
                  <tr key={l.id}>
                    <td className="font-bold text-[#5d3a1a]">{l.id_batch}</td>
                    <td className="font-bold text-slate-700">{l.raza}</td>
                    <td className="font-bold text-slate-500">{l.ubicacion}</td>
                    <td className="font-bold">{l.cantidad_actual}</td>
                    <td className="font-bold text-slate-800">{l.peso_actual} kg</td>
                    <td className="font-black text-emerald-700">{biomasa.toLocaleString()} kg</td>
                    <td className="text-right">
                      <span className={`health-badge ${
                        l.estado === 'SALUDABLE' ? 'badge-saludable' :
                        l.estado === 'ENGORDE' ? 'badge-saludable' : 'badge-observacion'
                      }`}>
                        {l.estado}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
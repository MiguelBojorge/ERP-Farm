import React, { useState, useEffect } from 'react';
import { getTransacciones } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Wallet, FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const Finanzas = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [resumen, setResumen] = useState({ ingresos: 0, egresos: 0, balance: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchFinanzas();
  }, []);

  const fetchFinanzas = async () => {
    try {
      const res = await getTransacciones();
      const data = res.data;
      setTransacciones(data);

      const ingresos = data.filter(t => t.tipo === 'INGRESO').reduce((acc, t) => acc + parseFloat(t.monto), 0);
      const egresos = data.filter(t => t.tipo === 'EGRESO').reduce((acc, t) => acc + parseFloat(t.monto), 0);
      setResumen({ ingresos, egresos, balance: ingresos - egresos });

      // Agrupar por mes para la gráfica
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
      const monthly = months.map(m => ({ name: m, ingresos: 0, egresos: 0 }));
      data.forEach(t => {
        const mIdx = new Date(t.fecha).getMonth();
        if (mIdx < 6) {
          if (t.tipo === 'INGRESO') monthly[mIdx].ingresos += parseFloat(t.monto);
          else monthly[mIdx].egresos += parseFloat(t.monto);
        }
      });
      setChartData(monthly);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header matching Cerdos.js */}
      <div className="flex justify-between items-center bg-white/70 p-6 rounded-3xl backdrop-blur-sm border border-[#e2e2d5]">
        <div>
          <h1 className="text-4xl font-black text-[#5d3a1a]">Estados Financieros</h1>
          <p className="text-slate-500 font-bold text-sm mt-1 flex items-center gap-2">
            <Wallet size={14} /> Libro Mayor y Balance General — Finca La Primavera
          </p>
        </div>
      </div>

      {/* Metrics Pill matching Cerdos.js */}
      <div className="metrics-pill shadow-sm">
        <SummaryItem label="Total Ingresos" value={`C$ ${resumen.ingresos.toLocaleString()}`} color="text-emerald-700" />
        <SummaryItem label="Total Egresos" value={`C$ ${resumen.egresos.toLocaleString()}`} color="text-rose-600" />
        <SummaryItem label="Balance Neto" value={`C$ ${resumen.balance.toLocaleString()}`} color={resumen.balance >= 0 ? "text-emerald-700" : "text-rose-600"} />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Bar Chart Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border-2 border-[#e2e2d5] shadow-sm">
          <h3 className="text-xl font-black text-[#5d3a1a] border-b border-slate-100 pb-3 mb-6">📊 Rendimiento Mensual P&L (Ingresos vs Egresos)</h3>
          <div style={{ height: '380px', width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8c7851', fontSize: 12, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8c7851', fontSize: 12, fontWeight: 700 }} />
                <Tooltip
                  cursor={{ fill: '#fcfcfc' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e2d5', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '16px', fontWeight: 700 }} />
                <Bar dataKey="ingresos" name="Ingresos (C$)" fill="#5da05d" radius={[8, 8, 0, 0]} />
                <Bar dataKey="egresos" name="Egresos (C$)" fill="#e57373" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audit Log Card */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 border-2 border-[#e2e2d5] shadow-sm flex flex-col space-y-4">
          <h3 className="text-xl font-black text-[#5d3a1a] border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText size={20} /> Auditoría de Movimientos
          </h3>

          <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
            {transacciones.map(t => (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                key={t.id}
                className="bg-[#fdfcf9] border border-[#e2e2d5] p-3.5 rounded-2xl flex justify-between items-center"
              >
                <div className="text-left overflow-hidden">
                  <p className="text-[9px] font-bold text-slate-400 uppercase">{t.fecha}</p>
                  <p className="font-bold text-[#5d3a1a] text-xs leading-tight truncate max-w-[130px]" title={t.descripcion}>{t.descripcion}</p>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <p className={`font-black text-sm ${t.tipo === 'INGRESO' ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {t.tipo === 'INGRESO' ? '+' : '-'}C${parseFloat(t.monto).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-auto bg-[#5d3a1a] hover:bg-[#3d240e] text-[#f4b41b] py-3.5 rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all">
            <Download size={16} /> EXPORTAR A PDF
          </button>
        </div>
      </div>
    </div>
  );
};

const SummaryItem = ({ label, value, color = "text-slate-900" }) => (
  <div className="text-left px-4">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-2xl font-black ${color}`}>{value}</p>
  </div>
);

export default Finanzas;

import React, { useState, useEffect } from 'react';
import { getProductos } from '../services/api';
import ProductoForm from '../components/ProductoForm';

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    getProductos().then(res => setProductos(res.data || []));
  }, [refresh]);

  const totalStock = productos.reduce((sum, p) => sum + (parseInt(p.cantidad) || 0), 0);
  const alertas = productos.filter(p => p.cantidad <= p.stock_minimo).length;
  const totalValor = productos.reduce((sum, p) => sum + (parseFloat(p.precio_unitario) || 0) * (parseInt(p.cantidad) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header matching Cerdos.js */}
      <div className="flex justify-between items-center bg-white/70 p-6 rounded-3xl backdrop-blur-sm border border-[#e2e2d5]">
        <div>
          <h1 className="text-4xl font-black text-[#5d3a1a]">Inventario de Insumos y Stock</h1>
          <p className="text-slate-500 font-bold text-sm mt-1">Control de Alimentos, Medicinas y Herramientas de Granja</p>
        </div>
      </div>

      {/* Metrics Pill matching Cerdos.js */}
      <div className="metrics-pill shadow-sm">
        <SummaryItem label="Total Productos" value={productos.length} />
        <SummaryItem label="Unidades en Stock" value={totalStock.toLocaleString()} />
        <SummaryItem label="Alertas Stock Bajo" value={alertas} color={alertas > 0 ? "text-rose-600" : "text-emerald-700"} />
        <SummaryItem label="Valor Inventario" value={`C$ ${totalValor.toLocaleString()}`} color="text-emerald-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form left column */}
        <div className="lg:col-span-4">
          <ProductoForm onAdded={() => setRefresh(prev => prev + 1)} />
        </div>

        {/* Table right column */}
        <div className="lg:col-span-8 space-y-3">
          <h2 className="text-xl font-black text-[#5d3a1a] flex items-center justify-between">
            <span>📦 Catálogo de Insumos y Stock</span>
            <span className="text-xs bg-[#fdf2e9] text-[#8c7851] px-3 py-1 rounded-full font-bold">{productos.length} Productos</span>
          </h2>

          <div className="exact-table-container">
            <table className="exact-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Cantidad</th>
                  <th>Stock Mínimo</th>
                  <th>Precio/u</th>
                  <th className="text-right">Estado</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id}>
                    <td className="font-bold text-[#5d3a1a]">{p.nombre}</td>
                    <td className="font-bold text-slate-500 text-xs uppercase tracking-wider">{p.categoria}</td>
                    <td className="font-black text-lg text-slate-800">{p.cantidad}</td>
                    <td className="font-bold text-slate-500">{p.stock_minimo}</td>
                    <td className="font-bold text-emerald-700">C$ {parseFloat(p.precio_unitario).toLocaleString()}</td>
                    <td className="text-right">
                      {p.cantidad <= p.stock_minimo ? (
                        <span className="health-badge badge-revision">REABASTECER</span>
                      ) : (
                        <span className="health-badge badge-saludable">OK</span>
                      )}
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
};

const SummaryItem = ({ label, value, color = "text-slate-900" }) => (
  <div className="text-left px-4">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-2xl font-black ${color}`}>{value}</p>
  </div>
);

export default Inventario;
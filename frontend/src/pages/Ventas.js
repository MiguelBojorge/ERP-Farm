import React, { useState, useEffect } from 'react';
import { getProductos, getLotes, getVacas, getVentas, createVenta, getClientes, createCliente, getFacturaPdf } from '../services/api';
import { ShoppingCart, Package, Beef, Milk, Trash2, Plus, Download, User, UserPlus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [vacas, setVacas] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [cart, setCart] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', telefono: '', email: '', direccion: '' });
  const [configItem, setConfigItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // La factura exige sesion, asi que se baja con el token y se abre desde memoria.
  const descargarFactura = async (id) => {
    try {
      const res = await getFacturaPdf(id);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      window.open(url, '_blank', 'noopener');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      setMensaje({ type: 'error', text: 'No se pudo descargar la factura.' });
    }
  };

  const fetchData = async () => {
    try {
      const [v, p, l, vc, cl] = await Promise.all([
        getVentas(), getProductos(), getLotes(), getVacas(), getClientes()
      ]);
      setVentas(v.data || []);
      setProductos(p.data || []);
      setLotes(l.data || []);
      setVacas(vc.data || []);
      const clientesData = cl.data || [];
      setClientes(clientesData);
      setClienteId(prev => prev || (clientesData[0] ? String(clientesData[0].id) : ''));
    } catch (err) {
      console.error("Error cargando catálogo de ventas:", err);
    }
  };

  const handleCreateCliente = async (e) => {
    e.preventDefault();
    if (!nuevoCliente.nombre || !nuevoCliente.telefono) {
      setMensaje({ type: 'error', text: 'Nombre y teléfono del cliente son obligatorios.' });
      return;
    }
    try {
      const res = await createCliente({
        ...nuevoCliente,
        email: nuevoCliente.email || null,
        direccion: nuevoCliente.direccion || null,
      });
      setClientes(prev => [...prev, res.data]);
      setClienteId(String(res.data.id));
      setNuevoCliente({ nombre: '', telefono: '', email: '', direccion: '' });
      setShowClienteModal(false);
      setMensaje({ type: 'success', text: `Cliente "${res.data.nombre}" registrado y seleccionado.` });
    } catch (err) {
      console.error(err);
      setMensaje({ type: 'error', text: 'Error registrando el cliente.' });
    }
  };

  const openConfigModal = (item, type) => {
    let suggestedPrice = 48;
    const raza = (item.raza || "").toUpperCase();
    if (type === 'lote') {
      if (raza.includes("LANDRACE")) suggestedPrice = 52;
      else if (raza.includes("DUROC")) suggestedPrice = 50;
    } else if (type === 'vaca') {
      suggestedPrice = 60;
      if (raza.includes("HOLSTEIN")) suggestedPrice = 65;
    }

    setConfigItem({
        ...item,
        type,
        qty: 1,
        avg_weight: item.peso_actual || item.peso_promedio_inicial || 50,
        price_per_kg: suggestedPrice
    });
  };

  const addItemToCart = (item, type) => {
    if (type === 'lote' || type === 'vaca') {
        openConfigModal(item, type);
        return;
    }
    const exists = cart.find(c => c.id === item.id && c.type === type);
    if (exists) {
      setCart(cart.map(c => (c.id === item.id && c.type === type) ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, {
        id: item.id,
        name: item.nombre || item.tipo,
        type,
        qty: 1,
        price: parseFloat(item.precio_unitario || 50)
      }]);
    }
  };

  const confirmBatchSale = () => {
    const totalPrice = configItem.qty * configItem.avg_weight * configItem.price_per_kg;
    setCart([...cart, {
        id: configItem.id,
        name: `Lote ${configItem.id_batch}`,
        type: configItem.type,
        qty: configItem.qty,
        weight: configItem.avg_weight,
        price_kg: configItem.price_per_kg,
        price: totalPrice / configItem.qty
    }]);
    setConfigItem(null);
  };

  const removeFromCart = (idx) => {
    const newCart = [...cart];
    newCart.splice(idx, 1);
    setCart(newCart);
  };

  const total = cart.reduce((acc, item) => acc + (item.qty * item.price), 0);

  const finalizeSale = async () => {
    if (cart.length === 0) return;
    if (!clienteId) {
      setMensaje({ type: 'error', text: 'Selecciona o registra un cliente antes de facturar.' });
      return;
    }
    setLoading(true);
    setMensaje(null);
    try {
      // Nota: se usa el sufijo "_id" (lote_cerdos_id, producto_id, lote_vacas_id,
      // cliente_id) porque el backend Node espera las claves foraneas explicitas
      // (loteCerdosId, productoId, loteVacasId, clienteId una vez convertidas de
      // snake_case a camelCase) en vez de los nombres de relacion "planos" que
      // usaba el serializer de Django.
      const detalles = cart.map(item => ({
        cantidad: item.qty,
        precio_unitario: item.price,
        lote_cerdos_id: item.type === 'lote' ? item.id : null,
        producto_id: item.type === 'prod' ? item.id : null,
        lote_vacas_id: item.type === 'vaca' ? item.id : null
      }));

      const payload = {
        cliente_id: parseInt(clienteId),
        metodo_pago: 'EFECTIVO',
        detalles: detalles
      };

      await createVenta(payload);
      setMensaje({ type: 'success', text: '¡Venta facturada con éxito! Stock actualizado.' });
      setCart([]);
      fetchData();
    } catch (err) {
      console.error(err);
      setMensaje({ type: 'error', text: 'Error procesando la venta.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/70 p-6 rounded-3xl backdrop-blur-sm border border-[#e2e2d5] gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#5d3a1a]">Caja y Facturación</h1>
          <p className="text-slate-500 font-bold text-sm mt-1">Punto de Venta Comercial - Finca La Primavera</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 bg-[#fdf2e9] border border-[#e2d5c3] px-4 py-2.5 rounded-2xl shadow-sm">
            <User size={18} className="text-[#8c7851]" />
            <span className="text-[#8c7851] font-bold text-xs uppercase tracking-wider">Cliente:</span>
            <select
              className="bg-transparent font-black text-[#5d3a1a] outline-none text-sm max-w-[220px]"
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
            >
              <option value="" disabled>-- Selecciona --</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowClienteModal(true)}
            className="flex items-center gap-2 bg-[#5da05d] hover:bg-[#4d884d] text-white px-4 py-2.5 rounded-2xl shadow-sm font-bold text-xs transition-all"
          >
            <UserPlus size={16} /> Nuevo
          </button>
        </div>
      </div>

      {/* Metrics Bar matching Cerdos.js */}
      <div className="metrics-pill shadow-sm">
         <SummaryItem label="Catálogo Insumos" value={productos.length} />
         <SummaryItem label="Lotes de Cerdos" value={lotes.length} />
         <SummaryItem label="Lotes de Vacas" value={vacas.length} />
         <SummaryItem label="Items en Carrito" value={cart.length} color="text-amber-600" />
         <SummaryItem label="Total Venta" value={`C$ ${total.toLocaleString()}`} color="text-emerald-700" />
      </div>

      {mensaje && (
        <div className={`p-4 rounded-2xl font-bold flex items-center gap-3 ${mensaje.type === 'success' ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300' : 'bg-rose-100 text-rose-800 border-2 border-rose-300'}`}>
          <span>{mensaje.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{mensaje.text}</span>
        </div>
      )}

      {/* Main Grid: Left Catalog, Right Receipt */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Side: Product Catalogs */}
        <div className="lg:col-span-2 space-y-6">
          <CatalogSection
            title="Insumos y Productos"
            items={productos}
            icon={<Package size={22} className="text-amber-700" />}
            onAdd={(i) => addItemToCart(i, 'prod')}
          />

          <CatalogSection
            title="Lotes de Cerdos (Ganadería)"
            items={lotes}
            icon={<Beef size={22} className="text-amber-700" />}
            onAdd={(i) => addItemToCart(i, 'lote')}
            isBatch
          />

          <CatalogSection
            title="Lotes de Vacas (Ganadería)"
            items={vacas}
            icon={<Milk size={22} className="text-amber-700" />}
            onAdd={(i) => addItemToCart(i, 'vaca')}
            isBatch
          />
        </div>

        {/* Right Side: Receipt Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border-4 border-[#5d3a1a] shadow-xl space-y-6 sticky top-6">
            <h3 className="text-2xl font-black text-[#5d3a1a] border-b pb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><ShoppingCart size={24} /> Recibo de Venta</span>
              <span className="text-xs bg-[#fdf2e9] text-[#8c7851] px-3 py-1 rounded-full font-bold">{cart.length} ítems</span>
            </h3>

            {cart.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-bold text-sm bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                El carrito está vacío.<br/>Selecciona productos o lotes para facturar.
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="bg-[#f0f7ff] p-3.5 rounded-2xl border border-[#bae6fd] flex justify-between items-center">
                    <div>
                      <p className="font-bold text-[#5d3a1a] text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500 font-semibold">{item.qty} u × C$ {item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-emerald-700 text-sm">C$ {(item.qty * item.price).toLocaleString()}</span>
                      <button onClick={() => removeFromCart(idx)} className="text-rose-400 hover:text-rose-600 p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t-2 border-dashed border-slate-200 pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold text-sm uppercase">Total Factura:</span>
                <span className="text-3xl font-black text-[#5d3a1a]">C$ {total.toLocaleString()}</span>
              </div>

              <button
                disabled={cart.length === 0 || loading}
                onClick={finalizeSale}
                className="w-full py-4 bg-[#5da05d] hover:bg-[#4d884d] text-white font-black rounded-2xl text-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>💳</span> {loading ? 'Procesando...' : 'FACTURAR Y GENERAR'}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Historial de Ventas con Tabla Zebra (Idéntica a Cerdos.js) */}
      <div className="space-y-4 pt-6">
        <h2 className="text-2xl font-black text-[#5d3a1a] flex items-center gap-2">
          <span>📜</span> Historial de Ventas y Facturación (PDF)
        </h2>

        <div className="exact-table-container">
          <table className="exact-table">
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Cliente</th>
                <th>Método Pago</th>
                <th>Monto Total</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((v) => (
                <tr key={v.id}>
                  <td className="font-bold text-[#5d3a1a]"># VENTA-{v.id}</td>
                  <td className="font-bold text-slate-700">{v.cliente ? v.cliente.nombre : `Cliente #${v.cliente_id || '-'}`}</td>
                  <td className="font-bold text-slate-500">{v.metodo_pago}</td>
                  <td className="font-black text-emerald-700">C$ {parseFloat(v.total).toLocaleString()}</td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => descargarFactura(v.id)}
                      className="inline-flex items-center gap-2 bg-[#fdf2e9] hover:bg-[#f5e4d2] border border-[#e2d5c3] text-[#5d3a1a] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      <Download size={14} className="text-[#8c7851]" /> Factura PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Configuración Venta Cerdo/Vaca */}
      <AnimatePresence>
        {configItem && (
          <div className="modal-overlay">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="modal-premium">
              <button onClick={() => setConfigItem(null)} className="absolute top-6 right-6 text-slate-400 hover:text-rose-500"><X size={28}/></button>
              <h2 className="text-2xl font-black text-[#5d3a1a] mb-6">Configurar Venta: {configItem.id_batch}</h2>
              <div className="space-y-4">
                 <div className="form-group">
                    <label>Cantidad de Cabezas</label>
                    <input type="number" className="form-input" value={configItem.qty} onChange={e => setConfigItem({...configItem, qty: parseInt(e.target.value) || 0})} />
                 </div>
                 <div className="form-group">
                    <label>Peso Promedio (kg)</label>
                    <input type="number" step="0.1" className="form-input" value={configItem.avg_weight} onChange={e => setConfigItem({...configItem, avg_weight: parseFloat(e.target.value) || 0})} />
                 </div>
                 <div className="form-group">
                    <label>Precio por kg (C$)</label>
                    <input type="number" step="0.5" className="form-input" value={configItem.price_per_kg} onChange={e => setConfigItem({...configItem, price_per_kg: parseFloat(e.target.value) || 0})} />
                 </div>
                 <div className="bg-[#f0f7ff] p-4 rounded-2xl text-center border border-[#bae6fd]">
                    <p className="text-xs text-slate-500 font-bold uppercase">Subtotal Estimado:</p>
                    <p className="text-2xl font-black text-emerald-700">C$ {(configItem.qty * configItem.avg_weight * configItem.price_per_kg).toLocaleString()}</p>
                 </div>
                 <button onClick={confirmBatchSale} className="w-full bg-[#5da05d] text-white py-4 rounded-2xl font-black text-xl shadow-xl">Añadir al Recibo</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal Registro Rapido de Cliente */}
        {showClienteModal && (
          <div className="modal-overlay">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="modal-premium">
              <button onClick={() => setShowClienteModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-rose-500"><X size={28}/></button>
              <h2 className="text-2xl font-black text-[#5d3a1a] mb-6">Registrar Nuevo Cliente</h2>
              <form onSubmit={handleCreateCliente} className="space-y-4">
                <div className="form-group">
                  <label>Nombre / Razón Social</label>
                  <input className="form-input" value={nuevoCliente.nombre} onChange={e => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })} placeholder="Ej: Carnicería El Buen Corte" required />
                </div>
                <div className="form-group">
                  <label>Teléfono</label>
                  <input className="form-input" value={nuevoCliente.telefono} onChange={e => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })} placeholder="8888-0000" required />
                </div>
                <div className="form-group">
                  <label>Correo Electrónico</label>
                  <input type="email" className="form-input" value={nuevoCliente.email} onChange={e => setNuevoCliente({ ...nuevoCliente, email: e.target.value })} placeholder="cliente@correo.com" />
                </div>
                <div className="form-group">
                  <label>Dirección</label>
                  <input className="form-input" value={nuevoCliente.direccion} onChange={e => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })} placeholder="Opcional" />
                </div>
                <button type="submit" className="w-full bg-[#5da05d] text-white py-4 rounded-2xl font-black text-xl shadow-xl">Guardar Cliente</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CatalogSection = ({ title, items, icon, onAdd }) => (
  <div className="bg-white rounded-3xl p-6 border-2 border-[#e2e2d5] shadow-sm space-y-4">
    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
      {icon}
      <h3 className="text-xl font-black text-[#5d3a1a]">{title}</h3>
      <span className="text-xs bg-[#fdf2e9] text-[#8c7851] px-3 py-1 rounded-full font-bold ml-auto">{items.length} Disponibles</span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((item) => (
        <div key={item.id} className="bg-[#fdfcf9] border border-[#e2e2d5] hover:border-[#5da05d] p-4 rounded-2xl flex justify-between items-center transition-all">
          <div>
            <p className="font-bold text-[#5d3a1a] text-sm">{item.nombre || item.id_batch || item.tipo}</p>
            <p className="text-xs text-slate-400 font-bold mt-1">
              Stock: <span className="text-slate-700">{item.cantidad_actual || item.cantidad || 0}</span>
              {item.precio_unitario && <span className="ml-2 text-emerald-700">C$ {item.precio_unitario}/u</span>}
            </p>
          </div>
          <button
            onClick={() => onAdd(item)}
            className="bg-[#fdf2e9] hover:bg-[#5da05d] text-[#8c7851] hover:text-white p-2.5 rounded-xl border border-[#e2d5c3] font-bold text-xs transition-all flex items-center gap-1 shadow-sm"
          >
            <Plus size={16} /> <span>Añadir</span>
          </button>
        </div>
      ))}
    </div>
  </div>
);

const SummaryItem = ({ label, value, color = "text-slate-900" }) => (
  <div className="text-left px-4">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className={`text-2xl font-black ${color}`}>{value}</p>
  </div>
);

export default Ventas;

/**
 * models/index.js
 * Punto único donde se declaran TODAS las asociaciones entre modelos.
 * Mantener las asociaciones centralizadas evita dependencias circulares
 * entre archivos de modelo individuales y refleja, capa por capa, las
 * relaciones que antes vivian implicitas en los ForeignKey de Django.
 */
const { sequelize } = require('../config/database');

const Usuario = require('./Usuario');

const LoteCerdos = require('./LoteCerdos');
const RegistroPesoCerdos = require('./RegistroPesoCerdos');
const RegistroSaludCerdos = require('./RegistroSaludCerdos');

const LoteVacas = require('./LoteVacas');
const RegistroPesoVacas = require('./RegistroPesoVacas');
const RegistroSaludVacas = require('./RegistroSaludVacas');

const Proveedor = require('./Proveedor');
const Producto = require('./Producto');
const OrdenCompra = require('./OrdenCompra');
const ConsumoAlimento = require('./ConsumoAlimento');

const Transaccion = require('./Transaccion');

const Cliente = require('./Cliente');
const Venta = require('./Venta');
const VentaDetalle = require('./VentaDetalle');
const Carrito = require('./Carrito');
const CarritoItem = require('./CarritoItem');

// ---------------------------------------------------------------------------
// Cerdos: lote -> historial de peso / historial de salud
// ---------------------------------------------------------------------------
LoteCerdos.hasMany(RegistroPesoCerdos, {
  foreignKey: { name: 'loteId', allowNull: false },
  as: 'historialPesos',
  onDelete: 'CASCADE',
});
RegistroPesoCerdos.belongsTo(LoteCerdos, { foreignKey: 'loteId', as: 'lote' });

LoteCerdos.hasMany(RegistroSaludCerdos, {
  foreignKey: { name: 'loteId', allowNull: false },
  as: 'registrosSalud',
  onDelete: 'CASCADE',
});
RegistroSaludCerdos.belongsTo(LoteCerdos, { foreignKey: 'loteId', as: 'lote' });

// ---------------------------------------------------------------------------
// Vacas: lote -> historial de peso / historial de salud (mismo patron)
// ---------------------------------------------------------------------------
LoteVacas.hasMany(RegistroPesoVacas, {
  foreignKey: { name: 'loteId', allowNull: false },
  as: 'historialPesos',
  onDelete: 'CASCADE',
});
RegistroPesoVacas.belongsTo(LoteVacas, { foreignKey: 'loteId', as: 'lote' });

LoteVacas.hasMany(RegistroSaludVacas, {
  foreignKey: { name: 'loteId', allowNull: false },
  as: 'registrosSalud',
  onDelete: 'CASCADE',
});
RegistroSaludVacas.belongsTo(LoteVacas, { foreignKey: 'loteId', as: 'lote' });

// ---------------------------------------------------------------------------
// Inventario
// ---------------------------------------------------------------------------
Proveedor.hasMany(Producto, { foreignKey: { name: 'proveedorId', allowNull: true }, as: 'productos', onDelete: 'SET NULL' });
Producto.belongsTo(Proveedor, { foreignKey: 'proveedorId', as: 'proveedor' });

Proveedor.hasMany(OrdenCompra, { foreignKey: { name: 'proveedorId', allowNull: false }, as: 'ordenesCompra', onDelete: 'CASCADE' });
OrdenCompra.belongsTo(Proveedor, { foreignKey: 'proveedorId', as: 'proveedor' });

// ConsumoAlimento: alimento siempre requerido; el lote es cerdos O vacas (ver validacion en el modelo)
Producto.hasMany(ConsumoAlimento, { foreignKey: { name: 'alimentoId', allowNull: false }, as: 'consumos', onDelete: 'CASCADE' });
ConsumoAlimento.belongsTo(Producto, { foreignKey: 'alimentoId', as: 'alimento' });

LoteCerdos.hasMany(ConsumoAlimento, { foreignKey: { name: 'loteCerdosId', allowNull: true }, as: 'consumos', onDelete: 'CASCADE' });
ConsumoAlimento.belongsTo(LoteCerdos, { foreignKey: 'loteCerdosId', as: 'loteCerdos' });

LoteVacas.hasMany(ConsumoAlimento, { foreignKey: { name: 'loteVacasId', allowNull: true }, as: 'consumos', onDelete: 'CASCADE' });
ConsumoAlimento.belongsTo(LoteVacas, { foreignKey: 'loteVacasId', as: 'loteVacas' });

// ---------------------------------------------------------------------------
// Usuarios <-> Clientes (1:1 opcional, igual que OneToOneField en Django)
// ---------------------------------------------------------------------------
Usuario.hasOne(Cliente, { foreignKey: { name: 'usuarioId', allowNull: true }, as: 'clienteInfo', onDelete: 'CASCADE' });
Cliente.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// ---------------------------------------------------------------------------
// Ventas
// ---------------------------------------------------------------------------
Cliente.hasMany(Venta, { foreignKey: { name: 'clienteId', allowNull: true }, as: 'ventas', onDelete: 'SET NULL' });
Venta.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });

Venta.hasMany(VentaDetalle, { foreignKey: { name: 'ventaId', allowNull: false }, as: 'detalles', onDelete: 'CASCADE' });
VentaDetalle.belongsTo(Venta, { foreignKey: 'ventaId', as: 'venta' });

Producto.hasMany(VentaDetalle, { foreignKey: { name: 'productoId', allowNull: true }, as: 'ventaDetalles', onDelete: 'SET NULL' });
VentaDetalle.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });

LoteCerdos.hasMany(VentaDetalle, { foreignKey: { name: 'loteCerdosId', allowNull: true }, as: 'ventaDetalles', onDelete: 'SET NULL' });
VentaDetalle.belongsTo(LoteCerdos, { foreignKey: 'loteCerdosId', as: 'loteCerdos' });

LoteVacas.hasMany(VentaDetalle, { foreignKey: { name: 'loteVacasId', allowNull: true }, as: 'ventaDetalles', onDelete: 'SET NULL' });
VentaDetalle.belongsTo(LoteVacas, { foreignKey: 'loteVacasId', as: 'loteVacas' });

// ---------------------------------------------------------------------------
// Carrito
// ---------------------------------------------------------------------------
Cliente.hasMany(Carrito, { foreignKey: { name: 'clienteId', allowNull: false }, as: 'carritos', onDelete: 'CASCADE' });
Carrito.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });

Carrito.hasMany(CarritoItem, { foreignKey: { name: 'carritoId', allowNull: false }, as: 'items', onDelete: 'CASCADE' });
CarritoItem.belongsTo(Carrito, { foreignKey: 'carritoId', as: 'carrito' });

Producto.hasMany(CarritoItem, { foreignKey: { name: 'productoId', allowNull: true }, as: 'carritoItems', onDelete: 'SET NULL' });
CarritoItem.belongsTo(Producto, { foreignKey: 'productoId', as: 'producto' });

LoteCerdos.hasMany(CarritoItem, { foreignKey: { name: 'loteCerdosId', allowNull: true }, as: 'carritoItems', onDelete: 'SET NULL' });
CarritoItem.belongsTo(LoteCerdos, { foreignKey: 'loteCerdosId', as: 'loteCerdos' });

LoteVacas.hasMany(CarritoItem, { foreignKey: { name: 'loteVacasId', allowNull: true }, as: 'carritoItems', onDelete: 'SET NULL' });
CarritoItem.belongsTo(LoteVacas, { foreignKey: 'loteVacasId', as: 'loteVacas' });

module.exports = {
  sequelize,
  Usuario,
  LoteCerdos,
  RegistroPesoCerdos,
  RegistroSaludCerdos,
  LoteVacas,
  RegistroPesoVacas,
  RegistroSaludVacas,
  Proveedor,
  Producto,
  OrdenCompra,
  ConsumoAlimento,
  Transaccion,
  Cliente,
  Venta,
  VentaDetalle,
  Carrito,
  CarritoItem,
};

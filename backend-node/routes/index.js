/**
 * routes/index.js
 * Agregador de rutas, equivalente al `router = routers.DefaultRouter()` y
 * los `router.register(...)` de backend/urls.py. `cultivos` se elimina y se
 * agrega `lotes-vacas` para el nuevo modulo de ganado bovino.
 */
const { Router } = require('express');

const authRoutes = require('./authRoutes');
const usuarioRoutes = require('./usuarioRoutes');
const porcinoRoutes = require('./porcinoRoutes');
const vacunoRoutes = require('./vacunoRoutes');
const productoRoutes = require('./productoRoutes');
const proveedorRoutes = require('./proveedorRoutes');
const ordenCompraRoutes = require('./ordenCompraRoutes');
const consumoAlimentoRoutes = require('./consumoAlimentoRoutes');
const finanzaRoutes = require('./finanzaRoutes');
const ventaRoutes = require('./ventaRoutes');
const carritoRoutes = require('./carritoRoutes');
const clienteRoutes = require('./clienteRoutes');
const propiedadRoutes = require('./propiedadRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/lotes-cerdos', porcinoRoutes);
router.use('/lotes-vacas', vacunoRoutes);
router.use('/productos', productoRoutes);
router.use('/proveedores', proveedorRoutes);
router.use('/ordenes-compra', ordenCompraRoutes);
router.use('/consumos-alimento', consumoAlimentoRoutes);
router.use('/transacciones', finanzaRoutes);
router.use('/ventas', ventaRoutes);
router.use('/carritos', carritoRoutes);
router.use('/clientes', clienteRoutes);
router.use('/propiedad', propiedadRoutes);

module.exports = router;

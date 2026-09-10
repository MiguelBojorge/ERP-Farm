/**
 * routes/index.js
 * Agregador de rutas, equivalente al `router = routers.DefaultRouter()` y
 * los `router.register(...)` de backend/urls.py. `cultivos` se elimina y se
 * agrega `lotes-vacas` para el nuevo modulo de ganado bovino.
 *
 * Seguridad: unicamente /auth/login y /auth/refresh son publicas. Todo lo demas
 * pasa por `acceso(...)` (sesion JWT + rol) y por la verificacion CSRF.
 */
const { Router } = require('express');

const { csrfProtection } = require('../middleware/csrf');
const { acceso, ADMIN } = require('../middleware/permissions');

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

router.use(csrfProtection);

router.use('/auth', authRoutes);

// Gestion de usuarios: exclusivo de administradores.
router.use('/usuarios', acceso({ lectura: ADMIN, escritura: ADMIN, borrado: ADMIN }), usuarioRoutes);

// Modulos operativos: ADMIN y EMPLEADO leen/escriben; solo ADMIN elimina.
router.use('/lotes-cerdos', acceso(), porcinoRoutes);
router.use('/lotes-vacas', acceso(), vacunoRoutes);
router.use('/productos', acceso(), productoRoutes);
router.use('/proveedores', acceso(), proveedorRoutes);
router.use('/ordenes-compra', acceso(), ordenCompraRoutes);
router.use('/consumos-alimento', acceso(), consumoAlimentoRoutes);
router.use('/transacciones', acceso(), finanzaRoutes);
router.use('/ventas', acceso(), ventaRoutes);
router.use('/carritos', acceso(), carritoRoutes);
router.use('/clientes', acceso(), clienteRoutes);
router.use('/propiedad', acceso(), propiedadRoutes);

module.exports = router;

/**
 * routes/ventaRoutes.js
 * Migrado de ventas/views.py::VentaViewSet. AllowAny (ver nota de permisos
 * en routes/usuarioRoutes.js) — asi lo consume pages/Ventas.js.
 */
const { Router } = require('express');
const ventaController = require('../controllers/ventaController');

const router = Router();

router.get('/', ventaController.listar);
router.get('/:id', ventaController.obtener);
router.post('/', ventaController.crear);
router.get('/:id/factura', ventaController.descargarFactura);

module.exports = router;

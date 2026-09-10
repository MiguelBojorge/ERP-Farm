/**
 * routes/ventaRoutes.js
 * Migrado de ventas/views.py::VentaViewSet.
 * El acceso (sesion JWT + rol) se aplica al montar este router en routes/index.js.
 */
const { Router } = require('express');
const validateIdParam = require('../middleware/validateId');
const ventaController = require('../controllers/ventaController');

const router = Router();
router.param('id', validateIdParam);

router.get('/', ventaController.listar);
router.get('/:id', ventaController.obtener);
router.post('/', ventaController.crear);
router.get('/:id/factura', ventaController.descargarFactura);

module.exports = router;

/**
 * routes/ordenCompraRoutes.js
 * Migrado de inventario/views.py::OrdenCompraViewSet. AllowAny (ver nota de
 * permisos en routes/usuarioRoutes.js).
 */
const { Router } = require('express');
const ordenCompraController = require('../controllers/ordenCompraController');

const router = Router();

router.get('/', ordenCompraController.listar);
router.get('/:id', ordenCompraController.obtener);
router.post('/', ordenCompraController.crear);
router.patch('/:id', ordenCompraController.actualizar);
router.delete('/:id', ordenCompraController.eliminar);

module.exports = router;

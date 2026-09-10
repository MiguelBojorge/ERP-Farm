/**
 * routes/productoRoutes.js
 * Migrado de inventario/views.py::ProductoViewSet. AllowAny (ver nota de
 * permisos en routes/usuarioRoutes.js).
 */
const { Router } = require('express');
const inventarioController = require('../controllers/inventarioController');

const router = Router();

router.get('/', inventarioController.listar);
router.get('/:id', inventarioController.obtener);
router.post('/', inventarioController.crear);
router.patch('/:id', inventarioController.actualizar);
router.delete('/:id', inventarioController.eliminar);

module.exports = router;

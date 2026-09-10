/**
 * routes/clienteRoutes.js
 * Migrado de ventas/views.py::ClienteViewSet. AllowAny (ver nota de
 * permisos en routes/usuarioRoutes.js).
 */
const { Router } = require('express');
const clienteController = require('../controllers/clienteController');

const router = Router();

router.get('/', clienteController.listar);
router.get('/:id', clienteController.obtener);
router.post('/', clienteController.crear);
router.patch('/:id', clienteController.actualizar);
router.delete('/:id', clienteController.eliminar);

module.exports = router;

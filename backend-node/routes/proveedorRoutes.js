/**
 * routes/proveedorRoutes.js
 * Migrado de inventario/views.py::ProveedorViewSet. AllowAny (ver nota de
 * permisos en routes/usuarioRoutes.js).
 */
const { Router } = require('express');
const proveedorController = require('../controllers/proveedorController');

const router = Router();

router.get('/', proveedorController.listar);
router.get('/:id', proveedorController.obtener);
router.post('/', proveedorController.crear);
router.patch('/:id', proveedorController.actualizar);
router.delete('/:id', proveedorController.eliminar);

module.exports = router;

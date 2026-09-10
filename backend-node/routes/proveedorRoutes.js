/**
 * routes/proveedorRoutes.js
 * Migrado de inventario/views.py::ProveedorViewSet.
 * El acceso (sesion JWT + rol) se aplica al montar este router en routes/index.js.
 */
const { Router } = require('express');
const validateIdParam = require('../middleware/validateId');
const proveedorController = require('../controllers/proveedorController');

const router = Router();
router.param('id', validateIdParam);

router.get('/', proveedorController.listar);
router.get('/:id', proveedorController.obtener);
router.post('/', proveedorController.crear);
router.patch('/:id', proveedorController.actualizar);
router.delete('/:id', proveedorController.eliminar);

module.exports = router;

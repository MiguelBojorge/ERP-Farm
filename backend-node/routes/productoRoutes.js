/**
 * routes/productoRoutes.js
 * Migrado de inventario/views.py::ProductoViewSet.
 * El acceso (sesion JWT + rol) se aplica al montar este router en routes/index.js.
 */
const { Router } = require('express');
const validateIdParam = require('../middleware/validateId');
const inventarioController = require('../controllers/inventarioController');

const router = Router();
router.param('id', validateIdParam);

router.get('/', inventarioController.listar);
router.get('/:id', inventarioController.obtener);
router.post('/', inventarioController.crear);
router.patch('/:id', inventarioController.actualizar);
router.delete('/:id', inventarioController.eliminar);

module.exports = router;

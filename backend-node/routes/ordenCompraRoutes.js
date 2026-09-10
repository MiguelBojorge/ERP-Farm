/**
 * routes/ordenCompraRoutes.js
 * Migrado de inventario/views.py::OrdenCompraViewSet.
 * El acceso (sesion JWT + rol) se aplica al montar este router en routes/index.js.
 */
const { Router } = require('express');
const validateIdParam = require('../middleware/validateId');
const ordenCompraController = require('../controllers/ordenCompraController');

const router = Router();
router.param('id', validateIdParam);

router.get('/', ordenCompraController.listar);
router.get('/:id', ordenCompraController.obtener);
router.post('/', ordenCompraController.crear);
router.patch('/:id', ordenCompraController.actualizar);
router.delete('/:id', ordenCompraController.eliminar);

module.exports = router;

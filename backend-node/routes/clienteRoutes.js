/**
 * routes/clienteRoutes.js
 * Migrado de ventas/views.py::ClienteViewSet.
 * El acceso (sesion JWT + rol) se aplica al montar este router en routes/index.js.
 */
const { Router } = require('express');
const validateIdParam = require('../middleware/validateId');
const clienteController = require('../controllers/clienteController');

const router = Router();
router.param('id', validateIdParam);

router.get('/', clienteController.listar);
router.get('/:id', clienteController.obtener);
router.post('/', clienteController.crear);
router.patch('/:id', clienteController.actualizar);
router.delete('/:id', clienteController.eliminar);

module.exports = router;

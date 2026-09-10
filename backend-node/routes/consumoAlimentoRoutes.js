/**
 * routes/consumoAlimentoRoutes.js
 * Migrado de inventario/views.py::ConsumoAlimentoViewSet.
 * El acceso (sesion JWT + rol) se aplica al montar este router en routes/index.js.
 */
const { Router } = require('express');
const validateIdParam = require('../middleware/validateId');
const consumoAlimentoController = require('../controllers/consumoAlimentoController');

const router = Router();
router.param('id', validateIdParam);

router.get('/', consumoAlimentoController.listar);
router.get('/:id', consumoAlimentoController.obtener);
router.post('/', consumoAlimentoController.crear);

module.exports = router;

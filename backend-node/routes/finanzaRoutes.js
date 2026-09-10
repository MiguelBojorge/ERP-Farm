/**
 * routes/finanzaRoutes.js
 * Migrado de finanzas/views.py::TransaccionViewSet.
 * El acceso (sesion JWT + rol) se aplica al montar este router en routes/index.js.
 */
const { Router } = require('express');
const validateIdParam = require('../middleware/validateId');
const finanzaController = require('../controllers/finanzaController');

const router = Router();
router.param('id', validateIdParam);

router.get('/', finanzaController.listar);
router.get('/balance', finanzaController.balance);
router.get('/:id', finanzaController.obtener);
router.post('/', finanzaController.crear);

module.exports = router;

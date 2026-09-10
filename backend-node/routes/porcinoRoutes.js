/**
 * routes/porcinoRoutes.js
 * Migrado del router 'lotes-cerdos' de backend/urls.py.
 * El acceso (sesion JWT + rol) se aplica al montar este router en routes/index.js.
 */
const { Router } = require('express');
const validateIdParam = require('../middleware/validateId');
const porcinoController = require('../controllers/porcinoController');

const router = Router();
router.param('id', validateIdParam);

router.get('/', porcinoController.listar);
router.get('/:id', porcinoController.obtener);
router.post('/', porcinoController.crear);
router.patch('/:id', porcinoController.actualizar);
router.delete('/:id', porcinoController.eliminar);

router.post('/:id/pesos', porcinoController.registrarPeso);
router.post('/:id/salud', porcinoController.registrarSalud);

module.exports = router;

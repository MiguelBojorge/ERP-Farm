/**
 * routes/vacunoRoutes.js
 * El acceso (sesion JWT + rol) se aplica al montar este router en routes/index.js.
 */
const { Router } = require('express');
const validateIdParam = require('../middleware/validateId');
const vacunoController = require('../controllers/vacunoController');

const router = Router();
router.param('id', validateIdParam);

router.get('/', vacunoController.listar);
router.get('/:id', vacunoController.obtener);
router.post('/', vacunoController.crear);
router.patch('/:id', vacunoController.actualizar);
router.delete('/:id', vacunoController.eliminar);

router.post('/:id/pesos', vacunoController.registrarPeso);
router.post('/:id/salud', vacunoController.registrarSalud);

module.exports = router;

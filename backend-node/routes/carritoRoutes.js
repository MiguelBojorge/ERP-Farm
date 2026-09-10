/**
 * routes/carritoRoutes.js
 * El acceso (sesion JWT + rol) se aplica al montar este router en routes/index.js.
 */
const { Router } = require('express');
const validateIdParam = require('../middleware/validateId');
const carritoController = require('../controllers/carritoController');

const router = Router();
router.param('id', validateIdParam);

router.get('/', carritoController.listar);
router.get('/:id', carritoController.obtener);
router.post('/', carritoController.crear);
router.post('/:id/items', carritoController.agregarItem);
router.delete('/:id', carritoController.eliminar);

module.exports = router;

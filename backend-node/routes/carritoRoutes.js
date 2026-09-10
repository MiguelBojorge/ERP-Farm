/**
 * routes/carritoRoutes.js
 * Ver nota en controllers/carritoController.js: en Django este recurso
 * existia sin ruta registrada; aqui se expone en /api/carritos, AllowAny
 * por consistencia con el resto del API (ver nota de permisos en
 * routes/usuarioRoutes.js).
 */
const { Router } = require('express');
const carritoController = require('../controllers/carritoController');

const router = Router();

router.get('/', carritoController.listar);
router.get('/:id', carritoController.obtener);
router.post('/', carritoController.crear);
router.post('/:id/items', carritoController.agregarItem);
router.delete('/:id', carritoController.eliminar);

module.exports = router;

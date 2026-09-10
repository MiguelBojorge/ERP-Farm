/**
 * routes/consumoAlimentoRoutes.js
 * Migrado de inventario/views.py::ConsumoAlimentoViewSet. AllowAny (ver
 * nota de permisos en routes/usuarioRoutes.js).
 */
const { Router } = require('express');
const consumoAlimentoController = require('../controllers/consumoAlimentoController');

const router = Router();

router.get('/', consumoAlimentoController.listar);
router.get('/:id', consumoAlimentoController.obtener);
router.post('/', consumoAlimentoController.crear);

module.exports = router;

/**
 * routes/finanzaRoutes.js
 * Migrado de finanzas/views.py::TransaccionViewSet. AllowAny (ver nota de
 * permisos en routes/usuarioRoutes.js).
 */
const { Router } = require('express');
const finanzaController = require('../controllers/finanzaController');

const router = Router();

router.get('/', finanzaController.listar);
router.get('/balance', finanzaController.balance);
router.get('/:id', finanzaController.obtener);
router.post('/', finanzaController.crear);

module.exports = router;

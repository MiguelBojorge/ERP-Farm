/**
 * routes/porcinoRoutes.js
 * Migrado del router 'lotes-cerdos' de backend/urls.py.
 * AllowAny en todas las acciones, igual que LoteCerdosViewSet original
 * (ver nota de permisos en routes/usuarioRoutes.js).
 */
const { Router } = require('express');
const porcinoController = require('../controllers/porcinoController');

const router = Router();

router.get('/', porcinoController.listar);
router.get('/:id', porcinoController.obtener);
router.post('/', porcinoController.crear);
router.patch('/:id', porcinoController.actualizar);
router.delete('/:id', porcinoController.eliminar);

router.post('/:id/pesos', porcinoController.registrarPeso);
router.post('/:id/salud', porcinoController.registrarSalud);

module.exports = router;

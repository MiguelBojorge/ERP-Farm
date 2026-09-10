/**
 * routes/vacunoRoutes.js
 * Modulo NUEVO: gestion de ganado bovino (vacas), en reemplazo del antiguo
 * router 'cultivos' de backend/urls.py (agricultura, eliminado). AllowAny
 * en todas las acciones, por consistencia con el resto del API (ver nota de
 * permisos en routes/usuarioRoutes.js).
 */
const { Router } = require('express');
const vacunoController = require('../controllers/vacunoController');

const router = Router();

router.get('/', vacunoController.listar);
router.get('/:id', vacunoController.obtener);
router.post('/', vacunoController.crear);
router.patch('/:id', vacunoController.actualizar);
router.delete('/:id', vacunoController.eliminar);

router.post('/:id/pesos', vacunoController.registrarPeso);
router.post('/:id/salud', vacunoController.registrarSalud);

module.exports = router;

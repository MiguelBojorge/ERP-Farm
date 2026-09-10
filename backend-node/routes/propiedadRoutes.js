/**
 * routes/propiedadRoutes.js
 * Panel de resumen de la finca (nuevo, no existia en Django). AllowAny,
 * igual que el resto del API — ver nota de permisos en
 * routes/usuarioRoutes.js (el frontend actual no tiene pantalla de login).
 */
const { Router } = require('express');
const propiedadController = require('../controllers/propiedadController');

const router = Router();

router.get('/resumen', propiedadController.resumen);

module.exports = router;

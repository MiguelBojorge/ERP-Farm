/**
 * routes/propiedadRoutes.js
 * Panel de resumen de la finca (nuevo, no existia en Django).
 * El acceso (sesion JWT + rol) se aplica al montar este router en routes/index.js.
 */
const { Router } = require('express');
const propiedadController = require('../controllers/propiedadController');

const router = Router();

router.get('/resumen', propiedadController.resumen);

module.exports = router;

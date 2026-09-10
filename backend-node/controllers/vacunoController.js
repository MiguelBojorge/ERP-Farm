/**
 * controllers/vacunoController.js
 * Modulo NUEVO: gestion de lotes de ganado bovino (vacas), en reemplazo del
 * antiguo CultivoViewSet (agricultura) de granja/views.py.
 */
const { LoteVacas, RegistroPesoVacas, RegistroSaludVacas } = require('../models');
const crearControladorGanado = require('./factories/ganadoControllerFactory');

const includeHistorial = [
  { association: 'historialPesos' },
  { association: 'registrosSalud' },
];

module.exports = crearControladorGanado('VACA', {
  loteModel: LoteVacas,
  includeHistorial,
});

module.exports.models = { LoteVacas, RegistroPesoVacas, RegistroSaludVacas };

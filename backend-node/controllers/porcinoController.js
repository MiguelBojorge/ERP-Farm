/**
 * controllers/porcinoController.js
 * Migrado de granja/views.py (LoteCerdosViewSet, RegistroSaludViewSet).
 */
const { LoteCerdos, RegistroPesoCerdos, RegistroSaludCerdos } = require('../models');
const crearControladorGanado = require('./factories/ganadoControllerFactory');

const includeHistorial = [
  { association: 'historialPesos' },
  { association: 'registrosSalud' },
];

module.exports = crearControladorGanado('CERDO', {
  loteModel: LoteCerdos,
  includeHistorial,
});

// Se re-exportan por si algun consumidor necesita los modelos directamente.
module.exports.models = { LoteCerdos, RegistroPesoCerdos, RegistroSaludCerdos };

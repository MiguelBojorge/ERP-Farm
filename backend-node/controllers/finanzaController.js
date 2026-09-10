/**
 * controllers/finanzaController.js
 * Migrado de finanzas/views.py::TransaccionViewSet.
 */
const asyncHandler = require('../helpers/asyncHandler');
const { ok, created } = require('../helpers/apiResponse');
const { Transaccion } = require('../models');
const FinanceService = require('../src/services/financeService');

const financeService = new FinanceService();

const listar = asyncHandler(async (req, res) => {
  const transacciones = await Transaccion.findAll({ order: [['fecha', 'DESC'], ['id', 'DESC']] });
  ok(res, transacciones);
});

const obtener = asyncHandler(async (req, res) => {
  const transaccion = await Transaccion.findByPk(req.params.id);
  if (!transaccion) return res.status(404).json({ detail: 'Transaccion no encontrada.' });
  return ok(res, transaccion);
});

/**
 * Alta manual de una transaccion (ingreso/egreso administrativo no
 * asociado automaticamente a un lote, consumo o venta).
 */
const crear = asyncHandler(async (req, res) => {
  const { tipo, descripcion, monto } = req.body;
  const transaccion =
    tipo === 'INGRESO'
      ? await financeService.registrarIngreso(descripcion, monto)
      : await financeService.registrarEgreso(descripcion, monto);
  return created(res, transaccion);
});

const balance = asyncHandler(async (req, res) => ok(res, await financeService.calcularBalance()));

module.exports = { listar, obtener, crear, balance };

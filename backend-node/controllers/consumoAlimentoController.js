/**
 * controllers/consumoAlimentoController.js
 * Migrado de inventario/views.py::ConsumoAlimentoViewSet, delegando la
 * logica de negocio (descuento de stock + registro financiero) a
 * InventoryService en vez de un signal implicito post_save.
 */
const asyncHandler = require('../helpers/asyncHandler');
const { ok, created } = require('../helpers/apiResponse');
const { ConsumoAlimento } = require('../models');
const InventoryService = require('../src/services/inventoryService');

const inventoryService = new InventoryService();

const includeDetalle = [
  { association: 'alimento' },
  { association: 'loteCerdos' },
  { association: 'loteVacas' },
];

const listar = asyncHandler(async (req, res) => {
  const consumos = await ConsumoAlimento.findAll({ include: includeDetalle, order: [['id', 'DESC']] });
  ok(res, consumos);
});

const obtener = asyncHandler(async (req, res) => {
  const consumo = await ConsumoAlimento.findByPk(req.params.id, { include: includeDetalle });
  if (!consumo) return res.status(404).json({ detail: 'Consumo no encontrado.' });
  return ok(res, consumo);
});

const crear = asyncHandler(async (req, res) => {
  const consumo = await inventoryService.registrarConsumoAlimento(req.body);
  return created(res, consumo);
});

module.exports = { listar, obtener, crear };

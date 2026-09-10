/**
 * controllers/ordenCompraController.js
 * Migrado de inventario/views.py::OrdenCompraViewSet.
 */
const asyncHandler = require('../helpers/asyncHandler');
const { ok, created, noContent } = require('../helpers/apiResponse');
const { OrdenCompra } = require('../models');

const listar = asyncHandler(async (req, res) => {
  const ordenes = await OrdenCompra.findAll({ include: [{ association: 'proveedor' }], order: [['id', 'DESC']] });
  ok(res, ordenes);
});

const obtener = asyncHandler(async (req, res) => {
  const orden = await OrdenCompra.findByPk(req.params.id, { include: [{ association: 'proveedor' }] });
  if (!orden) return res.status(404).json({ detail: 'Orden de compra no encontrada.' });
  return ok(res, orden);
});

const crear = asyncHandler(async (req, res) => created(res, await OrdenCompra.create(req.body)));

const actualizar = asyncHandler(async (req, res) => {
  const orden = await OrdenCompra.findByPk(req.params.id);
  if (!orden) return res.status(404).json({ detail: 'Orden de compra no encontrada.' });
  await orden.update(req.body);
  return ok(res, orden);
});

const eliminar = asyncHandler(async (req, res) => {
  const orden = await OrdenCompra.findByPk(req.params.id);
  if (!orden) return res.status(404).json({ detail: 'Orden de compra no encontrada.' });
  await orden.destroy();
  return noContent(res);
});

module.exports = { listar, obtener, crear, actualizar, eliminar };

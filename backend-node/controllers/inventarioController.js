/**
 * controllers/inventarioController.js
 * Migrado de inventario/views.py::ProductoViewSet.
 */
const asyncHandler = require('../helpers/asyncHandler');
const { ok, created, noContent } = require('../helpers/apiResponse');
const { Producto } = require('../models');

const listar = asyncHandler(async (req, res) => {
  const productos = await Producto.findAll({ include: [{ association: 'proveedor' }], order: [['nombre', 'ASC']] });
  ok(res, productos);
});

const obtener = asyncHandler(async (req, res) => {
  const producto = await Producto.findByPk(req.params.id, { include: [{ association: 'proveedor' }] });
  if (!producto) return res.status(404).json({ detail: 'Producto no encontrado.' });
  return ok(res, producto);
});

const crear = asyncHandler(async (req, res) => created(res, await Producto.create(req.body)));

const actualizar = asyncHandler(async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.status(404).json({ detail: 'Producto no encontrado.' });
  await producto.update(req.body);
  return ok(res, producto);
});

const eliminar = asyncHandler(async (req, res) => {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.status(404).json({ detail: 'Producto no encontrado.' });
  await producto.destroy();
  return noContent(res);
});

module.exports = { listar, obtener, crear, actualizar, eliminar };

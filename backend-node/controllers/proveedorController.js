/**
 * controllers/proveedorController.js
 * Migrado de inventario/views.py::ProveedorViewSet.
 */
const asyncHandler = require('../helpers/asyncHandler');
const { ok, created, noContent } = require('../helpers/apiResponse');
const { Proveedor } = require('../models');

const listar = asyncHandler(async (req, res) => ok(res, await Proveedor.findAll({ order: [['nombre', 'ASC']] })));

const obtener = asyncHandler(async (req, res) => {
  const proveedor = await Proveedor.findByPk(req.params.id);
  if (!proveedor) return res.status(404).json({ detail: 'Proveedor no encontrado.' });
  return ok(res, proveedor);
});

const crear = asyncHandler(async (req, res) => created(res, await Proveedor.create(req.body)));

const actualizar = asyncHandler(async (req, res) => {
  const proveedor = await Proveedor.findByPk(req.params.id);
  if (!proveedor) return res.status(404).json({ detail: 'Proveedor no encontrado.' });
  await proveedor.update(req.body);
  return ok(res, proveedor);
});

const eliminar = asyncHandler(async (req, res) => {
  const proveedor = await Proveedor.findByPk(req.params.id);
  if (!proveedor) return res.status(404).json({ detail: 'Proveedor no encontrado.' });
  await proveedor.destroy();
  return noContent(res);
});

module.exports = { listar, obtener, crear, actualizar, eliminar };

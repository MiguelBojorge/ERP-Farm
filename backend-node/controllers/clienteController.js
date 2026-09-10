/**
 * controllers/clienteController.js
 * Migrado de ventas/views.py::ClienteViewSet.
 */
const asyncHandler = require('../helpers/asyncHandler');
const { ok, created, noContent } = require('../helpers/apiResponse');
const { Cliente } = require('../models');

const listar = asyncHandler(async (req, res) => ok(res, await Cliente.findAll({ order: [['nombre', 'ASC']] })));

const obtener = asyncHandler(async (req, res) => {
  const cliente = await Cliente.findByPk(req.params.id);
  if (!cliente) return res.status(404).json({ detail: 'Cliente no encontrado.' });
  return ok(res, cliente);
});

const crear = asyncHandler(async (req, res) => created(res, await Cliente.create(req.body)));

const actualizar = asyncHandler(async (req, res) => {
  const cliente = await Cliente.findByPk(req.params.id);
  if (!cliente) return res.status(404).json({ detail: 'Cliente no encontrado.' });
  await cliente.update(req.body);
  return ok(res, cliente);
});

const eliminar = asyncHandler(async (req, res) => {
  const cliente = await Cliente.findByPk(req.params.id);
  if (!cliente) return res.status(404).json({ detail: 'Cliente no encontrado.' });
  await cliente.destroy();
  return noContent(res);
});

module.exports = { listar, obtener, crear, actualizar, eliminar };

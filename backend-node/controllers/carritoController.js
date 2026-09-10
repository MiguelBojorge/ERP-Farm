/**
 * controllers/carritoController.js
 * Migrado de ventas/views.py::CarritoViewSet.
 * NOTA: en el proyecto Django original este ViewSet existia pero no estaba
 * registrado en el router de urls.py (quedaba inaccesible). Aqui se expone
 * correctamente en routes/ventaRoutes.js.
 */
const asyncHandler = require('../helpers/asyncHandler');
const { ok, created, noContent } = require('../helpers/apiResponse');
const { Carrito, CarritoItem } = require('../models');

const includeCarrito = [
  {
    association: 'items',
    include: [{ association: 'producto' }, { association: 'loteCerdos' }, { association: 'loteVacas' }],
  },
];

const listar = asyncHandler(async (req, res) => ok(res, await Carrito.findAll({ include: includeCarrito })));

const obtener = asyncHandler(async (req, res) => {
  const carrito = await Carrito.findByPk(req.params.id, { include: includeCarrito });
  if (!carrito) return res.status(404).json({ detail: 'Carrito no encontrado.' });
  return ok(res, carrito);
});

const crear = asyncHandler(async (req, res) => created(res, await Carrito.create(req.body)));

const agregarItem = asyncHandler(async (req, res) => {
  const carrito = await Carrito.findByPk(req.params.id);
  if (!carrito) return res.status(404).json({ detail: 'Carrito no encontrado.' });
  const item = await CarritoItem.create({ ...req.body, carritoId: carrito.id });
  return created(res, item);
});

const eliminar = asyncHandler(async (req, res) => {
  const carrito = await Carrito.findByPk(req.params.id);
  if (!carrito) return res.status(404).json({ detail: 'Carrito no encontrado.' });
  await carrito.destroy();
  return noContent(res);
});

module.exports = { listar, obtener, crear, agregarItem, eliminar };

/**
 * controllers/ventaController.js
 * Migrado de ventas/views.py::VentaViewSet (incluye download_factura).
 */
const asyncHandler = require('../helpers/asyncHandler');
const { ok } = require('../helpers/apiResponse');
const { Venta } = require('../models');
const SalesService = require('../src/services/salesService');
const { generarFacturaPdf } = require('../helpers/facturaPdfHelper');

const salesService = new SalesService();

const includeVentaCompleta = [
  { association: 'cliente' },
  {
    association: 'detalles',
    include: [
      { association: 'producto' },
      { association: 'loteCerdos' },
      { association: 'loteVacas' },
    ],
  },
];

const listar = asyncHandler(async (req, res) => {
  const ventas = await Venta.findAll({ include: includeVentaCompleta, order: [['fecha', 'DESC']] });
  ok(res, ventas);
});

const obtener = asyncHandler(async (req, res) => {
  const venta = await Venta.findByPk(req.params.id, { include: includeVentaCompleta });
  if (!venta) return res.status(404).json({ detail: 'Venta no encontrada.' });
  return ok(res, venta);
});

/** Migrado de VentaSerializer.create(): delega todo en SalesService.procesar_venta. */
const crear = asyncHandler(async (req, res) => {
  const venta = await salesService.procesarVenta(req.body);
  return res.status(201).json(venta);
});

/** Migrado de VentaViewSet.download_factura (@action detail=True). */
const descargarFactura = asyncHandler(async (req, res) => {
  const venta = await Venta.findByPk(req.params.id, { include: includeVentaCompleta });
  if (!venta) return res.status(404).json({ detail: 'Venta no encontrada.' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="factura_${venta.id}.pdf"`);
  const doc = generarFacturaPdf(venta);
  doc.pipe(res);
});

module.exports = { listar, obtener, crear, descargarFactura };

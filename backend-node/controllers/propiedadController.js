/**
 * controllers/propiedadController.js
 * Vista consolidada de la propiedad/finca: conteos de ganado (vacas y
 * cerdos), alertas de inventario y balance financiero. No existia un
 * recurso equivalente en el backend Django original; se incorpora como
 * panel de resumen del ERP, coherente con la arquitectura de referencia
 * (que reserva un controlador dedicado a "propiedad").
 */
const { Op, literal } = require('sequelize');
const asyncHandler = require('../helpers/asyncHandler');
const { LoteCerdos, LoteVacas, Producto } = require('../models');
const FinanceService = require('../src/services/financeService');

const financeService = new FinanceService();

// Sequelize no permite comparar dos columnas directamente sin `col`/`literal`.
const STOCK_BAJO_WHERE = { cantidad: { [Op.lt]: literal('stock_minimo') } };

const resumen = asyncHandler(async (req, res) => {
  const [totalLotesCerdos, cerdosActivos, totalLotesVacas, vacasActivas, productosBajoStock, balance] = await Promise.all([
    LoteCerdos.count(),
    LoteCerdos.sum('cantidadActual'),
    LoteVacas.count(),
    LoteVacas.sum('cantidadActual'),
    Producto.findAll({ where: STOCK_BAJO_WHERE }),
    financeService.calcularBalance(),
  ]);

  res.json({
    porcinos: {
      lotes: totalLotesCerdos,
      cantidadActual: Number(cerdosActivos || 0),
    },
    bovinos: {
      lotes: totalLotesVacas,
      cantidadActual: Number(vacasActivas || 0),
    },
    inventario: {
      productosBajoStock: productosBajoStock.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        cantidad: p.cantidad,
        stockMinimo: p.stockMinimo,
      })),
    },
    finanzas: balance,
  });
});

module.exports = { resumen };

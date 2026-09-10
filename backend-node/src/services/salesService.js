/**
 * src/services/salesService.js
 * Migrado de ventas/services.py::SalesService (+ ventas/signals.py).
 *
 * SRP: maneja el ciclo de vida completo de una venta.
 * OCP: extensible a nuevos tipos de items vendibles (hoy: producto,
 * lote de cerdos, lote de vacas — antes tambien "cultivo", eliminado).
 *
 * CORRECCION DE BUG respecto al original: en el codigo Django, el descuento
 * de stock se ejecutaba DOS VECES para el mismo detalle de venta — una vez
 * en `SalesService._actualizar_stock_item` y otra vez en el signal
 * `ventas/signals.py::procesar_venta_detalle` (ambos escuchan la misma
 * creacion de VentaDetalle). Aqui existe un unico punto de descuento de
 * stock, dentro de esta clase, evitando el doble descuento.
 */
const { sequelize, Venta, VentaDetalle, Producto, LoteCerdos, LoteVacas } = require('../../models');
const FinanceService = require('./financeService');

class SalesService {
  constructor(financeService) {
    this.financeService = financeService || new FinanceService();
  }

  /**
   * Crea una venta con sus detalles, descuenta stock del item vendido y
   * registra el ingreso en finanzas. Todo dentro de una unica transaccion.
   *
   * @param {{clienteId?: number, metodoPago?: string, detalles: Array<object>}} datosVenta
   */
  async procesarVenta({ clienteId, metodoPago = 'EFECTIVO', detalles = [] }) {
    if (!Array.isArray(detalles) || detalles.length === 0) {
      const err = new Error('La venta debe incluir al menos un detalle.');
      err.status = 422;
      throw err;
    }

    return sequelize.transaction(async (transaction) => {
      // 1. Crear la venta principal (total se calcula al final)
      const venta = await Venta.create(
        { clienteId: clienteId || null, metodoPago, pagado: true, total: 0 },
        { transaction }
      );

      let totalVenta = 0;

      for (const detalleData of detalles) {
        const detalle = await VentaDetalle.create(
          { ...detalleData, ventaId: venta.id },
          { transaction }
        );
        totalVenta += Number(detalle.subtotal);

        // eslint-disable-next-line no-await-in-loop
        await this._descontarStock(detalle, transaction);
      }

      // 2. Actualizar total de la venta
      await venta.update({ total: totalVenta }, { transaction });

      // 3. Registrar en finanzas (DIP)
      await this.financeService.registrarIngreso(
        `Venta #${venta.id}`,
        totalVenta,
        { transaction }
      );

      return venta.reload({
        include: [{ association: 'detalles' }, { association: 'cliente' }],
        transaction,
      });
    });
  }

  /**
   * Determina como actualizar el stock segun el tipo de item vendido.
   * LSP: todos los items vendibles se tratan con una logica de "reduccion".
   */
  async _descontarStock(detalle, transaction) {
    if (detalle.productoId) {
      const producto = await Producto.findByPk(detalle.productoId, { transaction, lock: transaction.LOCK.UPDATE });
      const nuevaCantidad = Math.max(0, producto.cantidad - Math.trunc(detalle.cantidad));
      await producto.update({ cantidad: nuevaCantidad }, { transaction });
      return;
    }
    if (detalle.loteCerdosId) {
      const lote = await LoteCerdos.findByPk(detalle.loteCerdosId, { transaction, lock: transaction.LOCK.UPDATE });
      const nuevaCantidad = Math.max(0, lote.cantidadActual - Math.trunc(detalle.cantidad));
      await lote.update({ cantidadActual: nuevaCantidad }, { transaction });
      return;
    }
    if (detalle.loteVacasId) {
      const lote = await LoteVacas.findByPk(detalle.loteVacasId, { transaction, lock: transaction.LOCK.UPDATE });
      const nuevaCantidad = Math.max(0, lote.cantidadActual - Math.trunc(detalle.cantidad));
      await lote.update({ cantidadActual: nuevaCantidad }, { transaction });
    }
  }
}

module.exports = SalesService;

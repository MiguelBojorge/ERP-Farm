/**
 * src/services/inventoryService.js
 * Migrado de inventario/services.py::InventoryService (+ inventario/signals.py).
 *
 * SRP: logica de negocio exclusiva de inventario.
 * DIP: se comunica con finanzas a traves de FinanceService.
 *
 * MEJORA: en Django esto se disparaba desde un signal post_save sobre
 * ConsumoAlimento. Aqui se invoca explicitamente desde el controlador al
 * crear el consumo, dentro de una transaccion (stock y egreso financiero
 * se confirman o revierten juntos).
 */
const { sequelize, Producto, ConsumoAlimento, LoteCerdos, LoteVacas } = require('../../models');
const FinanceService = require('./financeService');

class InventoryService {
  constructor(financeService) {
    this.financeService = financeService || new FinanceService();
  }

  /**
   * Registra un consumo de alimento para un lote (cerdos o vacas):
   * 1) descuenta stock del producto consumido,
   * 2) notifica a finanzas (egreso), desacoplado vía FinanceService.
   */
  async registrarConsumoAlimento(datosConsumo) {
    const { alimentoId, loteCerdosId, loteVacasId, cantidad, montoTotal, fecha } = datosConsumo;

    return sequelize.transaction(async (transaction) => {
      const producto = await Producto.findByPk(alimentoId, { transaction, lock: transaction.LOCK.UPDATE });
      if (!producto) {
        const err = new Error('Producto de alimento no encontrado.');
        err.status = 404;
        throw err;
      }
      if (producto.categoria !== 'ALIMENTO') {
        const err = new Error('El producto seleccionado no pertenece a la categoria ALIMENTO.');
        err.status = 422;
        throw err;
      }

      let lote;
      if (loteCerdosId) {
        lote = await LoteCerdos.findByPk(loteCerdosId, { transaction });
      } else if (loteVacasId) {
        lote = await LoteVacas.findByPk(loteVacasId, { transaction });
      }
      if (!lote) {
        const err = new Error('Debe indicar un lote de cerdos o de vacas valido.');
        err.status = 422;
        throw err;
      }

      const consumo = await ConsumoAlimento.create(
        { alimentoId, loteCerdosId: loteCerdosId || null, loteVacasId: loteVacasId || null, cantidad, montoTotal, ...(fecha ? { fecha } : {}) },
        { transaction }
      );

      // 1. Actualizacion de stock (logica de inventario)
      const nuevaCantidad = Math.max(0, producto.cantidad - Math.trunc(cantidad));
      await producto.update({ cantidad: nuevaCantidad }, { transaction });

      // 2. Notificar a finanzas (desacoplado)
      const especieEtiqueta = loteCerdosId ? 'cerdos' : 'vacas';
      await this.financeService.registrarEgreso(
        `Consumo alimento (${especieEtiqueta}): ${lote.idBatch}`,
        montoTotal,
        { transaction }
      );

      return consumo;
    });
  }
}

module.exports = InventoryService;

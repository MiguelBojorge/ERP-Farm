/**
 * src/services/financeService.js
 * Migrado de finanzas/services.py::FinanceService.
 *
 * SRP: unica responsable de coordinar acciones financieras (ingresos/egresos).
 * DIP: recibe un repositorio por inyeccion de dependencias; si no se provee
 * usa el repositorio Sequelize por defecto.
 */
const { Transaccion } = require('../../models');
const { SequelizeFinanceRepository } = require('../repositories/FinanceRepository');

class FinanceService {
  constructor(repository) {
    this.repository = repository || new SequelizeFinanceRepository({ Transaccion });
  }

  /** Coordina el registro de una salida de dinero (compra, inversion, consumo). */
  async registrarEgreso(descripcion, monto, opciones = {}) {
    return this.repository.registrarTransaccion('EGRESO', descripcion, monto, opciones);
  }

  /** Coordina el registro de una entrada de dinero (venta). */
  async registrarIngreso(descripcion, monto, opciones = {}) {
    return this.repository.registrarTransaccion('INGRESO', descripcion, monto, opciones);
  }

  /** Balance simple ingresos - egresos, usado por el resumen de propiedad. */
  async calcularBalance() {
    const [ingresos, egresos] = await Promise.all([
      Transaccion.sum('monto', { where: { tipo: 'INGRESO' } }),
      Transaccion.sum('monto', { where: { tipo: 'EGRESO' } }),
    ]);
    return {
      ingresos: Number(ingresos || 0),
      egresos: Number(egresos || 0),
      balance: Number(ingresos || 0) - Number(egresos || 0),
    };
  }
}

module.exports = FinanceService;

/**
 * src/repositories/FinanceRepository.js
 * Migrado de finanzas/interfaces.py (IFinanceRepository, ABC) y
 * finanzas/repositories.py (DjangoFinanceRepository).
 *
 * DIP (Dependency Inversion Principle): el servicio de negocio depende de
 * esta abstraccion, no de Sequelize directamente. Si en el futuro se cambia
 * de motor de persistencia (u otra API externa de contabilidad), solo hace
 * falta escribir otro repositorio que cumpla el mismo contrato.
 */
class IFinanceRepository {
  // eslint-disable-next-line no-unused-vars
  async registrarTransaccion(tipo, descripcion, monto, opciones) {
    throw new Error('registrarTransaccion() debe ser implementado por la subclase.');
  }
}

/**
 * Implementacion concreta (adaptador) usando Sequelize/MySQL.
 */
class SequelizeFinanceRepository extends IFinanceRepository {
  constructor({ Transaccion }) {
    super();
    this.Transaccion = Transaccion;
  }

  async registrarTransaccion(tipo, descripcion, monto, opciones = {}) {
    return this.Transaccion.create(
      { tipo, descripcion, monto },
      { transaction: opciones.transaction }
    );
  }
}

module.exports = { IFinanceRepository, SequelizeFinanceRepository };

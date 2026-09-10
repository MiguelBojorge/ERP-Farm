/**
 * src/services/ganadoService.js
 * Migrado y unificado de la logica que en Django vivia repartida entre
 * granja/models.py y finanzas/signals.py (registrar_inversion_lote).
 *
 * MEJORA sobre el original: en Django, crear un LoteCerdos disparaba un
 * signal `post_save` que registraba automaticamente el egreso en finanzas.
 * Esa "magia" implicita es dificil de rastrear y de testear. Aqui la misma
 * garantia (toda alta de lote con costo inicial > 0 genera su egreso) se
 * expresa de forma EXPLICITA en un metodo de servicio, ejecutado dentro de
 * una transaccion de base de datos: si falla el registro financiero, la
 * creacion del lote tambien se revierte (atomicidad), algo que Django no
 * garantizaba con signals post_save.
 *
 * SRP/DIP: este servicio coordina "granja" (cerdos y vacas) y delega en
 * FinanceService todo lo relacionado a dinero, igual que hacia el codigo
 * original.
 */
const { sequelize, LoteCerdos, RegistroPesoCerdos, RegistroSaludCerdos, LoteVacas, RegistroPesoVacas, RegistroSaludVacas } = require('../../models');
const FinanceService = require('./financeService');

const ESPECIES = {
  CERDO: {
    loteModel: LoteCerdos,
    pesoModel: RegistroPesoCerdos,
    saludModel: RegistroSaludCerdos,
    etiqueta: 'porcinos',
  },
  VACA: {
    loteModel: LoteVacas,
    pesoModel: RegistroPesoVacas,
    saludModel: RegistroSaludVacas,
    etiqueta: 'bovinos',
  },
};

class GanadoService {
  constructor(financeService) {
    this.financeService = financeService || new FinanceService();
  }

  _config(especie) {
    const config = ESPECIES[especie];
    if (!config) {
      throw new Error(`Especie no soportada: ${especie}. Use 'CERDO' o 'VACA'.`);
    }
    return config;
  }

  /**
   * Crea un lote (cerdos o vacas) y, si trae costo inicial, registra
   * automaticamente el egreso en finanzas dentro de la misma transaccion.
   */
  async crearLote(especie, datosLote) {
    const { loteModel, etiqueta } = this._config(especie);

    return sequelize.transaction(async (transaction) => {
      const lote = await loteModel.create(datosLote, { transaction });

      if (lote.costoInicial && Number(lote.costoInicial) > 0) {
        await this.financeService.registrarEgreso(
          `Inversion inicial: Lote ${lote.idBatch} (${lote.raza}) - ${etiqueta}`,
          lote.costoInicial,
          { transaction }
        );
      }

      return lote;
    });
  }

  async registrarPeso(especie, loteId, peso, fecha) {
    const { loteModel, pesoModel } = this._config(especie);
    const lote = await loteModel.findByPk(loteId);
    if (!lote) {
      const err = new Error('Lote no encontrado.');
      err.status = 404;
      throw err;
    }

    return sequelize.transaction(async (transaction) => {
      const registro = await pesoModel.create(
        { loteId, peso, ...(fecha ? { fecha } : {}) },
        { transaction }
      );
      // Reflejar el ultimo pesaje como peso actual del lote.
      await lote.update({ pesoActual: peso }, { transaction });
      return registro;
    });
  }

  async registrarSalud(especie, loteId, datosSalud) {
    const { loteModel, saludModel } = this._config(especie);
    const lote = await loteModel.findByPk(loteId);
    if (!lote) {
      const err = new Error('Lote no encontrado.');
      err.status = 404;
      throw err;
    }
    return saludModel.create({ ...datosSalud, loteId });
  }
}

GanadoService.ESPECIES = Object.keys(ESPECIES);

module.exports = GanadoService;

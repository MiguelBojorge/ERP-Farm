/**
 * models/ConsumoAlimento.js — migrado de inventario/models.py::ConsumoAlimento
 *
 * MEJORA sobre el original: en Django, ConsumoAlimento solo podia asociarse a
 * `granja.LoteCerdos`. Como el dominio ahora incluye vacas, se agregan dos
 * FKs opcionales (loteCerdosId / loteVacasId) validando que se use
 * exactamente una, en vez de duplicar el modelo completo por especie.
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class ConsumoAlimento extends Model {}

ConsumoAlimento.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cantidad: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: 'Cantidad consumida (sacos/kilos)',
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    montoTotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      comment: 'Costo de este consumo para finanzas',
    },
  },
  {
    sequelize,
    modelName: 'ConsumoAlimento',
    tableName: 'consumos_alimento',
    updatedAt: false,
    validate: {
      exactamenteUnLote() {
        const asociados = [this.loteCerdosId, this.loteVacasId].filter(
          (v) => v != null
        );
        if (asociados.length !== 1) {
          throw new Error(
            'Un consumo de alimento debe pertenecer exactamente a un lote (cerdos o vacas).'
          );
        }
      },
    },
  }
);

module.exports = ConsumoAlimento;

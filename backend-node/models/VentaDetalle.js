/**
 * models/VentaDetalle.js — migrado de ventas/models.py::VentaDetalle
 *
 * Una venta puede ser de un producto de inventario, un lote de cerdos o un
 * lote de vacas (antes tambien podia ser un `cultivo`, que se elimina por
 * quedar fuera del dominio agropecuario de vacas y cerdos).
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class VentaDetalle extends Model {}

VentaDetalle.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cantidad: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: 'Kilos o unidades, segun el tipo de item vendido',
    },
    precioUnitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
  },
  {
    sequelize,
    modelName: 'VentaDetalle',
    tableName: 'venta_detalles',
    timestamps: false,
    hooks: {
      // Equivalente al override de save() en Django: subtotal siempre derivado.
      beforeValidate: (detalle) => {
        if (detalle.cantidad != null && detalle.precioUnitario != null) {
          detalle.subtotal = Number(detalle.cantidad) * Number(detalle.precioUnitario);
        }
      },
    },
    validate: {
      exactamenteUnItem() {
        const asociados = [
          this.productoId,
          this.loteCerdosId,
          this.loteVacasId,
        ].filter((v) => v != null);
        if (asociados.length !== 1) {
          throw new Error(
            'Un detalle de venta debe referenciar exactamente un item: producto, lote de cerdos o lote de vacas.'
          );
        }
      },
    },
  }
);

module.exports = VentaDetalle;

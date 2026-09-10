/**
 * models/Venta.js — migrado de ventas/models.py::Venta
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

const METODOS_PAGO = ['EFECTIVO', 'TRANSFERENCIA', 'OTRO'];

class Venta extends Model {}

Venta.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    metodoPago: {
      type: DataTypes.ENUM(...METODOS_PAGO),
      allowNull: false,
      defaultValue: 'EFECTIVO',
    },
    pagado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    sequelize,
    modelName: 'Venta',
    tableName: 'ventas',
    updatedAt: false,
  }
);

Venta.METODOS_PAGO = METODOS_PAGO;

module.exports = Venta;

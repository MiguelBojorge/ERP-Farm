/**
 * models/CarritoItem.js — migrado de ventas/models.py::CarritoItem
 * (cultivo reemplazado por loteVacas, ver VentaDetalle.js)
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class CarritoItem extends Model {}

CarritoItem.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cantidad: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    sequelize,
    modelName: 'CarritoItem',
    tableName: 'carrito_items',
    timestamps: false,
  }
);

module.exports = CarritoItem;

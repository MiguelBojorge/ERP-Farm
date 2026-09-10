/**
 * models/Carrito.js — migrado de ventas/models.py::Carrito
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Carrito extends Model {}

Carrito.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    creadoEn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Carrito',
    tableName: 'carritos',
    updatedAt: false,
  }
);

module.exports = Carrito;

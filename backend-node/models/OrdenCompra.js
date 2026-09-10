/**
 * models/OrdenCompra.js — migrado de inventario/models.py::OrdenCompra
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

const ESTADOS_ORDEN = ['PENDIENTE', 'RECIBIDO', 'CANCELADO'];

class OrdenCompra extends Model {}

OrdenCompra.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fechaPedido: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    totalEstimado: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    estado: {
      type: DataTypes.ENUM(...ESTADOS_ORDEN),
      allowNull: false,
      defaultValue: 'PENDIENTE',
    },
    detalles: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Lista de productos y cantidades',
    },
  },
  {
    sequelize,
    modelName: 'OrdenCompra',
    tableName: 'ordenes_compra',
  }
);

OrdenCompra.ESTADOS = ESTADOS_ORDEN;

module.exports = OrdenCompra;

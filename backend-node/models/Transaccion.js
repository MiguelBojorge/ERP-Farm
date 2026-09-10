/**
 * models/Transaccion.js — migrado de finanzas/models.py::Transaccion
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

const TIPOS = ['INGRESO', 'EGRESO'];

class Transaccion extends Model {}

Transaccion.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tipo: {
      type: DataTypes.ENUM(...TIPOS),
      allowNull: false,
    },
    descripcion: { type: DataTypes.STRING(200), allowNull: false },
    monto: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Transaccion',
    tableName: 'transacciones',
    updatedAt: false,
  }
);

Transaccion.TIPOS = TIPOS;

module.exports = Transaccion;

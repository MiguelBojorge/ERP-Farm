/**
 * models/Proveedor.js — migrado de inventario/models.py::Proveedor
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Proveedor extends Model {}

Proveedor.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    contacto: { type: DataTypes.STRING(100), allowNull: true },
    telefono: { type: DataTypes.STRING(20), allowNull: true },
    email: { type: DataTypes.STRING(254), allowNull: true, validate: { isEmail: true } },
  },
  {
    sequelize,
    modelName: 'Proveedor',
    tableName: 'proveedores',
  }
);

module.exports = Proveedor;

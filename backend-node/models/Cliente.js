/**
 * models/Cliente.js — migrado de ventas/models.py::Cliente
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Cliente extends Model {}

Cliente.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    telefono: { type: DataTypes.STRING(20), allowNull: false },
    email: { type: DataTypes.STRING(254), allowNull: true, validate: { isEmail: true } },
    direccion: { type: DataTypes.TEXT, allowNull: true },
    // usuarioId (opcional, 1:1 con Usuario) agregado vía asociación
  },
  {
    sequelize,
    modelName: 'Cliente',
    tableName: 'clientes',
  }
);

module.exports = Cliente;

/**
 * models/RegistroPesoCerdos.js
 * Migrado de granja/models.py::RegistroPeso, asociado a LoteCerdos.
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class RegistroPesoCerdos extends Model {}

RegistroPesoCerdos.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    peso: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: 'Peso registrado en esta fecha (kg)',
    },
  },
  {
    sequelize,
    modelName: 'RegistroPesoCerdos',
    tableName: 'registros_peso_cerdos',
    updatedAt: false,
  }
);

module.exports = RegistroPesoCerdos;

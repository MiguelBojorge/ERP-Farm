/**
 * models/RegistroPesoVacas.js
 * Historial de pesajes de un lote de vacas (analogo a RegistroPesoCerdos).
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class RegistroPesoVacas extends Model {}

RegistroPesoVacas.init(
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
    modelName: 'RegistroPesoVacas',
    tableName: 'registros_peso_vacas',
    updatedAt: false,
  }
);

module.exports = RegistroPesoVacas;

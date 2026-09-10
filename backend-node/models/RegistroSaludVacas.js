/**
 * models/RegistroSaludVacas.js
 * Historial sanitario de un lote de vacas (analogo a RegistroSaludCerdos).
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class RegistroSaludVacas extends Model {}

RegistroSaludVacas.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    descripcion: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Ej: Vacuna contra fiebre aftosa',
    },
    tratamiento: { type: DataTypes.TEXT, allowNull: false },
    responsable: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    sequelize,
    modelName: 'RegistroSaludVacas',
    tableName: 'registros_salud_vacas',
    updatedAt: false,
  }
);

module.exports = RegistroSaludVacas;

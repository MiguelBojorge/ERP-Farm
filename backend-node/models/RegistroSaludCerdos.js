/**
 * models/RegistroSaludCerdos.js
 * Migrado de granja/models.py::RegistroSalud, asociado a LoteCerdos.
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class RegistroSaludCerdos extends Model {}

RegistroSaludCerdos.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    descripcion: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: 'Ej: Vacuna contra parvovirus',
    },
    tratamiento: { type: DataTypes.TEXT, allowNull: false },
    responsable: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    sequelize,
    modelName: 'RegistroSaludCerdos',
    tableName: 'registros_salud_cerdos',
    updatedAt: false,
  }
);

module.exports = RegistroSaludCerdos;

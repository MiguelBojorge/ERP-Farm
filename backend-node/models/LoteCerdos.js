/**
 * models/LoteCerdos.js
 * Migrado de granja/models.py::LoteCerdos (Django). Sin cambios de dominio,
 * solo de capa/lenguaje: representa un lote (grupo) de cerdos gestionado
 * como una unidad productiva.
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

const ESTADOS_CERDOS = [
  'SALUDABLE',
  'OBSERVACION',
  'REVISION',
  'ENGORDE',
  'CRIA',
  'DESTETE',
];

class LoteCerdos extends Model {}

LoteCerdos.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idBatch: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'ID de Lote',
    },
    fechaEntrada: { type: DataTypes.DATEONLY, allowNull: false },
    cantidadInicial: { type: DataTypes.INTEGER, allowNull: false },
    cantidadActual: { type: DataTypes.INTEGER, allowNull: false },
    pesoPromedioInicial: {
      type: DataTypes.FLOAT,
      allowNull: false,
      comment: 'Peso en kg al entrar',
    },
    pesoActual: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      comment: 'Peso promedio actual en kg',
    },
    costoInicial: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      comment: 'C$ invertidos inicialmente',
    },
    raza: { type: DataTypes.STRING(100), allowNull: false },
    estado: {
      type: DataTypes.ENUM(...ESTADOS_CERDOS),
      allowNull: false,
      defaultValue: 'SALUDABLE',
    },
    edadInicialSemanas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Semanas de vida al entrar al lote',
    },
    ubicacion: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Corral A-1',
      comment: 'Ubicacion/Corral',
    },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    modelName: 'LoteCerdos',
    tableName: 'lotes_cerdos',
  }
);

LoteCerdos.ESTADOS = ESTADOS_CERDOS;

module.exports = LoteCerdos;

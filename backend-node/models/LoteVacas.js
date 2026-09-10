/**
 * models/LoteVacas.js
 * Modulo NUEVO de ganado bovino (vacas), agregado para completar el dominio
 * "vacas y cerdos" del ERP. Espeja la estructura de LoteCerdos manteniendo
 * la simetria arquitectonica entre ambas especies, pero incorpora los campos
 * propios de ganaderia bovina (proposito zootecnico y produccion de leche)
 * que no aplican a porcinos.
 *
 * Sustituye por completo al antiguo modelo `Cultivo` (agricultura), que se
 * elimina del dominio del negocio.
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

const ESTADOS_VACAS = [
  'SALUDABLE',
  'OBSERVACION',
  'REVISION',
  'ENGORDE',
  'CRIA',
  'LACTANCIA',
  'SECA', // periodo seco previo al parto, propio de ganado lechero
  'DESTETE',
];

const PROPOSITOS = ['LECHE', 'CARNE', 'DOBLE_PROPOSITO'];

class LoteVacas extends Model {}

LoteVacas.init(
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
    proposito: {
      type: DataTypes.ENUM(...PROPOSITOS),
      allowNull: false,
      defaultValue: 'DOBLE_PROPOSITO',
      comment: 'Orientacion zootecnica del lote',
    },
    produccionLecheLitrosDia: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Promedio de litros/dia cuando el lote esta en LACTANCIA',
    },
    estado: {
      type: DataTypes.ENUM(...ESTADOS_VACAS),
      allowNull: false,
      defaultValue: 'SALUDABLE',
    },
    edadInicialMeses: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Meses de vida al entrar al lote',
    },
    ubicacion: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Potrero 1',
      comment: 'Ubicacion/Potrero',
    },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    modelName: 'LoteVacas',
    tableName: 'lotes_vacas',
    validate: {
      produccionSoloSiAplica() {
        if (
          this.produccionLecheLitrosDia != null &&
          this.proposito === 'CARNE'
        ) {
          throw new Error(
            'Un lote con proposito CARNE no debe registrar produccion de leche.'
          );
        }
      },
    },
  }
);

LoteVacas.ESTADOS = ESTADOS_VACAS;
LoteVacas.PROPOSITOS = PROPOSITOS;

module.exports = LoteVacas;

/**
 * models/Producto.js — migrado de inventario/models.py::Producto
 * Insumos del ERP: alimento, medicina, herramientas y otros, usados tanto
 * por el modulo de cerdos como por el nuevo modulo de vacas.
 */
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

const CATEGORIAS = ['ALIMENTO', 'MEDICINA', 'HERRAMIENTA', 'OTROS'];

class Producto extends Model {
  get bajoStock() {
    return this.cantidad < this.stockMinimo;
  }
}

Producto.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    categoria: {
      type: DataTypes.ENUM(...CATEGORIAS),
      allowNull: false,
    },
    cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    stockMinimo: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5 },
    precioUnitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    fechaIngreso: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    // proveedorId agregado vía asociación en models/index.js
  },
  {
    sequelize,
    modelName: 'Producto',
    tableName: 'productos',
  }
);

Producto.CATEGORIAS = CATEGORIAS;

module.exports = Producto;

/**
 * models/Usuario.js
 * Equivalente a usuarios/models.py (Usuario extends AbstractUser en Django).
 * Roles del ERP: ADMIN, EMPLEADO, CLIENTE.
 */
const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const env = require('../config/env');

const ROLES = ['ADMIN', 'EMPLEADO', 'CLIENTE'];

class Usuario extends Model {
  /** Compara una contraseña en texto plano contra el hash almacenado. */
  async checkPassword(rawPassword) {
    return bcrypt.compare(rawPassword, this.password);
  }

  /** true si el hash guardado usa un costo menor al configurado (se re-hashea al iniciar sesion). */
  needsRehash() {
    return bcrypt.getRounds(this.password) < env.security.bcryptRounds;
  }

  /** Representación segura para respuestas de API (nunca exponer el hash). */
  toPublicJSON() {
    const { password, ...safe } = this.toJSON();
    return safe;
  }
}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING(254),
      allowNull: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: '',
    },
    lastName: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: '',
    },
    rol: {
      type: DataTypes.ENUM(...ROLES),
      allowNull: false,
      defaultValue: 'CLIENTE',
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    direccion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isStaff: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isSuperuser: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    hooks: {
      // Equivalente a Usuario.objects.create_user(): nunca persistir texto plano.
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          usuario.password = await bcrypt.hash(usuario.password, env.security.bcryptRounds);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password')) {
          usuario.password = await bcrypt.hash(usuario.password, env.security.bcryptRounds);
        }
      },
    },
  }
);

Usuario.ROLES = ROLES;

module.exports = Usuario;

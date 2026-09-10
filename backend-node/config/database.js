/**
 * config/database.js
 * Instancia única de Sequelize (dialecto mysql2). Toda la capa de persistencia
 * (models/) depende de este módulo; los servicios y controladores nunca
 * abren conexiones propias.
 */
const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: env.db.logging ? console.log : false,
  define: {
    underscored: true, // columnas snake_case en la BD, camelCase en el código
    timestamps: true,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

async function testConnection() {
  await sequelize.authenticate();
}

module.exports = { sequelize, testConnection };

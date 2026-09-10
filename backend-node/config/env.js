/**
 * config/env.js
 * Punto único de lectura y validación de variables de entorno.
 * Ninguna otra capa del sistema debe leer `process.env` directamente:
 * así garantizamos que la configuración esté centralizada (capa de configuración
 * separada de la lógica de negocio y de persistencia).
 */
require('dotenv').config();

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Falta la variable de entorno requerida: ${name}`);
  }
  return value;
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),

  db: {
    host: required('DB_HOST', 'localhost'),
    port: parseInt(process.env.DB_PORT || '3306', 10),
    name: required('DB_NAME', 'finca_la_primavera'),
    user: required('DB_USER', 'root'),
    password: process.env.DB_PASSWORD || '',
    logging: process.env.DB_LOGGING === 'true',
  },

  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET', 'dev-access-secret'),
    refreshSecret: required('JWT_REFRESH_SECRET', 'dev-refresh-secret'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};

module.exports = env;

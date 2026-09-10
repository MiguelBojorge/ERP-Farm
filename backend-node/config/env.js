/**
 * config/env.js
 * Punto único de lectura y validación de variables de entorno.
 * Ninguna otra capa del sistema debe leer `process.env` directamente:
 * así garantizamos que la configuración esté centralizada (capa de configuración
 * separada de la lógica de negocio y de persistencia).
 */
require('dotenv').config();
const crypto = require('crypto');

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Falta la variable de entorno requerida: ${name}`);
  }
  return value;
}

function int(name, fallback) {
  const parsed = parseInt(process.env[name] || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
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
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '30m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  security: {
    // Costo de bcrypt (2^N iteraciones). 12 es el minimo recomendado hoy.
    bcryptRounds: int('BCRYPT_ROUNDS', 12),
    // Secreto para firmar los tokens CSRF. Si no se define, se deriva del secreto JWT.
    csrfSecret:
      process.env.CSRF_SECRET ||
      crypto
        .createHash('sha256')
        .update(`csrf:${process.env.JWT_ACCESS_SECRET || 'dev-access-secret'}`)
        .digest('hex'),
    csrfTtlMs: int('CSRF_TTL_MINUTES', 480) * 60 * 1000,
    // Fuerza bruta: intentos de login fallidos permitidos por IP+usuario en la ventana.
    loginMaxAttempts: int('LOGIN_MAX_ATTEMPTS', 5),
    loginWindowMs: int('LOGIN_WINDOW_MINUTES', 15) * 60 * 1000,
    // Tope general de peticiones por IP.
    apiMaxRequests: int('API_MAX_REQUESTS_PER_MINUTE', 300),
  },

  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};

// En produccion no se permite arrancar con secretos por defecto o debiles.
if (env.nodeEnv === 'production') {
  const weak = (secret) => !secret || secret.length < 32 || /^(dev-|change)/i.test(secret);
  if (weak(env.jwt.accessSecret) || weak(env.jwt.refreshSecret)) {
    throw new Error('JWT_ACCESS_SECRET y JWT_REFRESH_SECRET deben ser aleatorios y de al menos 32 caracteres en produccion.');
  }
  if (env.jwt.accessSecret === env.jwt.refreshSecret) {
    throw new Error('JWT_ACCESS_SECRET y JWT_REFRESH_SECRET deben ser distintos.');
  }
}

module.exports = env;

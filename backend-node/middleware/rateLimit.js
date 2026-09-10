/**
 * middleware/rateLimit.js
 * Limitadores de peticiones (mitigan fuerza bruta y abuso).
 * Contadores en memoria: suficiente para un solo proceso; con varias
 * instancias habria que moverlos a un almacen compartido (p. ej. Redis).
 */
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const env = require('../config/env');

/** Tope general por IP para toda la API. */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: env.security.apiMaxRequests,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { detail: 'Demasiadas peticiones. Intente de nuevo en un momento.' },
});

/**
 * Login y refresh: se cuenta por IP + usuario, y solo los intentos fallidos
 * (un login correcto no consume cupo).
 */
const loginLimiter = rateLimit({
  windowMs: env.security.loginWindowMs,
  limit: env.security.loginMaxAttempts,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    const username = typeof req.body?.username === 'string' ? req.body.username.toLowerCase() : '';
    return `${ipKeyGenerator(req.ip)}|${username}`;
  },
  message: { detail: 'Demasiados intentos fallidos. Espere unos minutos antes de volver a intentar.' },
});

module.exports = { apiLimiter, loginLimiter };

/**
 * middleware/auth.js
 * Migrado de REST_FRAMEWORK.DEFAULT_AUTHENTICATION_CLASSES
 * (rest_framework_simplejwt.authentication.JWTAuthentication).
 */
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { Usuario } = require('../models');

/** Exige un access token JWT valido en el header Authorization: Bearer <token>. */
async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ detail: 'Se requiere autenticacion (Bearer token).' });
  }

  try {
    const payload = jwt.verify(token, env.jwt.accessSecret);
    if (payload.type !== 'access') throw new Error('Tipo de token incorrecto');
    const usuario = await Usuario.findByPk(payload.id);
    if (!usuario || !usuario.isActive) {
      return res.status(401).json({ detail: 'Usuario no encontrado o inactivo.' });
    }
    req.user = usuario;
    return next();
  } catch (error) {
    return res.status(401).json({ detail: 'Token invalido o expirado.' });
  }
}

/**
 * Version "opcional": no bloquea si no hay token, pero adjunta req.user si
 * el token es valido. Util para el endpoint publico api_root, etc.
 */
async function attachUserIfPresent(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return next();

  try {
    const payload = jwt.verify(token, env.jwt.accessSecret);
    if (payload.type === 'access') {
      const usuario = await Usuario.findByPk(payload.id);
      if (usuario && usuario.isActive) req.user = usuario;
    }
  } catch (error) {
    // Token invalido en modo opcional: se ignora y continua sin usuario.
  }
  return next();
}

module.exports = { requireAuth, attachUserIfPresent };

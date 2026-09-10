/**
 * middleware/csrf.js
 * Proteccion CSRF mediante token firmado (HMAC-SHA256) ligado al usuario.
 *
 * Flujo:
 *   1. El login (y GET /api/auth/csrf) devuelven un `csrf_token`.
 *   2. El frontend lo envia en el header `X-CSRF-Token` en cada peticion que
 *      modifica datos (POST/PUT/PATCH/DELETE).
 *   3. Aqui se verifica la firma, la vigencia y que el token pertenezca al
 *      usuario autenticado en esa peticion.
 *
 * Nota: la sesion viaja en el header Authorization (Bearer), no en cookies,
 * por lo que el navegador nunca la adjunta solo y el CSRF clasico ya es
 * dificil. Este token es una segunda barrera (defensa en profundidad) y deja
 * el sistema listo si algun dia la sesion pasa a cookies.
 *
 * /auth/login y /auth/refresh quedan fuera: no usan credenciales ambientales,
 * las credenciales viajan en el cuerpo de la peticion.
 */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const EXEMPT_PATHS = new Set(['/auth/login', '/auth/refresh']);

function firmar(userId, nonce, expiraEn) {
  return crypto
    .createHmac('sha256', env.security.csrfSecret)
    .update(`${userId}|${nonce}|${expiraEn}`)
    .digest('hex');
}

/** Genera un token CSRF para el usuario indicado. */
function generarToken(userId) {
  const nonce = crypto.randomBytes(16).toString('hex');
  const expiraEn = Date.now() + env.security.csrfTtlMs;
  return `${nonce}.${expiraEn}.${firmar(userId, nonce, expiraEn)}`;
}

/** Verifica firma, vigencia y pertenencia del token. Comparacion en tiempo constante. */
function tokenValido(token, userId) {
  if (typeof token !== 'string') return false;
  const partes = token.split('.');
  if (partes.length !== 3) return false;
  const [nonce, expiraEn, firma] = partes;
  if (!/^[0-9a-f]{32}$/.test(nonce) || !/^\d+$/.test(expiraEn)) return false;
  if (Number(expiraEn) < Date.now()) return false;

  const esperada = Buffer.from(firmar(userId, nonce, expiraEn));
  const recibida = Buffer.from(String(firma));
  return esperada.length === recibida.length && crypto.timingSafeEqual(esperada, recibida);
}

/** Identifica al usuario a partir del Bearer token (sin tocar la BD). */
function usuarioDelRequest(req) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  try {
    return jwt.verify(token, env.jwt.accessSecret).id;
  } catch (error) {
    return null;
  }
}

function csrfProtection(req, res, next) {
  if (SAFE_METHODS.has(req.method) || EXEMPT_PATHS.has(req.path)) return next();

  const userId = usuarioDelRequest(req);
  // Sin sesion valida no hay nada que proteger: requireAuth respondera 401.
  if (userId === null) return next();

  if (!tokenValido(req.get('x-csrf-token'), userId)) {
    return res.status(403).json({ detail: 'Token CSRF invalido o ausente.' });
  }
  return next();
}

module.exports = { csrfProtection, generarToken, tokenValido };

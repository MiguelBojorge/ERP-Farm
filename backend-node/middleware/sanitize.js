/**
 * middleware/sanitize.js
 * Higiene de la entrada antes de que llegue a controladores y modelos.
 *
 * Contra inyeccion: Sequelize ya envia los valores como parametros
 * (consultas preparadas), asi que un valor nunca se interpreta como SQL. Esta
 * capa agrega lo que las consultas parametrizadas no cubren:
 *   - bloquea claves peligrosas (__proto__, constructor, prototype) que
 *     permitirian contaminar prototipos al procesar el cuerpo;
 *   - quita del cuerpo los campos que el cliente nunca debe fijar
 *     (id, createdAt, updatedAt), evitando sobrescrituras por mass assignment;
 *   - elimina bytes nulos y limita la profundidad de los objetos anidados.
 */
const CLAVES_PROHIBIDAS = new Set(['__proto__', 'constructor', 'prototype']);
const CAMPOS_DEL_SERVIDOR = new Set(['id', 'createdAt', 'updatedAt', 'created_at', 'updated_at']);
const PROFUNDIDAD_MAXIMA = 8;

function limpiar(valor, profundidad = 0) {
  if (profundidad > PROFUNDIDAD_MAXIMA) {
    const err = new Error('Estructura de datos demasiado anidada.');
    err.status = 400;
    throw err;
  }
  if (typeof valor === 'string') return valor.replace(/\0/g, '');
  if (Array.isArray(valor)) return valor.map((item) => limpiar(item, profundidad + 1));
  if (valor && typeof valor === 'object') {
    const salida = {};
    for (const [clave, contenido] of Object.entries(valor)) {
      if (CLAVES_PROHIBIDAS.has(clave)) continue;
      salida[clave] = limpiar(contenido, profundidad + 1);
    }
    return salida;
  }
  return valor;
}

function sanitizeInput(req, res, next) {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = limpiar(req.body);
      if (!Array.isArray(req.body)) {
        CAMPOS_DEL_SERVIDOR.forEach((campo) => delete req.body[campo]);
      }
    }
    if (req.query && typeof req.query === 'object') {
      // En Express 4 req.query es una propiedad normal y puede reasignarse.
      req.query = limpiar(req.query);
    }
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = sanitizeInput;

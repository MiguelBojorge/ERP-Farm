/**
 * middleware/permissions.js
 * Control de acceso por modulo: exige sesion valida (JWT) y luego verifica el
 * rol segun el tipo de operacion HTTP.
 *
 *   lectura   -> GET / HEAD / OPTIONS
 *   escritura -> POST / PUT / PATCH
 *   borrado   -> DELETE
 *
 * Por defecto: ADMIN y EMPLEADO leen y escriben; solo ADMIN borra. El rol
 * CLIENTE no tiene acceso a los modulos del ERP.
 */
const { requireAuth } = require('./auth');
const { requireRole } = require('./roleCheck');

const ADMIN = ['ADMIN'];
const PERSONAL = ['ADMIN', 'EMPLEADO'];

function acceso({ lectura = PERSONAL, escritura = PERSONAL, borrado = ADMIN } = {}) {
  const verificadores = {
    lectura: requireRole(...lectura),
    escritura: requireRole(...escritura),
    borrado: requireRole(...borrado),
  };

  const porMetodo = (req, res, next) => {
    if (req.method === 'DELETE') return verificadores.borrado(req, res, next);
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return verificadores.lectura(req, res, next);
    return verificadores.escritura(req, res, next);
  };

  return [requireAuth, porMetodo];
}

module.exports = { acceso, ADMIN, PERSONAL };

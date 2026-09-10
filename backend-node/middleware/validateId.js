/**
 * middleware/validateId.js
 * Garantiza que todo parametro :id sea un entero positivo antes de tocar la
 * base de datos. Uso en cada router: router.param('id', validateIdParam)
 */
function validateIdParam(req, res, next, value) {
  if (!/^[1-9]\d{0,9}$/.test(value)) {
    return res.status(400).json({ detail: 'Identificador invalido.' });
  }
  return next();
}

module.exports = validateIdParam;

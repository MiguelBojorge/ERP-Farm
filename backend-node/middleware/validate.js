/**
 * middleware/validate.js
 * Migrado de la capa de validacion de DRF (serializers). Se apoya en
 * express-validator: cada ruta declara sus reglas (`body/param(...)`) y este
 * middleware centraliza la respuesta de error, coherente en todo el sistema.
 */
const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ detail: 'Datos invalidos.', errores: errors.array() });
  }
  return next();
}

module.exports = validate;

/**
 * helpers/caseTransform.js
 *
 * Puente de compatibilidad entre el backend (camelCase, idiomatico en
 * JS/Sequelize: idBatch, cantidadActual...) y el frontend React ya
 * existente, escrito originalmente contra las respuestas snake_case de
 * Django REST Framework (id_batch, cantidad_actual...).
 *
 * En vez de reescribir cada componente del frontend para usar camelCase,
 * se transforma automaticamente en el borde HTTP: lo que entra (req.body)
 * se convierte de snake_case a camelCase antes de llegar a los
 * controladores/servicios; lo que sale (res.json) se convierte de vuelta a
 * snake_case antes de llegar al navegador. Ver middleware/caseTransform.js.
 */

function camelToSnake(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function snakeToCamel(str) {
  return str.replace(/_([a-zA-Z0-9])/g, (_, char) => char.toUpperCase());
}

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

function deepTransformKeys(value, keyFn, seen = new WeakSet()) {
  if (Array.isArray(value)) {
    return value.map((item) => deepTransformKeys(item, keyFn, seen));
  }

  // Instancias de Sequelize (u otro objeto con toJSON): aplanar primero.
  if (value && typeof value.toJSON === 'function' && !(value instanceof Date)) {
    value = value.toJSON();
  }

  if (isPlainObject(value)) {
    if (seen.has(value)) return value; // evita bucles infinitos en referencias circulares
    seen.add(value);
    const out = {};
    for (const [key, val] of Object.entries(value)) {
      out[keyFn(key)] = deepTransformKeys(val, keyFn, seen);
    }
    return out;
  }

  return value;
}

function toSnakeCaseDeep(value) {
  return deepTransformKeys(value, camelToSnake);
}

function toCamelCaseDeep(value) {
  return deepTransformKeys(value, snakeToCamel);
}

module.exports = { camelToSnake, snakeToCamel, toSnakeCaseDeep, toCamelCaseDeep };

/**
 * middleware/caseTransform.js
 * Ver helpers/caseTransform.js para el porque de este puente snake_case
 * (frontend/Django) <-> camelCase (backend/Sequelize).
 */
const { toSnakeCaseDeep, toCamelCaseDeep } = require('../helpers/caseTransform');

/** Convierte req.body de snake_case a camelCase antes de llegar al controlador. */
function camelizeRequestBody(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = toCamelCaseDeep(req.body);
  }
  next();
}

/** Convierte cualquier res.json(...) de camelCase a snake_case antes de enviarla. */
function snakeCaseResponse(req, res, next) {
  const originalJson = res.json.bind(res);
  res.json = (data) => originalJson(toSnakeCaseDeep(data));
  next();
}

module.exports = { camelizeRequestBody, snakeCaseResponse };

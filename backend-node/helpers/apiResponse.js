/**
 * helpers/apiResponse.js
 * Pequenas funciones auxiliares reutilizables para respuestas de paginacion
 * simple, homogeneas entre controladores.
 */
function ok(res, data, status = 200) {
  return res.status(status).json(data);
}

function created(res, data) {
  return ok(res, data, 201);
}

function noContent(res) {
  return res.status(204).send();
}

module.exports = { ok, created, noContent };

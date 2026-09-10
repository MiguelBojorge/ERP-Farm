/**
 * helpers/asyncHandler.js
 * Envuelve controladores async para reenviar cualquier excepcion a
 * middleware/errorHandler.js, evitando try/catch repetido en cada metodo
 * (equivalente a que DRF capture excepciones automaticamente en sus vistas).
 */
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;

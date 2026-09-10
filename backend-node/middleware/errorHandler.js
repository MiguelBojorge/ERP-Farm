/**
 * middleware/errorHandler.js
 * Manejador de errores centralizado (buena practica de Express: un unico
 * lugar traduce excepciones -incluyendo las de Sequelize- a respuestas HTTP
 * consistentes, en vez de try/catch repetido en cada controlador).
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // Errores de validacion de Sequelize (unique, not null, validate custom, etc.)
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      detail: 'Error de validacion.',
      errores: err.errors?.map((e) => ({ campo: e.path, mensaje: e.message })) || [err.message],
    });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({ detail: 'Operacion invalida: referencia a un registro relacionado inexistente o en uso.' });
  }

  const status = err.status || err.statusCode || 500;
  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error('[error]', err);
  }

  return res.status(status).json({
    detail: status >= 500 ? 'Error interno del servidor.' : err.message,
  });
}

module.exports = errorHandler;

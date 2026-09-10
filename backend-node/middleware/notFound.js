/**
 * middleware/notFound.js
 * Fallback para rutas no registradas (equivalente al 404 por defecto de
 * Django cuando ninguna URLconf coincide).
 */
function notFound(req, res) {
  res.status(404).json({ detail: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

module.exports = notFound;

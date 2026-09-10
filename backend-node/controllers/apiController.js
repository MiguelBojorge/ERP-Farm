/**
 * controllers/apiController.js
 * Migrado de backend/urls.py::api_root.
 */
function apiRoot(req, res) {
  res.json({
    message: 'Bienvenido al API de Finca la Primavera (vacas y cerdos)',
    endpoints: {
      admin: null, // sin panel admin propio; usar acceso directo a la BD o un cliente API
      api: '/api/',
      auth: '/api/auth/login/',
      me: '/api/auth/me/',
    },
  });
}

module.exports = { apiRoot };

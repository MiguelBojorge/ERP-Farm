/**
 * controllers/authController.js
 * Migrado del uso de rest_framework_simplejwt (TokenObtainPairView,
 * TokenRefreshView) en backend/urls.py. Agrega emision del token CSRF y
 * cambio de contrasena.
 */
const asyncHandler = require('../helpers/asyncHandler');
const AuthService = require('../src/services/authService');
const { generarToken } = require('../middleware/csrf');

const authService = new AuthService();

/** POST /api/auth/login */
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const { usuario, access, refresh } = await authService.login(username, password);
  return res.json({
    access,
    refresh,
    user: usuario.toPublicJSON(),
    csrfToken: generarToken(usuario.id),
  });
});

/** POST /api/auth/refresh */
const refrescar = asyncHandler(async (req, res) => {
  const { usuario, access } = await authService.refrescar(req.body.refresh);
  return res.json({ access, user: usuario.toPublicJSON(), csrfToken: generarToken(usuario.id) });
});

/** GET /api/auth/csrf — renueva el token CSRF del usuario autenticado. */
const csrf = asyncHandler(async (req, res) => res.json({ csrfToken: generarToken(req.user.id) }));

/** POST /api/auth/change-password */
const cambiarPassword = asyncHandler(async (req, res) => {
  await authService.cambiarPassword(req.user, req.body.currentPassword, req.body.newPassword);
  return res.json({ detail: 'Contrasena actualizada.' });
});

module.exports = { login, refrescar, csrf, cambiarPassword };

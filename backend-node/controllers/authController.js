/**
 * controllers/authController.js
 * Migrado del uso de rest_framework_simplejwt (TokenObtainPairView,
 * TokenRefreshView) en backend/urls.py.
 */
const asyncHandler = require('../helpers/asyncHandler');
const AuthService = require('../src/services/authService');

const authService = new AuthService();

/** Equivalente a TokenObtainPairView: POST /api/auth/login/ */
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ detail: 'username y password son requeridos.' });
  }
  const { access, refresh } = await authService.login(username, password);
  return res.json({ access, refresh });
});

/** Equivalente a TokenRefreshView: POST /api/auth/refresh/ */
const refrescar = asyncHandler(async (req, res) => {
  const { refresh } = req.body;
  if (!refresh) return res.status(400).json({ detail: 'refresh es requerido.' });
  const { access } = authService.refrescar(refresh);
  return res.json({ access });
});

module.exports = { login, refrescar };

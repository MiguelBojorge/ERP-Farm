const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const usuarioController = require('../controllers/usuarioController');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimit');
const { passwordFuerte } = require('../helpers/password');

const router = Router();

// Rutas publicas: login y refresh. Limitadas contra fuerza bruta y con el
// tipo de dato validado (evita pasar objetos/arrays donde se espera un texto).
router.post(
  '/login',
  loginLimiter,
  [
    body('username').isString().trim().notEmpty().isLength({ max: 150 }),
    body('password').isString().notEmpty().isLength({ max: 128 }),
  ],
  validate,
  authController.login
);

router.post(
  '/refresh',
  loginLimiter,
  [body('refresh').isString().notEmpty().isLength({ max: 2048 })],
  validate,
  authController.refrescar
);

// Rutas que exigen sesion.
router.get('/me', requireAuth, usuarioController.me);
router.get('/csrf', requireAuth, authController.csrf);
router.post(
  '/change-password',
  requireAuth,
  [
    body('currentPassword').isString().notEmpty(),
    body('newPassword').custom(passwordFuerte),
  ],
  validate,
  authController.cambiarPassword
);

module.exports = router;

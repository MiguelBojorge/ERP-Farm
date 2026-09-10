const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const usuarioController = require('../controllers/usuarioController');
const validate = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.post(
  '/login',
  [body('username').notEmpty(), body('password').notEmpty()],
  validate,
  authController.login
);

router.post('/refresh', [body('refresh').notEmpty()], validate, authController.refrescar);

router.get('/me', requireAuth, usuarioController.me);

module.exports = router;

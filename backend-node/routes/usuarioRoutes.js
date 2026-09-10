/**
 * routes/usuarioRoutes.js
 * Migrado de usuarios/views.py::UsuarioViewSet.
 *
 * Gestion de usuarios: solo ADMIN (el control de acceso se aplica al montar
 * el router en routes/index.js). Ya no existe registro publico: las cuentas
 * las crea un administrador. El perfil propio vive en GET /api/auth/me.
 */
const { Router } = require('express');
const { body } = require('express-validator');
const usuarioController = require('../controllers/usuarioController');
const validate = require('../middleware/validate');
const validateIdParam = require('../middleware/validateId');
const { Usuario } = require('../models');
const { passwordFuerte } = require('../helpers/password');

const router = Router();
router.param('id', validateIdParam);

const reglasComunes = [
  body('email').optional({ values: 'falsy' }).isEmail().isLength({ max: 254 }),
  body('firstName').optional().isString().isLength({ max: 150 }),
  body('lastName').optional().isString().isLength({ max: 150 }),
  body('telefono').optional({ values: 'falsy' }).isString().isLength({ max: 20 }),
  body('direccion').optional({ values: 'falsy' }).isString().isLength({ max: 500 }),
  body('rol').optional().isIn(Usuario.ROLES),
];

const validacionAlta = [
  body('username')
    .isString()
    .trim()
    .matches(/^[A-Za-z0-9._-]{3,150}$/)
    .withMessage('El usuario debe tener 3-150 caracteres: letras, numeros, punto, guion o guion bajo.'),
  body('password').custom(passwordFuerte),
  ...reglasComunes,
];

const validacionEdicion = [
  body('password').optional().custom(passwordFuerte),
  body('isActive').optional().isBoolean(),
  ...reglasComunes,
];

router.post('/', validacionAlta, validate, usuarioController.registro);
router.get('/', usuarioController.listar);
router.get('/:id', usuarioController.obtener);
router.patch('/:id', validacionEdicion, validate, usuarioController.actualizar);
router.delete('/:id', usuarioController.eliminar);

module.exports = router;

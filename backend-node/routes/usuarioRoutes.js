/**
 * routes/usuarioRoutes.js
 * Migrado de usuarios/views.py::UsuarioViewSet.
 *
 * NOTA IMPORTANTE: el UsuarioViewSet original en Django tenia
 * `permission_classes = [permissions.AllowAny]` en TODAS sus acciones (list,
 * create, retrieve, update, delete) — y el frontend React (pages/Usuarios.js)
 * nunca implemento una pantalla de login, por lo que jamas obtiene un JWT.
 * Para que el sitio siga funcionando igual que con Django, estas rutas se
 * mantienen abiertas (AllowAny), igual que el original. La infraestructura
 * de JWT (middleware/auth.js, requireRole) queda lista para cuando se
 * agregue una pantalla de login real y se quiera restringir esto.
 */
const { Router } = require('express');
const { body } = require('express-validator');
const usuarioController = require('../controllers/usuarioController');
const validate = require('../middleware/validate');

const router = Router();

const validacionUsuario = [
  body('username').notEmpty(),
  body('password').isLength({ min: 6 }),
  body('email').optional({ values: 'falsy' }).isEmail(),
];

// Registro publico (equivalente a UsuarioViewSet.registro, AllowAny)
router.post('/registro', validacionUsuario, validate, usuarioController.registro);
// Alta desde el panel de administracion (Usuarios.js) — mismo comportamiento,
// AllowAny, igual que el ViewSet original.
router.post('/', validacionUsuario, validate, usuarioController.registro);

router.get('/', usuarioController.listar);
router.get('/:id', usuarioController.obtener);
router.patch('/:id', usuarioController.actualizar);
router.delete('/:id', usuarioController.eliminar);

// El perfil del usuario autenticado vive en GET /api/auth/me (ver
// routes/authRoutes.js) — esa es la unica ruta de usuarios que SI exige JWT,
// igual que MeView en Django.

module.exports = router;

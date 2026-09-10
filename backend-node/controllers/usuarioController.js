/**
 * controllers/usuarioController.js
 * Migrado de usuarios/views.py (UsuarioViewSet, MeView).
 *
 * Todas las acciones de gestion de usuarios exigen rol ADMIN (ver
 * routes/index.js). Solo se aceptan campos conocidos en las actualizaciones,
 * para que nadie pueda escalar privilegios enviando isSuperuser, id, etc.
 */
const asyncHandler = require('../helpers/asyncHandler');
const { ok, created } = require('../helpers/apiResponse');
const { Usuario } = require('../models');
const AuthService = require('../src/services/authService');

const authService = new AuthService();

const CAMPOS_EDITABLES = ['firstName', 'lastName', 'email', 'rol', 'telefono', 'direccion', 'isActive'];

function httpError(status, mensaje) {
  const err = new Error(mensaje);
  err.status = status;
  return err;
}

/** Evita dejar el sistema sin ningun administrador activo. */
async function asegurarQuedaOtroAdmin(usuario) {
  if (usuario.rol !== 'ADMIN' || !usuario.isActive) return;
  const otros = await Usuario.count({ where: { rol: 'ADMIN', isActive: true } });
  if (otros <= 1) throw httpError(409, 'Debe existir al menos un administrador activo.');
}

const listar = asyncHandler(async (req, res) => {
  const usuarios = await Usuario.findAll({ order: [['id', 'DESC']] });
  ok(res, usuarios.map((u) => u.toPublicJSON()));
});

const obtener = asyncHandler(async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) return res.status(404).json({ detail: 'Usuario no encontrado.' });
  return ok(res, usuario.toPublicJSON());
});

const actualizar = asyncHandler(async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) return res.status(404).json({ detail: 'Usuario no encontrado.' });

  const datos = {};
  CAMPOS_EDITABLES.forEach((campo) => {
    if (req.body[campo] !== undefined) datos[campo] = req.body[campo];
  });

  const esUnoMismo = usuario.id === req.user.id;
  const quitaAdmin = datos.rol !== undefined && datos.rol !== 'ADMIN';
  const desactiva = datos.isActive === false;
  if (esUnoMismo && (quitaAdmin || desactiva)) {
    throw httpError(409, 'No puede quitarse su propio rol de administrador ni desactivar su cuenta.');
  }
  if (usuario.rol === 'ADMIN' && (quitaAdmin || desactiva)) await asegurarQuedaOtroAdmin(usuario);
  if (datos.rol !== undefined) datos.isStaff = datos.rol === 'ADMIN';

  // Restablecimiento de contrasena por un administrador (se hashea en el hook del modelo).
  if (req.body.password) datos.password = req.body.password;

  await usuario.update(datos);
  return ok(res, usuario.toPublicJSON());
});

const eliminar = asyncHandler(async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) return res.status(404).json({ detail: 'Usuario no encontrado.' });
  if (usuario.id === req.user.id) throw httpError(409, 'No puede eliminar su propia cuenta.');
  await asegurarQuedaOtroAdmin(usuario);
  await usuario.destroy();
  return res.status(204).send();
});

/** Alta de usuario por un administrador, equivalente a UsuarioViewSet.create(). */
const registro = asyncHandler(async (req, res) => {
  const usuario = await authService.registrar(req.body);
  return created(res, usuario.toPublicJSON());
});

/** Equivalente a MeView.get(). */
const me = asyncHandler(async (req, res) => ok(res, req.user.toPublicJSON()));

module.exports = { listar, obtener, actualizar, eliminar, registro, me };

/**
 * controllers/usuarioController.js
 * Migrado de usuarios/views.py (UsuarioViewSet, MeView).
 */
const asyncHandler = require('../helpers/asyncHandler');
const { ok, created } = require('../helpers/apiResponse');
const { Usuario } = require('../models');
const AuthService = require('../src/services/authService');

const authService = new AuthService();

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
  const { password, ...datos } = req.body; // el password no se actualiza por esta via
  await usuario.update(datos);
  return ok(res, usuario.toPublicJSON());
});

const eliminar = asyncHandler(async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) return res.status(404).json({ detail: 'Usuario no encontrado.' });
  await usuario.destroy();
  return res.status(204).send();
});

/** Auto-registro publico, equivalente a UsuarioViewSet.registro(). */
const registro = asyncHandler(async (req, res) => {
  const usuario = await authService.registrar(req.body);
  return created(res, usuario.toPublicJSON());
});

/** Equivalente a MeView.get(). */
const me = asyncHandler(async (req, res) => {
  return ok(res, req.user.toPublicJSON());
});

module.exports = { listar, obtener, actualizar, eliminar, registro, me };

/**
 * src/services/authService.js
 * Migrado de usuarios/serializers.py (RegisterSerializer) y del uso de
 * djangorestframework-simplejwt (TokenObtainPairView/TokenRefreshView).
 *
 * Seguridad aplicada aqui:
 *  - contrasenas con bcrypt (costo configurable, ver config/env.js);
 *  - mismo error y mismo tiempo de respuesta para "usuario inexistente" y
 *    "contrasena incorrecta" (no permite enumerar usuarios);
 *  - hashes antiguos de menor costo se actualizan solos al iniciar sesion;
 *  - los tokens llevan un claim `type` para que un refresh token no sirva
 *    como access token (ni al reves).
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../../models');
const env = require('../../config/env');

/** Error HTTP con status, para que errorHandler responda de forma uniforme. */
function httpError(status, mensaje) {
  const err = new Error(mensaje);
  err.status = status;
  return err;
}

// Hash "señuelo": se compara contra el cuando el usuario no existe, de modo que
// el tiempo de respuesta no delate si el username es valido.
let hashSenuelo = null;
async function obtenerHashSenuelo() {
  if (!hashSenuelo) hashSenuelo = await bcrypt.hash('senuelo-sin-uso', env.security.bcryptRounds);
  return hashSenuelo;
}

class AuthService {
  /**
   * Crea un usuario (solo lo invoca un ADMIN autenticado, ver usuarioRoutes).
   * Solo se copian campos conocidos: el cliente no puede fijar isSuperuser,
   * isStaff, isActive ni id.
   */
  async registrar(datos) {
    const existente = await Usuario.findOne({ where: { username: String(datos.username) } });
    if (existente) throw httpError(409, 'El nombre de usuario ya esta en uso.');

    const rol = datos.rol || 'EMPLEADO';
    if (!Usuario.ROLES.includes(rol)) throw httpError(400, 'Rol invalido.');

    return Usuario.create({
      username: String(datos.username).trim(),
      email: datos.email || null,
      password: datos.password, // se hashea en el hook beforeCreate del modelo
      firstName: datos.firstName || '',
      lastName: datos.lastName || '',
      rol,
      telefono: datos.telefono || '',
      direccion: datos.direccion || '',
      isStaff: rol === 'ADMIN',
    });
  }

  /** Login por username/password. Devuelve { usuario, access, refresh }. */
  async login(username, password) {
    const usuario = await Usuario.findOne({ where: { username: String(username) } });

    if (!usuario) {
      await bcrypt.compare(String(password), await obtenerHashSenuelo());
      throw httpError(401, 'Credenciales invalidas.');
    }

    const passwordValida = await usuario.checkPassword(String(password));
    if (!passwordValida || !usuario.isActive) throw httpError(401, 'Credenciales invalidas.');

    if (usuario.needsRehash()) {
      usuario.password = String(password);
      usuario.changed('password', true);
      await usuario.save();
    }

    return { usuario, ...this._emitirTokens(usuario) };
  }

  /** Emite un nuevo access token a partir de un refresh token vigente. */
  async refrescar(refreshToken) {
    let payload;
    try {
      payload = jwt.verify(refreshToken, env.jwt.refreshSecret);
    } catch (error) {
      throw httpError(401, 'Refresh token invalido o expirado.');
    }
    if (payload.type !== 'refresh') throw httpError(401, 'Refresh token invalido o expirado.');

    // Se vuelve a consultar al usuario: si lo desactivaron, el refresh deja de servir.
    const usuario = await Usuario.findByPk(payload.id);
    if (!usuario || !usuario.isActive) throw httpError(401, 'Usuario no encontrado o inactivo.');

    return { usuario, access: this._firmarAccessToken(usuario) };
  }

  /** Cambia la contrasena del propio usuario, exigiendo la actual. */
  async cambiarPassword(usuario, actual, nueva) {
    if (!(await usuario.checkPassword(String(actual)))) {
      throw httpError(400, 'La contrasena actual es incorrecta.');
    }
    usuario.password = nueva;
    await usuario.save();
  }

  _emitirTokens(usuario) {
    return {
      access: this._firmarAccessToken(usuario),
      refresh: jwt.sign({ id: usuario.id, rol: usuario.rol, type: 'refresh' }, env.jwt.refreshSecret, {
        expiresIn: env.jwt.refreshExpiresIn,
      }),
    };
  }

  _firmarAccessToken(usuario) {
    return jwt.sign({ id: usuario.id, rol: usuario.rol, type: 'access' }, env.jwt.accessSecret, {
      expiresIn: env.jwt.accessExpiresIn,
    });
  }
}

module.exports = AuthService;

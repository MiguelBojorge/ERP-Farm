/**
 * src/services/authService.js
 * Migrado de usuarios/serializers.py (RegisterSerializer) y del uso de
 * djangorestframework-simplejwt (TokenObtainPairView/TokenRefreshView).
 */
const jwt = require('jsonwebtoken');
const { Usuario } = require('../../models');
const env = require('../../config/env');

class AuthService {
  /** Equivalente a Usuario.objects.create_user(...) del RegisterSerializer. */
  async registrar(datos) {
    const existente = await Usuario.findOne({ where: { username: datos.username } });
    if (existente) {
      const err = new Error('El nombre de usuario ya esta en uso.');
      err.status = 409;
      throw err;
    }

    const usuario = await Usuario.create({
      username: datos.username,
      email: datos.email || '',
      password: datos.password, // se hashea en el hook beforeCreate del modelo
      firstName: datos.firstName || '',
      lastName: datos.lastName || '',
      rol: datos.rol || 'EMPLEADO',
      telefono: datos.telefono || '',
      direccion: datos.direccion || '',
    });

    return usuario;
  }

  /** Equivalente a TokenObtainPairView (login por username/password). */
  async login(username, password) {
    const usuario = await Usuario.findOne({ where: { username } });
    if (!usuario || !usuario.isActive) {
      const err = new Error('Credenciales invalidas.');
      err.status = 401;
      throw err;
    }
    const passwordValida = await usuario.checkPassword(password);
    if (!passwordValida) {
      const err = new Error('Credenciales invalidas.');
      err.status = 401;
      throw err;
    }

    return {
      usuario,
      ...this._emitirTokens(usuario),
    };
  }

  /** Equivalente a TokenRefreshView. */
  refrescar(refreshToken) {
    let payload;
    try {
      payload = jwt.verify(refreshToken, env.jwt.refreshSecret);
    } catch (error) {
      const err = new Error('Refresh token invalido o expirado.');
      err.status = 401;
      throw err;
    }
    return { access: this._firmarAccessToken({ id: payload.id, rol: payload.rol }) };
  }

  _emitirTokens(usuario) {
    return {
      access: this._firmarAccessToken({ id: usuario.id, rol: usuario.rol }),
      refresh: this._firmarRefreshToken({ id: usuario.id, rol: usuario.rol }),
    };
  }

  _firmarAccessToken(payload) {
    return jwt.sign(payload, env.jwt.accessSecret, { expiresIn: env.jwt.accessExpiresIn });
  }

  _firmarRefreshToken(payload) {
    return jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });
  }
}

module.exports = AuthService;

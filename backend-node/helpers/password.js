/**
 * helpers/password.js
 * Politica de contrasenas. bcrypt ignora todo lo que pase de 72 bytes, por eso
 * ese es el tope. Se usa tanto en express-validator (rutas) como en scripts.
 */
const MIN_LENGTH = 8;
const MAX_BYTES = 72;

/** Devuelve un mensaje de error, o null si la contrasena cumple la politica. */
function motivoDebil(password) {
  if (typeof password !== 'string') return 'La contrasena es requerida.';
  if (password.length < MIN_LENGTH) return `La contrasena debe tener al menos ${MIN_LENGTH} caracteres.`;
  if (Buffer.byteLength(password, 'utf8') > MAX_BYTES) return `La contrasena no puede superar ${MAX_BYTES} bytes.`;
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'La contrasena debe combinar letras y numeros.';
  }
  return null;
}

/** Validador para express-validator: body('password').custom(passwordFuerte) */
function passwordFuerte(value) {
  const motivo = motivoDebil(value);
  if (motivo) throw new Error(motivo);
  return true;
}

module.exports = { motivoDebil, passwordFuerte, MIN_LENGTH, MAX_BYTES };

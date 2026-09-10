/**
 * scripts/reset-password.js
 * Restablece la contrasena de un usuario existente (p. ej. el admin creado por
 * un seed antiguo con clave conocida) o crea un administrador si no existe.
 *
 * Uso:
 *   node scripts/reset-password.js <usuario>                 -> genera una clave aleatoria y la muestra
 *   NEW_PASSWORD='MiClave123' node scripts/reset-password.js <usuario>
 *   node scripts/reset-password.js <usuario> --crear-admin   -> lo crea como ADMIN si no existe
 *
 * Se usa la variable de entorno (no un argumento) para que la clave no quede
 * en el historial del terminal.
 */
const crypto = require('crypto');
const { sequelize, Usuario } = require('../models');
const { motivoDebil } = require('../helpers/password');

async function main() {
  const [username, ...flags] = process.argv.slice(2);
  if (!username) {
    console.error('Uso: node scripts/reset-password.js <usuario> [--crear-admin]');
    process.exit(1);
  }

  const generada = !process.env.NEW_PASSWORD;
  const password = process.env.NEW_PASSWORD || `${crypto.randomBytes(9).toString('base64url')}a7`;
  const motivo = motivoDebil(password);
  if (motivo) {
    console.error(motivo);
    process.exit(1);
  }

  let usuario = await Usuario.findOne({ where: { username } });
  if (!usuario) {
    if (!flags.includes('--crear-admin')) {
      console.error(`El usuario "${username}" no existe. Use --crear-admin para crearlo.`);
      process.exit(1);
    }
    usuario = await Usuario.create({
      username,
      password,
      rol: 'ADMIN',
      isStaff: true,
      isSuperuser: true,
    });
    console.log(`Administrador "${username}" creado.`);
  } else {
    usuario.password = password;
    usuario.isActive = true;
    await usuario.save();
    console.log(`Contrasena de "${username}" actualizada.`);
  }

  if (generada) console.log(`Contrasena generada (anotela, no se vuelve a mostrar): ${password}`);
  await sequelize.close();
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

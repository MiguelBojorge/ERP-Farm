/**
 * controllers/appController.js
 * Controlador de nivel de aplicacion: healthcheck y version, util para
 * monitoreo/despliegue (no existia como tal en Django, que expone esto de
 * forma implicita vía el propio proceso WSGI).
 */
const { sequelize } = require('../config/database');
const pkg = require('../package.json');

async function health(req, res) {
  let dbStatus = 'ok';
  try {
    await sequelize.authenticate();
  } catch (error) {
    dbStatus = 'error';
  }
  res.json({
    status: dbStatus === 'ok' ? 'ok' : 'degraded',
    db: dbStatus,
    version: pkg.version,
    timestamp: new Date().toISOString(),
  });
}

function version(req, res) {
  res.json({ name: pkg.name, version: pkg.version });
}

module.exports = { health, version };

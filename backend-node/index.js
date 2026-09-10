/**
 * index.js
 * Punto de entrada de la aplicacion Express. Equivalente a
 * backend/wsgi.py + backend/urls.py + MIDDLEWARE de settings.py.
 *
 * Responsabilidad unica: montar middleware global, rutas y arrancar el
 * servidor tras verificar la conexion a la base de datos. Toda la logica de
 * negocio vive en controllers/ y src/services/, no aqui.
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const env = require('./config/env');
const { sequelize, testConnection } = require('./config/database');
require('./models'); // registra todas las asociaciones (models/index.js)

const apiController = require('./controllers/apiController');
const appController = require('./controllers/appController');
const apiRoutes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const { camelizeRequestBody, snakeCaseResponse } = require('./middleware/caseTransform');
const sanitizeInput = require('./middleware/sanitize');
const { apiLimiter } = require('./middleware/rateLimit');

const app = express();

// --- Middleware global -----------------------------------------------------
app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true,
  })
);
app.use(apiLimiter);
// Cuerpos acotados: evita que una peticion enorme consuma memoria del servidor.
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(sanitizeInput);
if (env.nodeEnv !== 'test') {
  app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));
}
// Puente de compatibilidad con el frontend existente (snake_case <-> camelCase).
// Ver helpers/caseTransform.js para el detalle.
app.use(camelizeRequestBody);
app.use(snakeCaseResponse);

// --- Rutas -------------------------------------------------------------
app.get('/', apiController.apiRoot);
app.get('/health', appController.health);
app.get('/version', appController.version);
app.use('/api', apiRoutes);

// --- 404 y manejo centralizado de errores -------------------------------
app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await testConnection();
    // eslint-disable-next-line no-console
    console.log('Conexion a MySQL establecida correctamente.');

    if (env.nodeEnv !== 'production') {
      // En desarrollo, sincroniza el esquema automaticamente.
      // En produccion se recomienda usar migraciones (sequelize-cli) en vez de sync().
      await sequelize.sync({ alter: true });
      // eslint-disable-next-line no-console
      console.log('Modelos sincronizados con la base de datos (modo desarrollo).');
    }

    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`API de Finca La Primavera escuchando en el puerto ${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = app;

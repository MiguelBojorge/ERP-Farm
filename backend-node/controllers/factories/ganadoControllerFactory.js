/**
 * controllers/factories/ganadoControllerFactory.js
 *
 * MEJORA arquitectonica: en el backend Django, granja/views.py definia
 * LoteCerdosViewSet y (antes) CultivoViewSet con CRUD casi identico
 * (ViewSet generico de DRF). Al agregar el modulo de vacas, replicar ese
 * CRUD a mano en un vacunoController separado duplicaria logica.
 *
 * Esta factory genera un controlador CRUD + registrar-peso + registrar-salud
 * para una especie de ganado ('CERDO' | 'VACA'), parametrizado por su
 * modelo Sequelize. Los controladores porcinoController.js y
 * vacunoController.js son instancias delgadas de esta factory: mantienen
 * archivos propios y nombres de ruta especificos (como pide la arquitectura
 * por modulos), sin duplicar la implementacion.
 */
const asyncHandler = require('../../helpers/asyncHandler');
const { ok, created, noContent } = require('../../helpers/apiResponse');
const GanadoService = require('../../src/services/ganadoService');

function crearControladorGanado(especie, { loteModel, includeHistorial }) {
  const ganadoService = new GanadoService();

  const listar = asyncHandler(async (req, res) => {
    const lotes = await loteModel.findAll({ include: includeHistorial, order: [['id', 'DESC']] });
    ok(res, lotes);
  });

  const obtener = asyncHandler(async (req, res) => {
    const lote = await loteModel.findByPk(req.params.id, { include: includeHistorial });
    if (!lote) return res.status(404).json({ detail: 'Lote no encontrado.' });
    return ok(res, lote);
  });

  const crear = asyncHandler(async (req, res) => {
    const lote = await ganadoService.crearLote(especie, req.body);
    return created(res, lote);
  });

  const actualizar = asyncHandler(async (req, res) => {
    const lote = await loteModel.findByPk(req.params.id);
    if (!lote) return res.status(404).json({ detail: 'Lote no encontrado.' });
    await lote.update(req.body);
    return ok(res, lote);
  });

  const eliminar = asyncHandler(async (req, res) => {
    const lote = await loteModel.findByPk(req.params.id);
    if (!lote) return res.status(404).json({ detail: 'Lote no encontrado.' });
    await lote.destroy();
    return noContent(res);
  });

  const registrarPeso = asyncHandler(async (req, res) => {
    const registro = await ganadoService.registrarPeso(especie, req.params.id, req.body.peso, req.body.fecha);
    return created(res, registro);
  });

  const registrarSalud = asyncHandler(async (req, res) => {
    const registro = await ganadoService.registrarSalud(especie, req.params.id, req.body);
    return created(res, registro);
  });

  return { listar, obtener, crear, actualizar, eliminar, registrarPeso, registrarSalud };
}

module.exports = crearControladorGanado;

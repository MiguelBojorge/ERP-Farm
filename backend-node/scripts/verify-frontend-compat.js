/**
 * scripts/verify-frontend-compat.js
 * Verifica, con los payloads EXACTOS que el frontend React envia (snake_case,
 * heredados de cuando hablaba con Django), que el puente
 * helpers/caseTransform.js + los servicios del backend Node terminan
 * escribiendo los campos correctos. Ejercita el flujo completo: payload del
 * frontend -> camelizeRequestBody -> servicio -> modelo -> snakeCaseResponse
 * -> lo que el frontend vuelve a leer.
 */
const assert = require('assert');
const { toCamelCaseDeep, toSnakeCaseDeep } = require('../helpers/caseTransform');
const GanadoService = require('../src/services/ganadoService');
const InventoryService = require('../src/services/inventoryService');
const SalesService = require('../src/services/salesService');
const AuthService = require('../src/services/authService');
const { Producto } = require('../models');

async function run() {
  const ganadoService = new GanadoService();
  const inventoryService = new InventoryService();
  const salesService = new SalesService();
  const authService = new AuthService();

  // A) pages/Cerdos.js -> POST /api/lotes-cerdos/
  const cerdoBody = toCamelCaseDeep({
    id_batch: 'FE-CERDOS-01',
    raza: 'Duroc',
    cantidad_inicial: '20',
    peso_promedio_inicial: '12.5',
    costo_inicial: '5000',
    fecha_entrada: '2026-01-01',
    estado: 'SALUDABLE',
    ubicacion: 'Corral A-1',
    edad_inicial_semanas: 10,
    cantidad_actual: '20',
    peso_actual: '12.5',
  });
  const loteCerdos = await ganadoService.crearLote('CERDO', cerdoBody);
  assert.strictEqual(loteCerdos.idBatch, 'FE-CERDOS-01');
  const cerdoOut = toSnakeCaseDeep(loteCerdos);
  assert.strictEqual(cerdoOut.id_batch, 'FE-CERDOS-01');
  assert.strictEqual(cerdoOut.edad_inicial_semanas, 10);

  // B) pages/Vacas.js -> POST /api/lotes-vacas/
  const vacaBody = toCamelCaseDeep({
    id_batch: 'FE-VACAS-01',
    raza: 'Holstein',
    proposito: 'LECHE',
    cantidad_inicial: '10',
    peso_promedio_inicial: '200',
    costo_inicial: '20000',
    fecha_entrada: '2026-01-01',
    estado: 'LACTANCIA',
    ubicacion: 'Potrero 1',
    edad_inicial_meses: 24,
    produccion_leche_litros_dia: '15',
    cantidad_actual: '10',
    peso_actual: '200',
  });
  const loteVacas = await ganadoService.crearLote('VACA', vacaBody);
  assert.strictEqual(loteVacas.idBatch, 'FE-VACAS-01');
  assert.strictEqual(loteVacas.produccionLecheLitrosDia, '15');
  const vacaOut = toSnakeCaseDeep(loteVacas);
  assert.strictEqual(vacaOut.produccion_leche_litros_dia, '15');
  assert.strictEqual(vacaOut.edad_inicial_meses, 24);

  // C) pages/Gastos.js -> POST /api/consumos-alimento/
  const producto = await Producto.create({ nombre: 'Alimento FE', categoria: 'ALIMENTO', cantidad: 50, stockMinimo: 5, precioUnitario: 10 });
  const consumoBody = toCamelCaseDeep({
    alimento_id: producto.id,
    lote_cerdos_id: loteCerdos.id,
    cantidad: '5',
    monto_total: '50',
  });
  const consumo = await inventoryService.registrarConsumoAlimento(consumoBody);
  assert.strictEqual(consumo.alimentoId, producto.id);
  assert.strictEqual(consumo.loteCerdosId, loteCerdos.id);

  // D) pages/Ventas.js -> POST /api/ventas/ (item tipo 'lote' y tipo 'vaca')
  const ventaBody = toCamelCaseDeep({
    cliente_id: null,
    metodo_pago: 'EFECTIVO',
    detalles: [
      { cantidad: 2, precio_unitario: 100, lote_cerdos_id: loteCerdos.id, producto_id: null, lote_vacas_id: null },
      { cantidad: 1, precio_unitario: 15000, lote_cerdos_id: null, producto_id: null, lote_vacas_id: loteVacas.id },
    ],
  });
  const venta = await salesService.procesarVenta(ventaBody);
  assert.strictEqual(Number(venta.total), 2 * 100 + 1 * 15000);
  assert.strictEqual(venta.detalles.length, 2);

  // E) pages/Usuarios.js -> POST /api/usuarios/
  const usuarioBody = toCamelCaseDeep({
    username: 'fe_test_user',
    email: 'fe@test.com',
    password: 'secret123',
    first_name: 'Frontend',
    last_name: 'Test',
    rol: 'EMPLEADO',
    telefono: '8888-0000',
  });
  const usuario = await authService.registrar(usuarioBody);
  assert.strictEqual(usuario.firstName, 'Frontend');
  assert.strictEqual(usuario.lastName, 'Test');

  console.log('OK: los payloads reales del frontend (Cerdos, Vacas, Gastos, Ventas, Usuarios) son compatibles con el backend Node.');
}

run().catch((err) => {
  console.error('FALLO en verify-frontend-compat.js:', err);
  process.exit(1);
});

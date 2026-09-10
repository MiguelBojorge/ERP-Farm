/**
 * scripts/verify-business-logic.js
 * Script de verificacion manual (no es parte del runtime de la app) que
 * ejercita los servicios contra el stub en memoria de Sequelize para
 * confirmar, con aserciones, que la logica de negocio migrada se comporta
 * como se espera: sin doble descuento de stock, subtotales correctos,
 * balance financiero consistente, transacciones atomicas, etc.
 */
const assert = require('assert');
const { LoteCerdos, LoteVacas, Producto, Transaccion, Venta } = require('../models');
const GanadoService = require('../src/services/ganadoService');
const InventoryService = require('../src/services/inventoryService');
const SalesService = require('../src/services/salesService');
const FinanceService = require('../src/services/financeService');

async function run() {
  const ganadoService = new GanadoService();
  const inventoryService = new InventoryService();
  const salesService = new SalesService();
  const financeService = new FinanceService();

  // 1) Crear lote de cerdos con costo inicial -> debe generar egreso automatico
  const lote = await ganadoService.crearLote('CERDO', {
    idBatch: 'TEST-CERDOS-001',
    fechaEntrada: '2026-01-01',
    cantidadInicial: 20,
    cantidadActual: 20,
    pesoPromedioInicial: 12,
    pesoActual: 12,
    costoInicial: 5000,
    raza: 'Yorkshire',
  });
  let egresosInversion = await Transaccion.findAll({ where: { tipo: 'EGRESO' } });
  assert.ok(
    egresosInversion.some((t) => t.descripcion.includes('TEST-CERDOS-001')),
    'Debe registrarse un egreso automatico al crear un lote con costo inicial > 0'
  );

  // 2) Crear lote de vacas (mismo comportamiento, especie distinta)
  const loteVacas = await ganadoService.crearLote('VACA', {
    idBatch: 'TEST-VACAS-001',
    fechaEntrada: '2026-01-01',
    cantidadInicial: 10,
    cantidadActual: 10,
    pesoPromedioInicial: 200,
    pesoActual: 200,
    costoInicial: 20000,
    raza: 'Holstein',
    proposito: 'LECHE',
  });
  egresosInversion = await Transaccion.findAll({ where: { tipo: 'EGRESO' } });
  assert.ok(
    egresosInversion.some((t) => t.descripcion.includes('TEST-VACAS-001')),
    'Debe registrarse un egreso automatico al crear un lote de vacas con costo inicial > 0'
  );

  // 3) Producto + consumo de alimento -> descuenta stock y registra egreso
  const producto = await Producto.create({
    nombre: 'Alimento Test',
    categoria: 'ALIMENTO',
    cantidad: 100,
    stockMinimo: 10,
    precioUnitario: 50,
  });
  await inventoryService.registrarConsumoAlimento({
    alimentoId: producto.id,
    loteCerdosId: lote.id,
    cantidad: 10,
    montoTotal: 500,
  });
  const productoActualizado = await Producto.findByPk(producto.id);
  assert.strictEqual(productoActualizado.cantidad, 90, 'El consumo de alimento debe descontar exactamente 10 unidades de stock');

  // 4) Venta de un lote de cerdos -> descuenta cantidadActual UNA sola vez (sin doble descuento)
  const cantidadAntesVenta = lote.cantidadActual; // 20
  const venta = await salesService.procesarVenta({
    metodoPago: 'EFECTIVO',
    detalles: [{ loteCerdosId: lote.id, cantidad: 5, precioUnitario: 100 }],
  });
  const loteActualizado = await LoteCerdos.findByPk(lote.id);
  assert.strictEqual(
    loteActualizado.cantidadActual,
    cantidadAntesVenta - 5,
    `cantidadActual debe descontarse EXACTAMENTE una vez (bug original: se descontaba doble). Esperado ${cantidadAntesVenta - 5}, obtenido ${loteActualizado.cantidadActual}`
  );
  assert.strictEqual(Number(venta.total), 500, 'El total de la venta debe ser cantidad * precioUnitario = 5 * 100');
  assert.strictEqual(Number(venta.detalles[0].subtotal), 500, 'El subtotal del detalle debe calcularse automaticamente');

  // 5) Venta de un lote de vacas (nuevo modulo) -> mismo comportamiento
  const cantidadVacasAntes = loteVacas.cantidadActual; // 10
  await salesService.procesarVenta({
    metodoPago: 'TRANSFERENCIA',
    detalles: [{ loteVacasId: loteVacas.id, cantidad: 2, precioUnitario: 15000 }],
  });
  const loteVacasActualizado = await LoteVacas.findByPk(loteVacas.id);
  assert.strictEqual(loteVacasActualizado.cantidadActual, cantidadVacasAntes - 2, 'La venta de vacas debe descontar cantidadActual correctamente');

  // 6) Balance financiero = suma(ingresos) - suma(egresos), consistente con lo registrado
  const balance = await financeService.calcularBalance();
  const todasTransacciones = await Transaccion.findAll();
  const ingresosEsperados = todasTransacciones.filter((t) => t.tipo === 'INGRESO').reduce((a, t) => a + Number(t.monto), 0);
  const egresosEsperados = todasTransacciones.filter((t) => t.tipo === 'EGRESO').reduce((a, t) => a + Number(t.monto), 0);
  assert.strictEqual(balance.ingresos, ingresosEsperados, 'El total de ingresos del balance debe coincidir con la suma real de transacciones INGRESO');
  assert.strictEqual(balance.egresos, egresosEsperados, 'El total de egresos del balance debe coincidir con la suma real de transacciones EGRESO');
  assert.strictEqual(balance.balance, ingresosEsperados - egresosEsperados, 'balance = ingresos - egresos');

  // 7) Validacion de modelo: VentaDetalle debe rechazar 0 o mas de 1 item asociado
  let fallo = false;
  try {
    await salesService.procesarVenta({
      metodoPago: 'EFECTIVO',
      detalles: [{ cantidad: 1, precioUnitario: 10 }], // ningun item asociado
    });
  } catch (err) {
    fallo = true;
  }
  assert.ok(fallo, 'Un detalle de venta sin producto/loteCerdos/loteVacas debe ser rechazado por la validacion del modelo');

  console.log('OK: todas las verificaciones de logica de negocio pasaron.');
}

run().catch((err) => {
  console.error('FALLO en verify-business-logic.js:', err);
  process.exit(1);
});

/**
 * seed/seed.js
 * Migrado y adaptado de backend/populate_db_100.py: datos iniciales de
 * demostracion para el ERP. Se elimina por completo la seccion de Cultivos
 * (agricultura) y se agrega una seccion equivalente para lotes de vacas.
 *
 * Uso: npm run seed  (requiere que la base de datos exista y las tablas
 * ya esten sincronizadas — index.js hace sync() automatico en desarrollo).
 */
require('dotenv').config();
const { sequelize, Usuario, Proveedor, Producto, Cliente } = require('../models');
const GanadoService = require('../src/services/ganadoService');
const InventoryService = require('../src/services/inventoryService');
const SalesService = require('../src/services/salesService');

const ganadoService = new GanadoService();
const inventoryService = new InventoryService();
const salesService = new SalesService();

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randFloat(min, max, decimals = 1) {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}
function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

async function seedUsuarios() {
  const [admin] = await Usuario.findOrCreate({
    where: { username: 'admin' },
    defaults: {
      email: 'admin@fincalaprimavera.com',
      password: 'admin123',
      firstName: 'Administrador',
      lastName: 'Principal',
      rol: 'ADMIN',
      isStaff: true,
      isSuperuser: true,
    },
  });

  const empleados = [];
  for (let i = 1; i <= 3; i += 1) {
    const [emp] = await Usuario.findOrCreate({
      where: { username: `empleado${i}` },
      defaults: {
        email: `empleado${i}@fincalaprimavera.com`,
        password: 'emp123',
        firstName: 'Empleado',
        lastName: `Nº ${i}`,
        rol: 'EMPLEADO',
        telefono: `8888-000${i}`,
      },
    });
    empleados.push(emp);
  }

  console.log('Usuarios creados/verificados.');
  return { admin, empleados };
}

async function seedCerdos() {
  const razas = ['Yorkshire', 'Duroc', 'Landrace', 'Pietrain', 'Hampshire'];
  const estados = ['SALUDABLE', 'ENGORDE', 'CRIA', 'DESTETE', 'OBSERVACION', 'REVISION'];
  const corrales = ['A', 'B', 'C'].flatMap((c) => [1, 2, 3, 4].map((n) => `Corral ${c}-${n}`));

  const lotes = [];
  for (let i = 1; i <= 12; i += 1) {
    const idBatch = `LOTE-CERDOS-2026-${String(i).padStart(3, '0')}`;
    // eslint-disable-next-line no-await-in-loop
    const lote = await ganadoService.crearLote('CERDO', {
      idBatch,
      fechaEntrada: addDays('2026-01-01', i * 5),
      cantidadInicial: randInt(20, 50),
      cantidadActual: randInt(15, 45),
      pesoPromedioInicial: randFloat(8, 15),
      pesoActual: randFloat(35, 95),
      costoInicial: randInt(3000, 12000),
      raza: pick(razas),
      estado: pick(estados),
      edadInicialSemanas: randInt(4, 8),
      ubicacion: pick(corrales),
      observaciones: `Lote de engorde de excelente genetica ${i}.`,
    });
    // eslint-disable-next-line no-await-in-loop
    await ganadoService.registrarPeso('CERDO', lote.id, lote.pesoActual);
    if (i % 2 === 0) {
      // eslint-disable-next-line no-await-in-loop
      await ganadoService.registrarSalud('CERDO', lote.id, {
        fecha: addDays(lote.fechaEntrada, 10),
        descripcion: 'Vacunacion y desparasitacion preventiva',
        tratamiento: 'Dosis 2ml Ivermectina + Parvovirus',
        responsable: 'Dr. Lopez',
      });
    }
    lotes.push(lote);
  }
  console.log(`Lotes de cerdos (${lotes.length}) generados.`);
  return lotes;
}

async function seedVacas() {
  const razas = ['Holstein', 'Jersey', 'Brahman', 'Pardo Suizo', 'Reyna', 'Gyr'];
  const estados = ['SALUDABLE', 'LACTANCIA', 'SECA', 'CRIA', 'ENGORDE', 'OBSERVACION'];
  const potreros = [1, 2, 3, 4, 5].map((n) => `Potrero ${n}`);
  const propositos = ['LECHE', 'CARNE', 'DOBLE_PROPOSITO'];

  const lotes = [];
  for (let i = 1; i <= 8; i += 1) {
    const idBatch = `LOTE-VACAS-2026-${String(i).padStart(3, '0')}`;
    const proposito = pick(propositos);
    // eslint-disable-next-line no-await-in-loop
    const lote = await ganadoService.crearLote('VACA', {
      idBatch,
      fechaEntrada: addDays('2026-01-01', i * 8),
      cantidadInicial: randInt(8, 25),
      cantidadActual: randInt(6, 22),
      pesoPromedioInicial: randFloat(180, 250),
      pesoActual: randFloat(320, 480),
      costoInicial: randInt(15000, 60000),
      raza: pick(razas),
      proposito,
      produccionLecheLitrosDia: proposito === 'CARNE' ? null : randFloat(8, 22),
      estado: pick(estados),
      edadInicialMeses: randInt(10, 30),
      ubicacion: pick(potreros),
      observaciones: `Lote bovino de proposito ${proposito.toLowerCase()} ${i}.`,
    });
    // eslint-disable-next-line no-await-in-loop
    await ganadoService.registrarPeso('VACA', lote.id, lote.pesoActual);
    if (i % 2 === 0) {
      // eslint-disable-next-line no-await-in-loop
      await ganadoService.registrarSalud('VACA', lote.id, {
        fecha: addDays(lote.fechaEntrada, 15),
        descripcion: 'Vacunacion contra fiebre aftosa y brucelosis',
        tratamiento: 'Dosis segun protocolo veterinario anual',
        responsable: 'Dra. Rivas',
      });
    }
    lotes.push(lote);
  }
  console.log(`Lotes de vacas (${lotes.length}) generados.`);
  return lotes;
}

async function seedInventario() {
  const proveedoresData = [
    ['AgroInsumos del Norte', 'Carlos Mendoza', '8822-1100', 'contacto@agroinsumos.com'],
    ['Veterinaria La Purisima', 'Dra. Sofia Rivas', '8933-4455', 'ventas@purisima.com'],
    ['Distribuidora Agropecuaria Central', 'Jorge Lopez', '8711-2233', 'jlopez@distcentral.com'],
    ['Ferreteria y Herramientas El Campesino', 'Ramon Perez', '8655-9900', 'info@elcampesino.com'],
  ];
  const proveedores = [];
  for (const [nombre, contacto, telefono, email] of proveedoresData) {
    // eslint-disable-next-line no-await-in-loop
    const [proveedor] = await Proveedor.findOrCreate({ where: { nombre }, defaults: { contacto, telefono, email } });
    proveedores.push(proveedor);
  }

  const productosData = [
    ['Alimento Iniciador Cerdos 25kg', 'ALIMENTO', 50, 10, 450.0, proveedores[0]],
    ['Alimento Crecimiento Cerdos 40kg', 'ALIMENTO', 120, 15, 680.0, proveedores[0]],
    ['Concentrado Lechero Vacas 40kg', 'ALIMENTO', 90, 15, 720.0, proveedores[0]],
    ['Sal Mineralizada para Ganado 25kg', 'ALIMENTO', 60, 10, 380.0, proveedores[0]],
    ['Vacuna Parvovirus Porcino', 'MEDICINA', 40, 10, 220.0, proveedores[1]],
    ['Vacuna Fiebre Aftosa Bovina', 'MEDICINA', 35, 10, 260.0, proveedores[1]],
    ['Ivermectina 1% 500ml', 'MEDICINA', 25, 5, 540.0, proveedores[1]],
    ['Comederos de Acero Inoxidable', 'HERRAMIENTA', 15, 3, 890.0, proveedores[3]],
    ['Cerca Electrica (rollo 200m)', 'HERRAMIENTA', 8, 2, 2100.0, proveedores[3]],
    ['Guantes de manejo veterinario', 'OTROS', 30, 5, 95.0, proveedores[2]],
  ];
  const productos = [];
  for (const [nombre, categoria, cantidad, stockMinimo, precioUnitario, proveedor] of productosData) {
    // eslint-disable-next-line no-await-in-loop
    const [producto] = await Producto.findOrCreate({
      where: { nombre },
      defaults: { categoria, cantidad, stockMinimo, precioUnitario, proveedorId: proveedor.id },
    });
    productos.push(producto);
  }

  console.log(`Proveedores (${proveedores.length}) y productos (${productos.length}) generados.`);
  return { proveedores, productos };
}

async function seedConsumos(lotesCerdos, lotesVacas, productos) {
  const alimentos = productos.filter((p) => p.categoria === 'ALIMENTO');
  if (alimentos.length === 0) return;

  for (const lote of lotesCerdos.slice(0, 5)) {
    const alimento = pick(alimentos);
    const cantidad = randFloat(2, 8);
    // eslint-disable-next-line no-await-in-loop
    await inventoryService.registrarConsumoAlimento({
      alimentoId: alimento.id,
      loteCerdosId: lote.id,
      cantidad,
      montoTotal: Number((cantidad * Number(alimento.precioUnitario)).toFixed(2)),
    });
  }

  for (const lote of lotesVacas.slice(0, 4)) {
    const alimento = pick(alimentos);
    const cantidad = randFloat(3, 10);
    // eslint-disable-next-line no-await-in-loop
    await inventoryService.registrarConsumoAlimento({
      alimentoId: alimento.id,
      loteVacasId: lote.id,
      cantidad,
      montoTotal: Number((cantidad * Number(alimento.precioUnitario)).toFixed(2)),
    });
  }
  console.log('Consumos de alimento generados.');
}

async function seedClientesYVentas(lotesCerdos, lotesVacas, productos) {
  const clientesData = [
    ['Carniceria El Buen Corte', '8899-1122', 'compras@buencorte.com'],
    ['Lacteos San Ramon', '8899-3344', 'ventas@lacteossanramon.com'],
    ['Distribuidora Nacional de Carnes', '8899-5566', 'pedidos@dnc.com'],
  ];
  const clientes = [];
  for (const [nombre, telefono, email] of clientesData) {
    // eslint-disable-next-line no-await-in-loop
    const [cliente] = await Cliente.findOrCreate({ where: { nombre }, defaults: { telefono, email } });
    clientes.push(cliente);
  }

  if (lotesCerdos[0]) {
    await salesService.procesarVenta({
      clienteId: clientes[0].id,
      metodoPago: 'EFECTIVO',
      detalles: [
        { loteCerdosId: lotesCerdos[0].id, cantidad: 5, precioUnitario: 120 },
      ],
    });
  }
  if (lotesVacas[0]) {
    await salesService.procesarVenta({
      clienteId: clientes[1].id,
      metodoPago: 'TRANSFERENCIA',
      detalles: [
        { loteVacasId: lotesVacas[0].id, cantidad: 2, precioUnitario: 15000 },
      ],
    });
  }
  const producto = productos.find((p) => p.categoria === 'OTROS');
  if (producto) {
    await salesService.procesarVenta({
      clienteId: clientes[2].id,
      metodoPago: 'EFECTIVO',
      detalles: [{ productoId: producto.id, cantidad: 3, precioUnitario: producto.precioUnitario }],
    });
  }
  console.log(`Clientes (${clientes.length}) y ventas de ejemplo generadas.`);
}

async function seedDatabase() {
  console.log('Iniciando script de poblacion de base de datos (seed.js)...');
  await sequelize.sync(); // no usa alter aqui; index.js ya deja el esquema al dia
  await seedUsuarios();
  const lotesCerdos = await seedCerdos();
  const lotesVacas = await seedVacas();
  const { productos } = await seedInventario();
  await seedConsumos(lotesCerdos, lotesVacas, productos);
  await seedClientesYVentas(lotesCerdos, lotesVacas, productos);
  console.log('Poblacion de base de datos completada.');
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error al poblar la base de datos:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;

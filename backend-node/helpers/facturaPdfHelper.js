/**
 * helpers/facturaPdfHelper.js
 * Migrado de utils/pdf_generator.py::generate_invoice_pdf (reportlab -> pdfkit).
 * Genera el PDF de factura de una venta ya cargada con sus detalles y cliente
 * (venta.detalles, venta.cliente, cada detalle con producto/loteCerdos/loteVacas).
 */
const PDFDocument = require('pdfkit');

function nombreItem(detalle) {
  if (detalle.producto) return detalle.producto.nombre;
  if (detalle.loteCerdos) return `Lote de cerdos ${detalle.loteCerdos.idBatch}`;
  if (detalle.loteVacas) return `Lote de vacas ${detalle.loteVacas.idBatch}`;
  return 'Item';
}

/**
 * @param {object} venta Instancia de Venta con detalles/cliente precargados.
 * @returns {PDFDocument} stream de pdfkit; el llamador hace pipe(res) o similar.
 */
function generarFacturaPdf(venta) {
  const doc = new PDFDocument({ size: 'LETTER', margin: 50 });

  doc.font('Helvetica-Bold').fontSize(16).text('Factura de Venta - Finca La Primavera');
  doc.moveDown(0.5);

  doc.font('Helvetica').fontSize(12);
  doc.text(`Venta ID: ${venta.id}`);
  doc.text(`Cliente: ${venta.cliente ? venta.cliente.nombre : 'Consumidor final'}`);
  doc.text(`Fecha: ${new Date(venta.fecha).toISOString().slice(0, 16).replace('T', ' ')}`);
  doc.moveDown();

  doc.text('--------------------------------------------------------------');
  const colX = { item: 50, cantidad: 260, precio: 350, subtotal: 440 };
  doc.font('Helvetica-Bold');
  const headerY = doc.y + 5;
  doc.text('Item', colX.item, headerY);
  doc.text('Cantidad', colX.cantidad, headerY);
  doc.text('Precio', colX.precio, headerY);
  doc.text('Subtotal', colX.subtotal, headerY);
  doc.moveDown();
  doc.font('Helvetica');

  const detalles = venta.detalles || [];
  detalles.forEach((detalle) => {
    const y = doc.y;
    doc.text(nombreItem(detalle).slice(0, 30), colX.item, y, { width: 200 });
    doc.text(String(detalle.cantidad), colX.cantidad, y);
    doc.text(`C$${Number(detalle.precioUnitario).toFixed(2)}`, colX.precio, y);
    doc.text(`C$${Number(detalle.subtotal).toFixed(2)}`, colX.subtotal, y);
    doc.moveDown();
    if (doc.y > 700) doc.addPage();
  });

  doc.moveDown();
  doc.text('--------------------------------------------------------------');
  doc.font('Helvetica-Bold').fontSize(14);
  doc.text(`TOTAL: C$${Number(venta.total).toFixed(2)}`, colX.subtotal - 60, doc.y + 10);

  doc.end();
  return doc;
}

module.exports = { generarFacturaPdf };

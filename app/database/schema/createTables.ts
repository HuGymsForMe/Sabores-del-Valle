import { getDB } from "../db";

export async function createTables() {
  const db = await getDB();

  await db.execAsync(`
    DROP TABLE IF EXISTS ls_lineas_pedido;
    DROP TABLE IF EXISTS ls_pedido;

    CREATE TABLE IF NOT EXISTS ls_pedido (
      codigoCliente TEXT,
      codigoVendedor INTEGER,
      comentariosPicking TEXT,
      direccionEnvio TEXT,
      entradaDocumento INTEGER PRIMARY KEY NOT NULL,
      estado TEXT,
      estadoDocumento INTEGER,
      estadoPedido INTEGER,
      fechaActualizacion TEXT,
      fechaCreacion TEXT,
      fechaDocumento TEXT,
      importeIVA REAL,
      importeTotal REAL,
      incidenciaDocumento INTEGER,
      metodoPago TEXT,
      nombreCliente TEXT,
      pick INTEGER NOT NULL DEFAULT 0,
      pickStatus INTEGER NOT NULL DEFAULT 0,
      porcDescuento REAL
    );

    CREATE TABLE IF NOT EXISTS ls_lineas_pedido (
      entradaDocumento INTEGER NOT NULL,
      numeroLinea INTEGER NOT NULL,
      cantidad REAL,
      codigoAlmacen TEXT,
      codigoProducto TEXT,
      codigoUnidadMedida TEXT,
      codigoVendedor INTEGER,
      descripcion TEXT,
      elementosPorUnidad REAL,
      estado TEXT,
      fechaEnvio TEXT,
      grupoIVA TEXT,
      idLineaAlbaran TEXT,
      importe REAL,
      moneda TEXT,
      nombreUnidadMedida TEXT,
      pickStatus INTEGER NOT NULL DEFAULT 0,
      pickStatusEx TEXT,
      porcDescuento REAL,
      porcIVA REAL,
      precioConIVA REAL,
      precioUnidad REAL,
      totalLinea REAL,
      unidadMedida INTEGER,
      estadoLinea TEXT,
      incidenciaLinea TEXT,
      PRIMARY KEY (entradaDocumento, numeroLinea),
      FOREIGN KEY (entradaDocumento) REFERENCES ls_pedido(entradaDocumento) ON DELETE CASCADE
    );
  `);

  console.log("✅ Tablas creadas correctamente.");
}

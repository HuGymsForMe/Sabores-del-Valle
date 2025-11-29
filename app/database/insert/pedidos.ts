import { pedidosData } from "@/app/database/pedidos";
import { getDB } from "../db";

export async function insertPedido(pedido: any) {
  const db = await getDB();

  await db.runAsync(
    `
    INSERT OR REPLACE INTO ls_pedido (
      codigoCliente, codigoVendedor, comentariosPicking, direccionEnvio,
      entradaDocumento, estadoDocumento, estadoPedido,
      fechaActualizacion, fechaCreacion, fechaDocumento, importeIVA,
      importeTotal, incidenciaDocumento, metodoPago, nombreCliente,
      pick, pickStatus, porcDescuento
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      pedido.codigoCliente,
      pedido.codigoVendedor,
      pedido.comentariosPicking ?? "",
      pedido.direccionEnvio,
      pedido.entradaDocumento,
      pedido.estadoDocumento ?? 0,
      pedido.estadoPedido ?? 0,
      pedido.fechaActualizacion,
      pedido.fechaCreacion,
      pedido.fechaDocumento,
      pedido.importeIVA ?? 0,
      pedido.importeTotal ?? 0,
      pedido.incidenciaDocumento ?? null,
      pedido.metodoPago ?? "Sin método",
      pedido.nombreCliente ?? "Cliente desconocido",
      pedido.pick ? 1 : 0,
      Number(pedido.pickStatus ?? 0),
      Number(pedido.porcDescuento ?? 0),
    ]
  );

  // --- Inserta líneas del pedido ---
  for (const linea of pedido.lineasPedidoCliente ?? []) {
    await db.runAsync(
      `
      INSERT OR REPLACE INTO ls_lineas_pedido (
        entradaDocumento, numeroLinea, cantidad, codigoAlmacen,
        codigoProducto, codigoVendedor, descripcion,
        elementosPorUnidad, fechaEnvio, grupoIVA, importe, moneda,
        pickStatus, pickStatusEx, porcDescuento, porcIVA, precioConIVA, precioUnidad, totalLinea,
        estadoLinea, incidenciaLinea
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        pedido.entradaDocumento,
        linea.numeroLinea,
        Number(linea.cantidad ?? 0),
        linea.codigoAlmacen,
        linea.codigoProducto,
        linea.codigoVendedor,
        linea.descripcion,
        Number(linea.elementosPorUnidad ?? 1),
        linea.fechaEnvio,
        linea.grupoIVA,
        Number(linea.importe ?? 0),
        linea.moneda ?? "EUR",
        Number(linea.pickStatus ?? 0),
        linea.pickStatusEx ?? "",
        Number(linea.porcDescuento ?? 0),
        Number(linea.porcIVA ?? 0),
        Number(linea.precioConIVA ?? 0),
        Number(linea.precioUnidad ?? 0),
        Number(linea.totalLinea ?? 0),
        linea.estadoLinea ?? 1,
        linea.incidenciaLinea ?? null,
      ]
    );
  }

  console.log(`✅ Pedido ${pedido.entradaDocumento} y sus líneas insertados correctamente`);
}

export async function subiendoPedidos() {
  const db = await getDB();
  const row = await db.getFirstAsync<{ c: number }>(
    `SELECT COUNT(*) as c FROM ls_pedido`
  );

  if (row?.c && row.c > 0) {
    console.log("ℹ️ Seed omitido (ya hay pedidos)");
    return;
  }

  console.log(`📦 Insertando ${pedidosData.length} pedidos...`);

  for (const pedido of pedidosData) {
    await insertPedido(pedido);
  }

  console.log(`✅ Seed completado: ${pedidosData.length} pedidos insertados correctamente`);
}
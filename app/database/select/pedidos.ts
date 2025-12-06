import { getDB } from "@/app/database/db";
import { CierreDeCajaRowUI, ConteoEstadoPedidosPorDiaCajaRowUI, ConteoEstadoPedidosPorDiaRowUI, PedidoCargaTrabajoRow, PedidoCargaTrabajoUI, PedidoDetallesPedidoRow, PedidoDetallesPedidoUI, PedidoImporteCobradoRow } from "@/app/database/types";

const estadoDocumentoMap: Record<number, string> = {
  1: "PENDIENTE",
  2: "ENTREGADO PARCIALMENTE",
  3: "COMPLETADO",
  4: "CON INCIDENCIA",
};

export async function getPedidosCargaTrabajo(fechaISO: string): Promise<PedidoCargaTrabajoUI[]> {
  const db = await getDB();

  const query = `
    SELECT 
      entradaDocumento,
      nombreCliente,
      direccionEnvio,
      importeTotal,
      metodoPago,
      estadoDocumento AS estado
    FROM ls_pedido
    WHERE DATE(REPLACE(fechaDocumento, 'T', ' ')) = DATE(?)
    ORDER BY fechaDocumento DESC
  `;

  const rows = await db.getAllAsync<PedidoCargaTrabajoRow>(query, [fechaISO]);

  console.log("📆 Buscando pedidos del día:", fechaISO, "→ encontrados:", rows.length);

  return rows.map((p) => ({
    id: p.entradaDocumento,
    cliente: p.nombreCliente,
    calle: p.direccionEnvio,
    descripcion: p.metodoPago ?? "Sin descripción",
    importe: `${Number(p.importeTotal || 0).toFixed(2)}€`,
    estado: estadoDocumentoMap[p.estado] ?? "DESCONOCIDO",
  }));
}

export async function getPedidosImporteCobrado(entradaDocumento: number): Promise<PedidoCargaTrabajoUI[]> {
  const db = await getDB();

  const query = `
    SELECT 
      entradaDocumento,
      nombreCliente,
      direccionEnvio,
      importeTotal,
      metodoPago,
      fechaDocumento
    FROM ls_pedido
    WHERE entradaDocumento = ?
  `;

  const rows = await db.getAllAsync<PedidoImporteCobradoRow>(query, [entradaDocumento]);

  return rows.map((p) => ({
    id: p.entradaDocumento,
    cliente: p.nombreCliente,
    calle: p.direccionEnvio,
    descripcion: p.metodoPago ?? "Sin descripción",
    importe: `${Number(p.importeTotal || 0).toFixed(2)}€`
  }));
}

export async function getPedidosDetallesPedido(
  entradaDocumento: number
): Promise<PedidoDetallesPedidoUI[]> {
  const db = await getDB();

  const query = `
    SELECT 
      lp.numeroLinea,
      lp.entradaDocumento,
      lp.descripcion,
      lp.cantidad AS unidades,
      lp.precioConIVA AS importe,
      lp.estadoLinea AS estadoLinea,
      lp.incidenciaLinea AS incidenciaLinea,
      p.dniReceptor AS dniReceptor,
      p.nombreReceptor AS nombreReceptor,
      p.observacionesEntrega AS observacionesEntrega,
      p.nombreCliente AS cliente,
      p.estadoDocumento AS estadoPedido,
      p.direccionEnvio AS calle
    FROM ls_lineas_pedido lp
    INNER JOIN ls_pedido p 
      ON lp.entradaDocumento = p.entradaDocumento
    WHERE lp.entradaDocumento = ?
    ORDER BY lp.numeroLinea ASC
    `;

  const rows = await db.getAllAsync<PedidoDetallesPedidoRow>(query ,[entradaDocumento]);

  return rows.map((l) => ({
    id: l.numeroLinea,
    cliente: l.cliente,
    calle: l.calle,
    estadoPedido: l.estadoPedido,
    entradaDocumento: l.entradaDocumento?.toString() ?? "—",
    descripcion: l.descripcion ?? "",
    unidades: Number(l.unidades) || 0,
    estadoLinea: l.estadoLinea ? Number(l.estadoLinea) : 1,
    incidenciaLinea:
    l.incidenciaLinea !== null && l.incidenciaLinea !== undefined
    ? Number(l.incidenciaLinea) : 0,
    dniReceptor: l.dniReceptor ?? "",
    nombreReceptor: l.nombreReceptor ?? "",
    observacionesEntrega: l.observacionesEntrega ?? "",
    importe: Number(l.importe || 0),
  }));
}


export async function getResumenPedidosPorEstado(fechaISO: string): Promise<ConteoEstadoPedidosPorDiaRowUI[]> {
  const db = await getDB();

  const query = `
    SELECT
      -- Pedidos que NO están completados
      (SELECT COUNT(*) 
       FROM ls_pedido 
       WHERE estadoDocumento = 1 AND DATE(REPLACE(fechaDocumento, 'T', ' ')) = DATE(?)) AS enReparto,

      -- Pedidos completados
      (SELECT COUNT(*) 
       FROM ls_pedido 
       WHERE estadoDocumento = 3 AND DATE(REPLACE(fechaDocumento, 'T', ' ')) = DATE(?)) AS entregados,

      -- Pedidos con incidencias
      (SELECT COUNT(*) 
       FROM ls_pedido 
       WHERE estadoDocumento = 4 AND DATE(REPLACE(fechaDocumento, 'T', ' ')) = DATE(?)) AS conIncidencias
  `;

  const row = await db.getFirstAsync<ConteoEstadoPedidosPorDiaRowUI>(query, [fechaISO, fechaISO, fechaISO]);
  
  if (!row) {
    return [{
      enReparto: 0,
      entregados: 0,
      conIncidencias: 0
    }];
  }

  return [row];
}

export async function getImporteTotalDiario(fecha: string): Promise<CierreDeCajaRowUI> {
  const db = await getDB();

  const query = `
    SELECT 
      (SELECT SUM(importeTotal) 
       FROM ls_pedido 
       WHERE DATE(REPLACE(fechaActualizacion, 'T', ' ')) = DATE(?) 
         AND estadoDocumento = 3) AS importeTotalDiario,

      (SELECT SUM(importeTotal) 
       FROM ls_pedido
       WHERE DATE(REPLACE(fechaActualizacion, 'T', ' ')) = DATE(?)
         AND UPPER(metodoPago) = "EFECTIVO" 
         AND estadoDocumento = 3) AS importeTotalEfectivo,

      (SELECT SUM(importeTotal) 
       FROM ls_pedido
       WHERE DATE(REPLACE(fechaActualizacion, 'T', ' ')) = DATE(?)
         AND UPPER(metodoPago) = "BIZUM" 
         AND estadoDocumento = 3) AS importeTotalBizum,

      (SELECT SUM(importeTotal) 
       FROM ls_pedido
       WHERE DATE(REPLACE(fechaActualizacion, 'T', ' ')) = DATE(?)
         AND UPPER(metodoPago) = "TARJETA" 
         AND estadoDocumento = 3) AS importeTotalTarjeta
  `;

  const row = await db.getFirstAsync<CierreDeCajaRowUI>(query, [
    fecha, fecha, fecha, fecha
  ]);

  return {
    importeTotalDiario: row?.importeTotalDiario ?? 0,
    importeTotalEfectivo: row?.importeTotalEfectivo ?? 0,
    importeTotalBizum: row?.importeTotalBizum ?? 0,
    importeTotalTarjeta: row?.importeTotalTarjeta ?? 0,
  };
}



export async function getDiarioPorEstadoCaja(fecha: string): Promise<ConteoEstadoPedidosPorDiaCajaRowUI> {
  const db = await getDB();

  const query = `
    SELECT
      (SELECT COUNT(*)
       FROM ls_pedido
       WHERE estadoDocumento = 3
       AND DATE(REPLACE(fechaActualizacion,'T',' ')) = DATE(?)
      ) AS entregados,

      (SELECT COUNT(*)
       FROM ls_pedido
       WHERE estadoDocumento = 4
       AND DATE(REPLACE(fechaActualizacion,'T',' ')) = DATE(?)
      ) AS conIncidencias
  `;

  const row = await db.getFirstAsync<ConteoEstadoPedidosPorDiaCajaRowUI>(query, [
    fecha, fecha
  ]);

  return row ?? { entregados: 0, conIncidencias: 0 };
}




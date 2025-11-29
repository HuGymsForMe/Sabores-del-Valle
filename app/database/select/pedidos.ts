import { getDB } from "@/app/database/db";
import { CierreDeCajaUI, PedidoCargaTrabajoUI, PedidoDetallesPedidoUI } from "@/app/database/types";

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
      estadoDocumento AS estado,
      fechaDocumento    
    FROM ls_pedido
    WHERE DATE(REPLACE(fechaDocumento, 'T', ' ')) = DATE(?)
    ORDER BY fechaDocumento DESC
  `;

  const rows = await db.getAllAsync(query, [fechaISO]);

  console.log("📆 Buscando pedidos del día:", fechaISO, "→ encontrados:", rows.length);

  return rows.map((p: any) => ({
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

  const rows = await db.getAllAsync(query, [entradaDocumento]);

  return rows.map((p: any) => ({
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

  const rows = await db.getAllAsync(
    `
    SELECT 
      lp.numeroLinea,
      lp.entradaDocumento,
      lp.descripcion,
      lp.cantidad AS unidades,
      lp.precioConIVA AS importe,
      lp.estadoLinea AS estadoLinea,
      lp.incidenciaLinea AS incidenciaLinea,
      p.nombreCliente AS cliente,
      p.estadoDocumento AS estadoPedido,
      p.direccionEnvio AS calle
    FROM ls_lineas_pedido lp
    INNER JOIN ls_pedido p 
      ON lp.entradaDocumento = p.entradaDocumento
    WHERE lp.entradaDocumento = ?
    ORDER BY lp.numeroLinea ASC
    `,
    [entradaDocumento]
  );

  return rows.map((l: any) => ({
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
    ? Number(l.incidenciaLinea)
    : 0,
    importe: Number(l.importe || 0),
  }));
}


export async function getResumenPedidosPorEstado(fechaISO: string): Promise<any> {
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

  const row = await db.getFirstAsync(query, [fechaISO, fechaISO, fechaISO]);
  return row;
}

export async function getImporteTotalDiario(): Promise<CierreDeCajaUI> {
  const db = await getDB();

  const hoy = new Date().toISOString().split("T")[0];

  const row = await db.getFirstAsync<CierreDeCajaUI>(
    `
    SELECT 
      (SELECT SUM(importeTotal) 
       FROM ls_pedido 
       WHERE DATE(REPLACE(fechaActualizacion, 'T', ' ')) = DATE(?) 
         AND estadoDocumento == 3) AS importeTotalDiario,

      (SELECT SUM(importeTotal) 
       FROM ls_pedido 
       WHERE DATE(REPLACE(fechaActualizacion, 'T', ' ')) = DATE(?) 
         AND UPPER(metodoPago) = "EFECTIVO" 
         AND estadoDocumento == 3) AS importeTotalEfectivo,

      (SELECT SUM(importeTotal) 
       FROM ls_pedido 
       WHERE DATE(REPLACE(fechaActualizacion, 'T', ' ')) = DATE(?) 
         AND UPPER(metodoPago) = "BIZUM" 
         AND estadoDocumento == 3) AS importeTotalBizum,

      (SELECT SUM(importeTotal) 
       FROM ls_pedido 
       WHERE DATE(REPLACE(fechaActualizacion, 'T', ' ')) = DATE(?) 
         AND UPPER(metodoPago) = "TARJETA" 
         AND estadoDocumento == 3) AS importeTotalTarjeta
    `,
    [hoy, hoy, hoy, hoy]
  );

  return {
    importeTotalDiario: row?.importeTotalDiario ?? 0,
    importeTotalEfectivo: row?.importeTotalEfectivo ?? 0,
    importeTotalBizum: row?.importeTotalBizum ?? 0,
    importeTotalTarjeta: row?.importeTotalTarjeta ?? 0,
  };
}

export async function getImporteTotalDiarioPorEstadoCaja() {
  const db = await getDB();

  const hoy = new Date().toISOString().split("T")[0];

  const row:any = await db.getFirstAsync(
    `
    SELECT

      -- Completados (estado 3)
      (SELECT COUNT(*)
       FROM ls_pedido
       WHERE estadoDocumento = 3
       AND DATE(REPLACE(fechaActualizacion,'T',' ')) = DATE(?)
      ) AS entregados,

      -- Con incidencia (estado 4)
      (SELECT COUNT(*)
       FROM ls_pedido
       WHERE estadoDocumento = 4
       AND DATE(REPLACE(fechaActualizacion,'T',' ')) = DATE(?)
      ) AS conIncidencias
    `,
    [hoy, hoy]
  );

  return {
    entregados: row?.entregados ?? 0,
    conIncidencias: row?.conIncidencias ?? 0,
  };
}



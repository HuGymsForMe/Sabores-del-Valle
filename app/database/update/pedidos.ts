import { getDB } from "@/app/database/db";

export async function updateIncidenciaPedido(
  entradaDocumento: number,
  numeroLinea: number,
  estado: number,
  incidencia: number | null = null
) {
  const db = await getDB();

  try {
    await db.runAsync(
      `UPDATE ls_lineas_pedido 
       SET estadoLinea = ?, incidenciaLinea = ?
       WHERE entradaDocumento = ? AND numeroLinea = ?`,
      [estado, incidencia, entradaDocumento, numeroLinea]
    );

    console.log(`✅ Línea ${numeroLinea} → Estado ${estado} | Incidencia ${incidencia}`);
    return true;

  } catch (error) {
    console.error("❌ Error actualizando línea:", error);
    return false;
  }
}

export async function updateEstadoPedido(entradaDocumento: number) {
  const db = await getDB();

  try {
    const lineas = await db.getAllAsync(
      `SELECT estadoLinea FROM ls_lineas_pedido WHERE entradaDocumento = ?`,
      [entradaDocumento]
    );

    if (!lineas || lineas.length === 0) {
      console.warn("⚠️ Pedido sin líneas:", entradaDocumento);
      return false;
    }

    const todasCompletadas = lineas.every((l: any) => Number(l.estadoLinea) === 3);

    const nuevoEstado = todasCompletadas ? 3 : 4;

    await db.runAsync(
      `
      UPDATE ls_pedido 
      SET estadoDocumento = ?, fechaActualizacion = ?
      WHERE entradaDocumento = ?
      `,
      [nuevoEstado, new Date().toISOString(), entradaDocumento]
    );

    console.log(
      `🔄 Pedido ${entradaDocumento} actualizado → estadoDocumento = ${nuevoEstado}`
    );

    return true;

  } catch (error) {
    console.error("❌ Error actualizando estado del pedido:", error);
    return false;
  }
}



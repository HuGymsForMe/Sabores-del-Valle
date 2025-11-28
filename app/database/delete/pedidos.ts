import { getDB } from "../db";

export async function deletePedido(entradaDocumento: number) {
  const db = await getDB();

  try {
    await db.runAsync(`DELETE FROM ls_pedido WHERE entradaDocumento = ?`, [entradaDocumento]);
    console.log(`🗑️ Pedido ${entradaDocumento} eliminado correctamente`);
    return true;
  } catch (error) {
    console.error("❌ Error al eliminar el pedido:", error);
    return false;
  }
}

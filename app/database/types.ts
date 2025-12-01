/** getPedidosCargaTrabajo  **/
export interface PedidoCargaTrabajoRow {
  entradaDocumento: number;
  nombreCliente: string;
  direccionEnvio: string;
  importeTotal: number;
  metodoPago: string | null;
  estado: number;
}

export interface PedidoCargaTrabajoUI {
  id: number;            
  cliente: string;       
  calle: string;         
  descripcion: string;   
  importe: string;  
  estado?: string;     
}

/** getPedidosImporteCobrado **/
export interface PedidoImporteCobradoRow {
  entradaDocumento: number;
  nombreCliente: string;
  direccionEnvio: string;
  importeTotal: number;
  metodoPago: string | null;
  fechaDocumento: string;
}

/** getPedidosDetallesPedido **/
export interface PedidoDetallesPedidoRow {
  numeroLinea: number;
  entradaDocumento: number;
  descripcion: string;
  unidades: number;
  importe: number;
  estadoLinea: number;
  incidenciaLinea: number;
  cliente: string;
  estadoPedido: number;
  calle: string;
  dniReceptor: string;
  nombreReceptor: string;
  observacionesEntrega: string;
}

export interface PedidoDetallesPedidoUI {
  id: number;            
  cliente: string;    
  estadoPedido: number;   
  calle: string;         
  entradaDocumento: string;
  descripcion: string;
  unidades: number;
  estadoLinea: number;
  incidenciaLinea: number;
  importe: number;
  dniReceptor: string;
  nombreReceptor: string;
  observacionesEntrega: string;
}

/** getResumenPedidosPorEstado **/
export interface ConteoEstadoPedidosPorDiaRowUI {
  enReparto: number;
  entregados: number;
  conIncidencias: number;
}

/** getImporteTotalDiario **/
export interface CierreDeCajaRowUI {
  importeTotalDiario: number;
  importeTotalEfectivo: number;
  importeTotalBizum: number;
  importeTotalTarjeta: number;
}

/** getDiarioPorEstadoCaja **/
export interface ConteoEstadoPedidosPorDiaCajaRowUI {
  entregados: number;
  conIncidencias: number;
}





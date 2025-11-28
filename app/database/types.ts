export interface PedidoCargaTrabajoUI {
  id: number;            
  cliente: string;       
  calle: string;         
  descripcion: string;   
  importe: string;       
  tipoEntrega: string;   
  estado: string;        
}

export interface PedidoDetallesPedidoUI {
  id: number;            
  cliente: string;    
  estadoPedido: number;   
  calle: string;         
  codigoPedido: string;
  descripcion: string;
  unidades: number;
  estadoLinea: number;
  incidenciaLinea: number;
  importe: number;
}

export interface CierreDeCajaUI {
  importeTotalDiario: number;
  importeTotalEfectivo: number;
  importeTotalBizum: number;
  importeTotalTarjeta: number;
}




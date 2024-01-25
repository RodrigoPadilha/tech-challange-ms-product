import { PedidoEntity, PedidoStatus } from "@src/entities/PedidoEntity";

export interface IConnectionDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getConnection(): any;

  listPedidos(): Promise<any>;
  savePedido(newPedido: PedidoEntity): Promise<any>;
  findPedidoById(pedidoId: string): Promise<any>;
  updatePedido(pedidoId: string, newStatus: PedidoStatus): Promise<any>;
}

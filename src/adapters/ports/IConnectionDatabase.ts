import { PedidoEntity } from "@src/entities/PedidoEntity";

export interface IConnectionDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getConnection(): any;

  listPedidos(): Promise<any>;
  savePedido(newPedido: PedidoEntity): Promise<any>;
}

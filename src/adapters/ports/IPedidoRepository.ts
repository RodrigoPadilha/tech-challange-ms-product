import { PedidoEntity, PedidoStatus } from "@src/entities/PedidoEntity";

export interface IPedidoRepository {
  listAllPedidos(): Promise<PedidoEntity[]>;
  savePedido(newPedido: PedidoEntity): Promise<string>;
  findPedidoById(pedidoId: string): Promise<PedidoEntity>;
  updatePedido(pedidoId: string, newStatus: PedidoStatus): Promise<string>;
}

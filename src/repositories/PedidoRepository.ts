import { IPedidoRepository } from "@adapters/ports/IPedidoRepository";
import { PedidoEntity, PedidoStatus } from "@src/entities/PedidoEntity";

export class PedidoRepository implements IPedidoRepository {
  listAllPedidos(): Promise<PedidoEntity[]> {
    throw new Error("Method not implemented.");
  }
  savePedido(novoPedido: PedidoEntity): Promise<string> {
    throw new Error("Method not implemented.");
  }
  findPedidoById(pedidoId: any): Promise<PedidoEntity> {
    throw new Error("Method not implemented.");
  }
  updatePedido(pedidoId: string, newStatus: PedidoStatus): Promise<string> {
    throw new Error("Method not implemented.");
  }
}

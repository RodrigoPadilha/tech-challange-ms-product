import { IPedidoRepository } from "@adapters/ports/IPedidoRepository";
import { PedidoEntity } from "@src/entities/PedidoEntity";

export class PedidoRepository implements IPedidoRepository {
  savePedido(novoPedido: PedidoEntity): Promise<string> {
    throw new Error("Method not implemented.");
  }
  listAllPedidos(): Promise<PedidoEntity[]> {
    throw new Error("Method not implemented.");
  }
}

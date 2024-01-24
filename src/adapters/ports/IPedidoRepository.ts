import { PedidoEntity, PedidoStatus } from "@src/entities/PedidoEntity";
import { ListPedidosError } from "@src/repositories/errors/ListPedidosError";

export interface IPedidoRepository {
  listAllPedidos(): Promise<PedidoEntity[] | ListPedidosError>;
  savePedido(newPedido: PedidoEntity): Promise<string>;
  findPedidoById(pedidoId: string): Promise<PedidoEntity>;
  updatePedido(pedidoId: string, newStatus: PedidoStatus): Promise<string>;
}

import { PedidoEntity } from "@src/entities/PedidoEntity";

export interface IPedidoRepository {
  listAllPedidos(): Promise<PedidoEntity[]>;
  savePedido(novoPedido: PedidoEntity): Promise<string>;
}

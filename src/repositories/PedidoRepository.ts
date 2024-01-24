import { IConnectionDatabase } from "@adapters/ports/IConnectionDatabase";
import { IPedidoRepository } from "@adapters/ports/IPedidoRepository";
import { PedidoEntity, PedidoStatus } from "@src/entities/PedidoEntity";
import { ListPedidosError } from "./errors/ListPedidosError";

export class PedidoRepository implements IPedidoRepository {
  constructor(private readonly connection: IConnectionDatabase) {}
  async listAllPedidos(): Promise<PedidoEntity[] | ListPedidosError> {
    try {
      const pedidosData = await this.connection.listPedidos();
      const pedidosEntities = pedidosData.map((pedido) => {
        const pedidoEntity = this.pedidoEntityFacotry(pedido);
        return pedidoEntity;
      });

      return pedidosEntities;
    } catch (error) {
      console.log("==> Err:", error);
      throw new ListPedidosError(error);
    } finally {
      await this.connection.disconnect();
    }
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

  private pedidoEntityFacotry(dataEntity) {
    const pedidoEntity = new PedidoEntity(
      dataEntity.valor,
      Object.entries(PedidoStatus).find(
        ([key, enumValue]) => enumValue === dataEntity.status
      )?.[0] as PedidoStatus,
      dataEntity.itens,
      dataEntity.cliente,
      dataEntity.id
    );
    return pedidoEntity;
  }
}

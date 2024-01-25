import { IConnectionDatabase } from "@adapters/ports/IConnectionDatabase";
import { IPedidoRepository } from "@adapters/ports/IPedidoRepository";
import { PedidoEntity, PedidoStatus } from "@src/entities/PedidoEntity";
import { ListPedidosError } from "./errors/ListPedidosError";
import { SavePedidoError } from "./errors/SavePedidoError";
import { FindPedidoError } from "./errors/FindPedidoError";
import { UpdatePedidoError } from "./errors/UpdatePedidoError";

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
      console.log("==> Err: listAllPedidos", error);
      throw new ListPedidosError(error);
    } finally {
      await this.connection.disconnect();
    }
  }

  async savePedido(novoPedido: PedidoEntity): Promise<string> {
    try {
      const pedidoId = await this.connection.savePedido(novoPedido);
      return pedidoId;
    } catch (error) {
      console.log("==> Err: savePedido", error);
      throw new SavePedidoError();
    }
  }

  async findPedidoById(pedidoId: string): Promise<PedidoEntity> {
    try {
      const pedidoData = await this.connection.findPedidoById(pedidoId);
      const pedidoEntity = this.pedidoEntityFacotry(pedidoData);
      return pedidoEntity;
    } catch (error) {
      throw new FindPedidoError();
    }
  }

  async updatePedido(
    pedidoId: string,
    newStatus: PedidoStatus
  ): Promise<string> {
    try {
      const pedidoData = await this.connection.updatePedido(
        pedidoId,
        newStatus
      );
      return pedidoData.id;
    } catch (error) {
      throw new UpdatePedidoError();
    }
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

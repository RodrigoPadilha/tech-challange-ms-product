import { IPedidoRepository } from "@adapters/ports/IPedidoRepository";
import { PedidoDto } from "./interface";
import { PedidoEntity, PedidoStatus } from "@src/entities/PedidoEntity";

export class PedidoService {
  constructor(private readonly repository: IPedidoRepository) {}

  async listPedidos() {
    let result: any;
    const transaction = await this.repository.startTransaction();
    try {
      await this.repository.inTransaction(transaction, async () => {
        result = await this.repository.listAllPedidos();
      });
      await this.repository.commitTransaction(transaction);
      return result;
    } catch (error) {
      await this.repository.rollbackTransaction(transaction);
      throw error;
    }
  }

  async createPedido(pedidoDto: PedidoDto) {
    let result: any;
    const transaction = await this.repository.startTransaction();
    try {
      const { id, cliente, itens, status, valor } = pedidoDto;
      const itensParsed = itens.map((iten) => ({
        descricao: iten.descricao,
        qtd: iten.qtd,
      }));
      const pedidoEntity = new PedidoEntity(
        valor,
        status,
        itensParsed,
        cliente,
        id
      );
      await this.repository.inTransaction(transaction, async () => {
        result = await this.repository.savePedido(pedidoEntity);
      });
      return result;
    } catch (error) {
      await this.repository.rollbackTransaction(transaction);
      throw error;
    }
  }

  async findPedido(pedidoId: string) {
    const result = await this.repository.findPedidoById(pedidoId);
    return result;
  }

  async updatePedido(pedidoId: string, newStatus: PedidoStatus) {
    let result;
    const transaction = await this.repository.startTransaction();
    try {
      await this.repository.inTransaction(transaction, async () => {
        result = await this.repository.updatePedido(pedidoId, newStatus);
      })
      await this.repository.commitTransaction(transaction);
      return result;
    } catch (error) {
      await this.repository.rollbackTransaction(transaction);
      throw error;
    }
  }
}

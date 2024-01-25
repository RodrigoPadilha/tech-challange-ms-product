import { IPedidoRepository } from "@adapters/ports/IPedidoRepository";
import { PedidoDto } from "./interface";
import { PedidoEntity, PedidoStatus } from "@src/entities/PedidoEntity";
import { ItemTipo } from "@src/entities/ItemEntity";

export class PedidoService {
  constructor(private readonly repository: IPedidoRepository) {}

  async listPedidos() {
    const result = await this.repository.listAllPedidos();
    return result;
  }

  async createPedido(pedidoDto: PedidoDto) {
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
    const result = await this.repository.savePedido(pedidoEntity);
    return result;
  }

  async findPedido(pedidoId: string) {
    const result = await this.repository.findPedidoById(pedidoId);
    return result;
  }

  async updatePedido(pedidoId: string, newStatus: PedidoStatus) {
    const result = await this.repository.updatePedido(pedidoId, newStatus);
    return result;
  }
}

import { IPedidoRepository } from "@adapters/ports/IPedidoRepository";
import { PedidoDto } from "./interface";
import { PedidoEntity } from "@src/entities/PedidoEntity";

export class PedidoService {
  constructor(private readonly repository: IPedidoRepository) {}

  async listPedidos() {
    const result = await this.repository.listAllPedidos();
    return result;
  }

  async createPedido(pedidoDto: PedidoDto) {
    const { id, cliente, itens, status, valor } = pedidoDto;
    const pedidoEntity = new PedidoEntity(valor, status, itens, cliente, id);
    const result = await this.repository.savePedido(pedidoEntity);
    return result;
  }

  async findPedido(pedidoId: string) {
    return {
      id: "abc",
      valor: "1.78",
      status: "Aberto",
      itens: [
        {
          a: "",
          b: "",
        },
      ],
      cliente: "Rodrigo",
    };
  }

  async updatePedido(pedidoId: string) {
    return {};
  }
}

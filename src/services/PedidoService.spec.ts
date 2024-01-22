import { PedidoService } from "./PedidoService";
import { IPedidoRepository } from "@adapters/ports/IPedidoRepository";
import { PedidoEntity, PedidoStatus } from "@src/entities/PedidoEntity";
import { v4 as uuidv4 } from "uuid";
import { PedidoDto } from "./interface";

class PedidoRepositoryMock implements IPedidoRepository {
  private readonly pedidos: PedidoEntity[] = [];

  async savePedido(newPedido: PedidoEntity): Promise<string> {
    return new Promise((resolve, reject) => {
      this.pedidos.push(newPedido);
      resolve(newPedido.id);
    });
  }

  async listAllPedidos(): Promise<PedidoEntity[]> {
    return this.pedidos;
  }

  async findPedidoById(pedidoId: any): Promise<PedidoEntity> {
    return this.pedidos.find((pedido) => pedido.id === pedidoId);
  }

  async updatePedido(
    pedidoId: string,
    newStatus: PedidoStatus
  ): Promise<string> {
    const pedidoIndex = this.findPedidoIndexById(pedidoId);
    if (pedidoIndex === -1) {
      return undefined;
    }
    const pedidoToUpdate = this.pedidos[pedidoIndex];
    const pedidoUpdated = new PedidoEntity(
      pedidoToUpdate.valor,
      newStatus,
      pedidoToUpdate.itens,
      pedidoToUpdate.cliente,
      pedidoToUpdate.id
    );
    const updatedPedido = { ...pedidoToUpdate, status: newStatus };
    this.updatePedidoInArray(pedidoIndex, pedidoUpdated);
    return pedidoUpdated.id;
  }

  private findPedidoIndexById(pedidoId: string): number {
    return this.pedidos.findIndex((pedido) => pedido.id === pedidoId);
  }

  private updatePedidoInArray(
    index: number,
    updatedPedido: PedidoEntity
  ): void {
    this.pedidos.splice(index, 1, updatedPedido);
  }
}

describe("PedidoService", () => {
  beforeEach(() => {});

  describe("Listar Pedidos", () => {
    it("Deve salvar novo pedido", async () => {
      const pedidoRepository = new PedidoRepositoryMock();
      const pedidoService = new PedidoService(pedidoRepository);
      const pedidoId = uuidv4();
      const pedidoDto = buildPedidoDto(
        2.48,
        PedidoStatus.ABERTO,
        [{}],
        { nome: "Rodrigo", cpf: "83888888888" },
        pedidoId
      );

      const result = await pedidoService.createPedido(pedidoDto);

      expect(result).toBe(pedidoId);
    });

    it("Deve retornar lista de pedidos", async () => {
      const pedidoRepository = new PedidoRepositoryMock();
      const pedidoService = new PedidoService(pedidoRepository);
      const pedidoDto_1 = buildPedidoDto(
        2.48,
        PedidoStatus.ABERTO,
        [{}],
        { nome: "Rodrigo", cpf: "83888888888" },
        uuidv4()
      );
      const pedidoDto_2 = buildPedidoDto(
        35.48,
        PedidoStatus.ABERTO,
        [{}],
        { nome: "Mariana", cpf: "737333333344" },
        uuidv4()
      );

      await pedidoService.createPedido(pedidoDto_1);
      await pedidoService.createPedido(pedidoDto_2);

      const result = await pedidoService.listPedidos();

      expect(result).toEqual(expect.any(Array));
      expect(result.length).toEqual(2);
    });

    it("Deve encontrar um Pedido por pedidoId", async () => {
      const pedidoRepository = new PedidoRepositoryMock();
      const pedidoService = new PedidoService(pedidoRepository);
      const pedidoId = uuidv4();
      const pedidoDto = buildPedidoDto(
        2.48,
        PedidoStatus.ABERTO,
        [{}],
        { nome: "Rodrigo", cpf: "83888888888" },
        pedidoId
      );

      await pedidoService.createPedido(pedidoDto);
      const result = await pedidoService.findPedido(pedidoId);

      expect(result.id).toBe(pedidoId);
    });

    it("Deve atualizar status do pedido", async () => {
      const pedidoRepository = new PedidoRepositoryMock();
      const pedidoService = new PedidoService(pedidoRepository);
      const pedidoId = uuidv4();
      const pedidoDto = buildPedidoDto(
        2.48,
        PedidoStatus.ABERTO,
        [{}],
        { nome: "Rodrigo", cpf: "83888888888" },
        pedidoId
      );
      const newStatus = PedidoStatus.CANCELADO;

      await pedidoService.createPedido(pedidoDto);
      const result = await pedidoService.updatePedido(pedidoId, newStatus);
      const pedidoUpdated = await pedidoService.findPedido(result);

      expect(pedidoUpdated.status).toBe(newStatus);
    });
  });
});

const buildPedidoDto = (
  valor: number,
  status: PedidoStatus,
  itens: [{}],
  cliente: { nome: string; cpf: string },
  id: string
): PedidoDto => new PedidoDto(valor, status, itens, cliente, id);

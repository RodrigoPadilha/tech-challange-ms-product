import { PedidoService } from "./PedidoService";
import { IPedidoRepository } from "@adapters/ports/IPedidoRepository";
import { PedidoEntity, PedidoStatus } from "@src/entities/PedidoEntity";
import { v4 as uuidv4 } from "uuid";
import { PedidoDto } from "./interface";

class PedidoRepositoryMock implements IPedidoRepository {
  private readonly pedidos: PedidoEntity[] = [];

  savePedido(novoPedido: PedidoEntity): Promise<string> {
    return new Promise((resolve, reject) => {
      this.pedidos.push(novoPedido);
      resolve(novoPedido.getId());
    });
  }

  async listAllPedidos(): Promise<PedidoEntity[]> {
    return this.pedidos;
  }
}

describe("PedidoService", () => {
  beforeEach(() => {});

  describe("Listar Pedidos", () => {
    it("Deve salvar novo pedido", async () => {
      const pedidoRepository = new PedidoRepositoryMock();
      const pedidoService = new PedidoService(pedidoRepository);
      const pedidoId = uuidv4();
      const pedidoEntity = buildPedidoDto(
        2.48,
        PedidoStatus.ABERTO,
        [{}],
        { nome: "Rodrigo", cpf: "83888888888" },
        pedidoId
      );

      const result = await pedidoService.createPedido(pedidoEntity);

      expect(result).toBe(pedidoId);
    });

    it("Deve retornar lista de pedidos", async () => {
      const pedidoRepository = new PedidoRepositoryMock();
      const pedidoService = new PedidoService(pedidoRepository);
      const pedidoEntity_1 = buildPedidoDto(
        2.48,
        PedidoStatus.ABERTO,
        [{}],
        { nome: "Rodrigo", cpf: "83888888888" },
        uuidv4()
      );
      const pedidoEntity_2 = buildPedidoDto(
        35.48,
        PedidoStatus.ABERTO,
        [{}],
        { nome: "Mariana", cpf: "737333333344" },
        uuidv4()
      );

      await pedidoService.createPedido(pedidoEntity_1);
      await pedidoService.createPedido(pedidoEntity_2);

      const result = await pedidoService.listPedidos();

      expect(result).toEqual(expect.any(Array));
      expect(result.length).toEqual(2);
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

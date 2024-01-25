import { IConnectionDatabase } from "@adapters/ports/IConnectionDatabase";
import { PedidoRepository } from "./PedidoRepository";
import { v4 as uuidv4 } from "uuid";
import { ListPedidosError } from "./errors/ListPedidosError";
import { PedidoEntity, PedidoStatus } from "@src/entities/PedidoEntity";
import { SavePedidoError } from "./errors/SavePedidoError";
import { ItemTipo } from "@src/entities/ItemEntity";

describe("PedidoRepository", () => {
  let connectionMock: IConnectionDatabase;

  beforeEach(() => {
    connectionMock = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      getConnection: jest.fn().mockResolvedValue({}),
      listPedidos: jest.fn().mockResolvedValue({}),
      savePedido: jest.fn().mockResolvedValue({}),
    };
  });
  it("Deve retornar lista de pedidos com sucesso", async () => {
    (connectionMock.listPedidos as jest.Mock).mockImplementation(async () => {
      return [
        {
          valor: 1.99,
          status: "aberto",
          itens: [{}],
          cliente: [{}],
          id: uuidv4(),
        },
      ];
    });
    const repository = new PedidoRepository(connectionMock);

    const result = await repository.listAllPedidos();

    expect((result as [PedidoEntity]).length).toBe(1);
  });

  it("Deve retornar ListPedidosError quando ocorrer erro na busca", async () => {
    (connectionMock.listPedidos as jest.Mock).mockRejectedValue(
      new ListPedidosError("Erro ao listar pedidos")
    );

    const repository = new PedidoRepository(connectionMock);

    await expect(repository.listAllPedidos()).rejects.toThrow(
      "Erro ao listar pedidos"
    );
    expect(connectionMock.listPedidos).toHaveBeenCalled();
  });

  it("Deve incluir pedido com sucesso", async () => {
    const pedidoId = uuidv4();
    const newPedidoEntity: PedidoEntity = {
      valor: 1.99,
      status: PedidoStatus.ABERTO,
      itens: [
        {
          descricao: "Xis da Casas",
          qtd: 1,
          tipo: ItemTipo.LANCHE,
          valor: 19.95,
        },
      ],
      cliente: { cpf: "", nome: "" },
      id: pedidoId,
    };
    (connectionMock.savePedido as jest.Mock).mockImplementation(async () => {
      return pedidoId;
    });
    const repository = new PedidoRepository(connectionMock);

    const response = await repository.savePedido(newPedidoEntity);

    expect(response).toBe(pedidoId);
  });

  it("Deve retornar SavePedidoError quando ocorrer erro ao salvar pedido", async () => {
    const newPedidoEntity: PedidoEntity = {
      valor: 1.99,
      status: PedidoStatus.ABERTO,
      itens: [
        {
          descricao: "Xis da Casas",
          qtd: 1,
          tipo: ItemTipo.LANCHE,
          valor: 19.95,
        },
      ],
      cliente: { cpf: "", nome: "" },
      id: uuidv4(),
    };
    (connectionMock.savePedido as jest.Mock).mockRejectedValue(new Error());
    const repository = new PedidoRepository(connectionMock);
    try {
      await repository.savePedido(newPedidoEntity);
    } catch (error) {
      expect(error).toBeInstanceOf(SavePedidoError);
      expect(error.message).toBe("Erro ao salvar o pedido");
    }
    /**
     *   Segunda maneira de validar a exception na expectativa de erro
    await expect(repository.savePedido(newPedidoEntity)).rejects.toThrow(
      "Erro ao salvar o pedido"
    ); 
    */
    expect(connectionMock.savePedido).toHaveBeenCalled();
  });
});

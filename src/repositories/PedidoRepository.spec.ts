import { IConnectionDatabase } from "@adapters/ports/IConnectionDatabase";
import { PedidoRepository } from "./PedidoRepository";
import { v4 as uuidv4 } from "uuid";
import { ListPedidosError } from "./errors/ListPedidosError";
import { PedidoEntity } from "@src/entities/PedidoEntity";

describe("PedidoRepository", () => {
  let connectionMock: IConnectionDatabase;

  beforeEach(() => {
    connectionMock = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      getConnection: jest.fn().mockResolvedValue({}),
      listPedidos: jest.fn().mockResolvedValue({}),
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

  it("Deve retornar erro ListPedidosError quando ocorrer erro na busca", async () => {
    (connectionMock.listPedidos as jest.Mock).mockRejectedValue(
      new ListPedidosError("Erro ao listar pedidos")
    );

    const repository = new PedidoRepository(connectionMock);

    await expect(repository.listAllPedidos()).rejects.toThrow(
      "Erro ao listar pedidos"
    );
    expect(connectionMock.listPedidos).toHaveBeenCalled();

    /* 

    const result = await repository.listAllPedidos();

    expect((result as unknown as ListPedidosError).name).toBe(
      "ListPedidosError"
    ); */
  });
});

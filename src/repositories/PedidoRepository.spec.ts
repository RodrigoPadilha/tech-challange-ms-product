import { IConnectionDatabase } from "@adapters/ports/IConnectionDatabase";
import { PedidoRepository } from "./PedidoRepository";
import { v4 as uuidv4 } from "uuid";
import { ListPedidosError } from "./errors/ListPedidosError";
import { PedidoEntity, PedidoStatus } from "@src/entities/PedidoEntity";
import { SavePedidoError } from "./errors/SavePedidoError";
import { FindPedidoError } from "./errors/FindPedidoError";

describe("PedidoRepository", () => {
  let connectionMock: IConnectionDatabase;

  beforeEach(() => {
    connectionMock = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      getConnection: jest.fn().mockResolvedValue({}),
      listPedidos: jest.fn().mockResolvedValue({}),
      savePedido: jest.fn().mockResolvedValue({}),
      findPedidoById: jest.fn().mockResolvedValue({}),
    };
  });

  describe("ListAllPedidos", () => {
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
  });

  describe("SavePedido", () => {
    it("Deve incluir pedido com sucesso", async () => {
      const pedidoId = uuidv4();
      const newPedidoEntity: PedidoEntity = {
        valor: 1.99,
        status: PedidoStatus.ABERTO,
        itens: [
          {
            descricao: "Xis da Casas",
            qtd: 1,
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

  describe("FindPedidoById", () => {
    it("Deve buscar um pedido por id", async () => {
      const pedidoId = uuidv4();
      (connectionMock.findPedidoById as jest.Mock).mockImplementation(
        async () => {
          return {
            id: pedidoId,
            valor: 43,
            status: "ABERTO",
            itens: [
              {
                id: "980a67e5-3a3c-4b09-84b8-312f2cb8b2f4",
                descricao: "Xis da Casa",
                qtd: 2,
                pedidoPropsId: "bca6364b-a0d7-470e-879f-745f0e001f7d",
              },
            ],
            cliente: {
              id: "a04440f2-ca62-4ece-abce-6a2de083bc85",
              nome: "Rodrigo P Santos",
              cpf: "11111111111",
            },
          };
        }
      );
      const repository = new PedidoRepository(connectionMock);
      const response = await repository.findPedidoById(pedidoId);

      expect(response.id).toBe(pedidoId);
    });

    it("Deve retornar FindPedidoError quando ocorrer erro na busca por Id", async () => {
      const pedidoId = uuidv4();
      (connectionMock.findPedidoById as jest.Mock).mockRejectedValue(
        new Error()
      );
      const repository = new PedidoRepository(connectionMock);
      try {
        await repository.findPedidoById(pedidoId);
      } catch (error) {
        expect(error).toBeInstanceOf(FindPedidoError);
        expect(error.message).toBe("Erro ao buscar pedido por Id");
      }
      /**
       *   Segunda maneira de validar a exception na expectativa de erro
      await expect(repository.savePedido(newPedidoEntity)).rejects.toThrow(
        "Erro ao salvar o pedido"
      ); 
      */
      expect(connectionMock.findPedidoById).toHaveBeenCalled();
    });
  });
});

import { IPedidoRepository } from "@adapters/ports/IPedidoRepository";
import { PedidoController } from "./PedidoController";
import IHttpServer from "@adapters/ports/IHttpServer";
import { PedidoService } from "@src/services/PedidoService";
import { badRequest, serverError } from "@src/util/http-helper";
import { PedidoEntity, PedidoStatus } from "@src/entities/PedidoEntity";
import { ItemEntity } from "@src/entities/ItemEntity";
import { v4 as uuidv4 } from "uuid";
import { PedidoDto } from "@src/services/interface";

describe("PedidoController", () => {
  let httpServer: IHttpServer;
  let pedidoService: PedidoService;
  let pedidoController: PedidoController;
  const registerControllerParams = {
    mockParams: {},
    mockBody: {},
    mockQuery: {},
  };

  beforeEach(() => {
    // Mock IHttpServer
    httpServer = {
      register: jest.fn(),
      start: jest.fn().mockResolvedValue(undefined),
      stop: jest.fn().mockResolvedValue(undefined),
    };

    const mockPedidoRepository: jest.Mocked<IPedidoRepository> = {
      savePedido: jest.fn(),
      listAllPedidos: jest.fn(),
      findPedidoById: jest.fn(),
      updatePedido: jest.fn(),
    };
    pedidoService = new PedidoService(mockPedidoRepository);
    pedidoController = new PedidoController(httpServer, pedidoService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Register Endpoints", () => {
    it("Should register endpoint ListPedidos", () => {
      pedidoController.registerEndpointListPedidos();

      expect(httpServer.register).toHaveBeenCalledWith(
        "get",
        "/producao",
        expect.any(Function)
      );
    });

    it("Should register endpoint CreatePedido", () => {
      pedidoController.registerEndpointCreatePedido();

      expect(httpServer.register).toHaveBeenCalledWith(
        "post",
        "/producao",
        expect.any(Function)
      );
    });

    it("Should register endpoint FindPedido", () => {
      pedidoController.registerEndpointFindPedido();

      expect(httpServer.register).toHaveBeenCalledWith(
        "get",
        "/producao/:pedidoId",
        expect.any(Function)
      );
    });

    it("Should register endpoint UpdatePedido", () => {
      pedidoController.registerEndpointUpdatePedido();

      expect(httpServer.register).toHaveBeenCalledWith(
        "put",
        "/producao/:pedidoId",
        expect.any(Function)
      );
    });
  });

  describe("Request ListPedidosController", () => {
    it("Should return status 200 when list pedidos is called with Successful", async () => {
      const { mockParams, mockBody, mockQuery } = registerControllerParams;

      pedidoController.registerEndpointListPedidos();
      // Chama a função passada como argumento diretamente
      const handler = (httpServer.register as jest.Mock).mock.calls[0][2];
      const result = await handler(mockParams, mockBody, mockQuery);

      // Verifica se a função retorna uma resposta de sucesso
      expect(result.statusCode).toBe(200);
      expect(result.body.message).toBe("Retorno OK");
    });

    it("Should return status 500 when list pedidos is called with Fail", async () => {
      const { mockParams, mockBody, mockQuery } = registerControllerParams;

      const mockListPedidos = jest.spyOn(pedidoService, "listPedidos");
      mockListPedidos.mockRejectedValueOnce(new Error("Erro simulado"));
      pedidoController.registerEndpointListPedidos();
      // Chama a função passada como argumento diretamente
      const handler = (httpServer.register as jest.Mock).mock.calls[0][2];
      const result = await handler(mockParams, mockBody, mockQuery);

      // Verifica se a função retorna uma resposta de sucesso
      expect(result).toEqual(serverError(new Error("Erro simulado")));
      expect(result.statusCode).toBe(500);
      expect(result.body.message).toBe("Erro simulado");
    });
  });

  describe("Request CreatePedidosController", () => {
    it("Should return status 201 when create pedidos is called with Successful", async () => {
      const { mockParams, mockBody, mockQuery } = registerControllerParams;
      const pedidoDto = buildPedidoDto(
        2.48,
        PedidoStatus.ABERTO,
        [
          {
            descricao: "Xis da Casas",
            qtd: 1,
          },
        ],
        { nome: "Rodrigo", cpf: "83888888888" },
        uuidv4()
      );
      mockBody["valor"] = pedidoDto.valor;
      mockBody["status"] = pedidoDto.status;
      mockBody["itens"] = pedidoDto.itens;
      mockBody["cliente"] = pedidoDto.cliente;
      mockBody["id"] = pedidoDto.id;

      pedidoController.registerEndpointCreatePedido();
      // Chama a função passada como argumento diretamente
      const handler = (httpServer.register as jest.Mock).mock.calls[0][2];
      const result = await handler(mockParams, mockBody, mockQuery);
      const mockPedidoService = jest.spyOn(pedidoService, "createPedido");

      expect(result.statusCode).toBe(201);
      expect(result.body.message).toBe("Retorno OK");
    });
    it("Should return status 500 when create pedidos is called with Fail", async () => {
      const { mockParams, mockBody, mockQuery } = registerControllerParams;

      const mockCreatePedidos = jest.spyOn(pedidoService, "createPedido");
      mockCreatePedidos.mockRejectedValueOnce(new Error("Erro simulado"));
      pedidoController.registerEndpointCreatePedido();
      // Chama a função passada como argumento diretamente
      const handler = (httpServer.register as jest.Mock).mock.calls[0][2];
      const result = await handler(mockParams, mockBody, mockQuery);

      // Verifica se a função retorna uma resposta de sucesso
      expect(result).toEqual(serverError(new Error("Erro simulado")));
      expect(result.statusCode).toBe(500);
      expect(result.body.message).toBe("Erro simulado");
    });
  });

  describe("Request FindPedido", () => {
    it("Should return status 200 when find pedido is called with Successful", async () => {
      const { mockParams, mockBody, mockQuery } = registerControllerParams;
      const pedidoId = uuidv4();
      mockParams["pedidoId"] = pedidoId;
      const mockPedidoService = jest.spyOn(pedidoService, "findPedido");
      mockPedidoService.mockResolvedValueOnce(
        buildPedidoEntity(
          1.99,
          PedidoStatus.ABERTO,
          [
            {
              descricao: "Xis da Casas",
              qtd: 1,
            },
          ],
          {
            nome: "Any_name",
            cpf: "Any_cpf",
          },
          pedidoId
        )
      );

      pedidoController.registerEndpointFindPedido();
      // Chama a função passada como argumento diretamente
      const handler = (httpServer.register as jest.Mock).mock.calls[0][2];
      const result = await handler(mockParams, mockBody, mockQuery);

      expect(result.statusCode).toBe(200);
    });

    it("Should return status 400 when pedido not Found", async () => {
      const { mockParams, mockBody, mockQuery } = registerControllerParams;
      mockParams["pedidoId"] = uuidv4();

      const mockFindPedidos = jest.spyOn(pedidoService, "findPedido");
      mockFindPedidos.mockResolvedValueOnce(null);
      pedidoController.registerEndpointFindPedido();
      // Chama a função passada como argumento diretamente
      const handler = (httpServer.register as jest.Mock).mock.calls[0][2];
      const result = await handler(mockParams, mockBody, mockQuery);

      // Verifica se a função retorna uma resposta de sucesso
      expect(result).toEqual(badRequest({ message: "Pedido não encontrado" }));
      expect(result.statusCode).toBe(400);
      expect(result.body.message).toBe("Pedido não encontrado");
    });

    it("Should return status 500 when find pedidos is called with Fail", async () => {
      const { mockParams, mockBody, mockQuery } = registerControllerParams;
      mockParams["pedidoId"] = uuidv4();

      const mockfindPedidos = jest.spyOn(pedidoService, "findPedido");
      mockfindPedidos.mockRejectedValueOnce(new Error("Erro simulado"));
      pedidoController.registerEndpointFindPedido();
      // Chama a função passada como argumento diretamente
      const handler = (httpServer.register as jest.Mock).mock.calls[0][2];
      const result = await handler(mockParams, mockBody, mockQuery);

      // Verifica se a função retorna uma resposta de sucesso
      expect(result).toEqual(serverError(new Error("Erro simulado")));
      expect(result.statusCode).toBe(500);
      expect(result.body.message).toBe("Erro simulado");
    });
  });

  describe("Request UpdatePedidoController", () => {
    it("Should return status 200 when update pedido is called with Successful", async () => {
      const { mockParams, mockBody, mockQuery } = registerControllerParams;
      const pedidoId = uuidv4();

      mockParams["pedidoId"] = pedidoId;
      const mockPedidoService = jest.spyOn(pedidoService, "updatePedido");
      mockPedidoService.mockResolvedValueOnce(pedidoId);

      pedidoController.registerEndpointUpdatePedido();
      // Chama a função passada como argumento diretamente
      const handler = (httpServer.register as jest.Mock).mock.calls[0][2];
      const result = await handler(mockParams, mockBody, mockQuery);

      expect(result.statusCode).toBe(200);
    });

    it("Should return status 400 when pedidoId not Found", async () => {
      const { mockParams, mockBody, mockQuery } = registerControllerParams;
      mockParams["pedidoId"] = uuidv4();

      const mockUpdatePedido = jest.spyOn(pedidoService, "updatePedido");
      mockUpdatePedido.mockResolvedValueOnce(null);
      pedidoController.registerEndpointUpdatePedido();
      // Chama a função passada como argumento diretamente
      const handler = (httpServer.register as jest.Mock).mock.calls[0][2];
      const result = await handler(mockParams, mockBody, mockQuery);

      // Verifica se a função retorna uma resposta de sucesso
      expect(result).toEqual(badRequest({ message: "Pedido não encontrado" }));
      expect(result.statusCode).toBe(400);
      expect(result.body.message).toBe("Pedido não encontrado");
    });
    it("Should return status 500 when update pedidos is called with Fail", async () => {
      const { mockParams, mockBody, mockQuery } = registerControllerParams;
      mockParams["pedidoId"] = uuidv4();

      const mockUpdatePedido = jest.spyOn(pedidoService, "updatePedido");
      mockUpdatePedido.mockRejectedValueOnce(new Error("Erro simulado"));
      pedidoController.registerEndpointUpdatePedido();
      // Chama a função passada como argumento diretamente
      const handler = (httpServer.register as jest.Mock).mock.calls[0][2];
      const result = await handler(mockParams, mockBody, mockQuery);

      // Verifica se a função retorna uma resposta de sucesso
      expect(result).toEqual(serverError(new Error("Erro simulado")));
      expect(result.statusCode).toBe(500);
      expect(result.body.message).toBe("Erro simulado");
    });
  });
});

const buildPedidoEntity = (
  valor: number,
  status: PedidoStatus,
  itens: ItemEntity[],
  cliente: { nome: string; cpf: string },
  id: string
): PedidoEntity => new PedidoEntity(valor, status, itens, cliente, id);

const buildPedidoDto = (
  valor: number,
  status: PedidoStatus,
  itens: [
    {
      descricao: string;
      qtd: number;
    }
  ],
  cliente: { nome: string; cpf: string },
  id: string
): PedidoDto => new PedidoDto(valor, status, itens, cliente, id);

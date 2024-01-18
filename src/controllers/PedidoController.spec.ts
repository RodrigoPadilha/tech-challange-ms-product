import { PedidoController } from "./PedidoController";
import IHttpServer from "@adapters/ports/IHttpServer";
import { PedidoService } from "@src/services/PedidoService";
import { ok, serverError } from "@src/util/http-helper";

describe("PedidoController", () => {
  let httpServer: IHttpServer;
  let pedidoService: PedidoService;
  let pedidoController: PedidoController;

  beforeEach(() => {
    // Mock IHttpServer
    httpServer = {
      register: jest.fn(),
      start: jest.fn().mockResolvedValue(undefined),
      stop: jest.fn().mockResolvedValue(undefined),
    };

    pedidoService = new PedidoService();
    pedidoController = new PedidoController(httpServer, pedidoService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Register Endpoints", () => {
    it("Should register endpoint registerEndpointListPedidos", () => {
      pedidoController.registerEndpointListPedidos();

      expect(httpServer.register).toHaveBeenCalledWith(
        "get",
        "/producao",
        expect.any(Function)
      );
    });

    it("Should register endpoint registerEndpointCreatePedidos", () => {
      pedidoController.registerEndpointCreatePedidos();

      expect(httpServer.register).toHaveBeenCalledWith(
        "post",
        "/producao",
        expect.any(Function)
      );
    });
  });

  describe("Request ListPedidosController", () => {
    it("Should return status 200 when list products is called with Successful", async () => {
      const mockParams = {};
      const mockBody = {};
      const mockQuery = {};

      pedidoController.registerEndpointListPedidos();
      // Chama a função passada como argumento diretamente
      const handler = (httpServer.register as jest.Mock).mock.calls[0][2];
      const result = await handler(mockParams, mockBody, mockQuery);

      // Verifica se a função retorna uma resposta de sucesso
      expect(result.statusCode).toBe(200);
      expect(result.body.message).toBe("Retorno OK");
    });

    it("Should return status 500 when list products is called with Fail", async () => {
      const mockParams = {};
      const mockBody = {};
      const mockQuery = {};

      const mockListProducts = jest.spyOn(pedidoService, "listPedidos");
      mockListProducts.mockRejectedValueOnce(new Error("Erro simulado"));
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
      const mockParams = {};
      const mockBody = {};
      const mockQuery = {};

      pedidoController.registerEndpointCreatePedidos();
      // Chama a função passada como argumento diretamente
      const handler = (httpServer.register as jest.Mock).mock.calls[0][2];
      const result = await handler(mockParams, mockBody, mockQuery);

      expect(result.statusCode).toBe(201);
      expect(result.body.message).toBe("Retorno OK");
    });
    it("Should return status 500 when create pedidos is called with Fail", async () => {
      const mockParams = {};
      const mockBody = {};
      const mockQuery = {};

      const mockListProducts = jest.spyOn(pedidoService, "createPedido");
      mockListProducts.mockRejectedValueOnce(new Error("Erro simulado"));
      pedidoController.registerEndpointCreatePedidos();
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

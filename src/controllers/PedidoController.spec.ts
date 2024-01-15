import { PedidoController } from "./PedidoController";
import IHttpServer from "@adapters/ports/IHttpServer";
import { ok, serverError } from "@src/util/http-helper";

describe("PedidoController", () => {
  let httpServer: IHttpServer;
  let pedidoController: PedidoController;

  beforeEach(() => {
    // Mock IHttpServer
    httpServer = {
      register: jest.fn(),
      start: jest.fn().mockResolvedValue(undefined),
      stop: jest.fn().mockResolvedValue(undefined),
    };

    pedidoController = new PedidoController(httpServer);

    // Simula a chamada do método register
    pedidoController.registerEndpointListProducts();

    // Agora, acesse o callback a partir das chamadas do método register
    /* const registerCallback = (httpServer.register as jest.Mock).mock
      .calls[0][2]; */

    // Adicione isso para garantir que o método register seja chamado corretamente
    (httpServer.register as jest.Mock).mockImplementationOnce(
      (method: string, endpoint: string, callback: Function) => {
        // Simula o registro chamando o callback
        callback({}, {}, {});
      }
    );
  });

  describe("registerEndpointListProducts", () => {
    it('should register endpoint "/producao" with method "get"', async () => {
      // Arrange
      const expectedEndpoint = "/producao";
      const expectedMethod = "get";

      // Act
      pedidoController.registerEndpointListProducts();

      // Assert
      expect(httpServer.register).toHaveBeenCalledWith(
        expectedMethod,
        expectedEndpoint,
        expect.any(Function)
      );

      // You can also test the callback function, but it's not always necessary
    });

    it("should return ok when callback succeeds", async () => {
      // Arrange
      const registerCallback = (httpServer.register as jest.Mock).mock
        .calls[0][2];
      const mockParams = {};
      const mockBody = {};
      const mockQuery = {};

      // Act
      const result = await registerCallback(mockParams, mockBody, mockQuery);

      // Assert
      expect(result).toEqual(ok({ message: "Retorno OK" }));
    });

    it("should return server error when callback throws an error", async () => {
      const mockParams = {};
      const mockBody = {};
      const mockQuery = {};

      // Mock implementation of IHttpServer.register function
      const registerCallback = httpServer.register as jest.Mock;
      registerCallback.mockImplementationOnce(
        async (method: string, path: string, handler: Function) => {
          // Throw an error to simulate an error in the handler function
          const error = new Error("Mock error");
          const result = await handler(mockParams, mockBody, mockQuery);

          // Assert that the result is a server error
          expect(result).toEqual(serverError(error));
        }
      );

      await pedidoController.registerEndpointListProducts();
      expect(httpServer.register).toHaveBeenCalledWith(
        "get",
        "/producao",
        expect.any(Function)
      );
    });
  });
});
